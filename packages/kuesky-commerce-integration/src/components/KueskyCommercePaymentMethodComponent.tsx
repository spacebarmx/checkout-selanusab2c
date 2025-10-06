import {
    type AccountInstrument,
    type HostedInstrument,
    type PayPalCommerceAlternativeMethodsPaymentOptions,
    type PayPalCommerceCreditPaymentInitializeOptions,
    type PayPalCommercePaymentInitializeOptions,
    type PayPalCommerceVenmoPaymentInitializeOptions,
} from '@bigcommerce/checkout-sdk';
import React, { type FunctionComponent, useEffect, useRef } from 'react';

import { type PaymentMethodProps } from '@bigcommerce/checkout/payment-integration-api';

type PayPalCommerceProvidersPaymentInitializeOptions =
    PayPalCommerceAlternativeMethodsPaymentOptions &
        PayPalCommerceCreditPaymentInitializeOptions &
        PayPalCommercePaymentInitializeOptions &
        PayPalCommerceVenmoPaymentInitializeOptions;

interface PayPalCommercePaymentMethodComponentProps {
    providerOptionsKey: string;
    providerOptionsData?: Partial<PayPalCommerceProvidersPaymentInitializeOptions>;
    currentInstrument?: AccountInstrument;
    shouldConfirmInstrument?: boolean;
}

interface ButtonActions {
    disable: () => void;
    enable: () => void;
}

const KueskyCommercePaymentMethodComponent: FunctionComponent<
    PaymentMethodProps & PayPalCommercePaymentMethodComponentProps
> = ({
    method,
    checkoutService,
    paymentForm,
    onUnhandledError,
    providerOptionsKey,
    providerOptionsData,
    children,
    language,
}) => {
    const buttonActionsRef = useRef<ButtonActions | null>(null);
    const fieldsValuesRef = useRef<HostedInstrument | null>(null);
    const renderButtonRef = useRef<(() => void) | null>(null);

    const termsValue = paymentForm.getFieldValue('terms');

    const validateForm = async () => {
        const validationErrors = await paymentForm.validateForm();

        return Object.keys(validationErrors);
    };

    const validateButton = async () => {
        if (!buttonActionsRef.current) return;

        const keysValidation = await validateForm();

        if (keysValidation.length) {
            buttonActionsRef.current.disable();
        } else {
            buttonActionsRef.current.enable();
        }
    };

    useEffect(() => {
        void validateButton();
    }, [termsValue]);

    const initializePayment = async () => {
        try {
            await checkoutService.initializePayment({
                gatewayId: method.gateway,
                methodId: method.id,
                [providerOptionsKey]: {
                    container: '#checkout-payment-continue',
                    shouldRenderPayPalButtonOnInitialization: false,
                    onRenderButton: () => {
                        paymentForm.hidePaymentSubmitButton(method, true);
                    },
                    onInit: (onRenderButton: () => void) => {
                        renderButtonRef.current = onRenderButton;
                    },
                    submitForm: () => {
                        paymentForm.setSubmitted(true);
                        paymentForm.submitForm();
                    },
                    onError: (error: Error) => {
                        paymentForm.disableSubmit(method, true);

                        if (error.message === 'INSTRUMENT_DECLINED') {
                            onUnhandledError(
                                new Error(language.translate('payment.errors.instrument_declined')),
                            );
                        } else {
                            onUnhandledError(error);
                        }
                    },
                    onValidate: async (resolve: () => void, reject: () => void): Promise<void> => {
                        const keysValidation = await validateForm();

                        if (keysValidation.length) {
                            paymentForm.setSubmitted(true);
                            keysValidation.forEach((key) => paymentForm.setFieldTouched(key));

                            return reject();
                        }

                        return resolve();
                    },
                    onInitButton: async (actions: ButtonActions) => {
                        buttonActionsRef.current = actions;
                        await validateButton();
                    },
                    getFieldsValues: () => fieldsValuesRef.current,
                    ...(providerOptionsData || {}),
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                onUnhandledError(error);
            }
        }
    };

    const deinitializePayment = async () => {
        try {
            await checkoutService.deinitializePayment({
                gatewayId: method.gateway,
                methodId: method.id,
            });
        } catch (error) {
            if (error instanceof Error) {
                onUnhandledError(error);
            }
        }
    };

    useEffect(() => {
        void initializePayment();

        return () => {
            void deinitializePayment();
        };
    }, []);

    return children ? <>{children}</> : <></>;
};

export default KueskyCommercePaymentMethodComponent;
