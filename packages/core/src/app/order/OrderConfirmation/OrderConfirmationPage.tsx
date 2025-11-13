import {
    type Order,
    type ShopperConfig,
    type ShopperCurrency,
    type StoreConfig,
    type StoreCurrency,
} from '@bigcommerce/checkout-sdk';
import classNames from 'classnames';
import DOMPurify from 'dompurify';
import React, { type ReactElement } from 'react';

import { ErrorModal } from '../../common/error';
import { getPasswordRequirementsFromConfig } from '../../customer';
import { isEmbedded } from '../../embeddedCheckout';
import {
    GuestSignUpForm,
    PasswordSavedSuccessAlert,
    SignedUpSuccessAlert,
    type SignUpFormValues,
} from '../../guestSignup';
import OrderConfirmationSection from '../OrderConfirmationSection';
import OrderStatus from '../OrderStatus';
import StatusHeader from '../StatusHeader';
import ThankYouHeader from '../ThankYouHeader';

import { ContinueButton } from './ContinueButton';
import { OrderSummaryContainer } from './OrderSummaryContainer';

interface OrderConfirmationPageProps {
    order: Order;
    config: StoreConfig;
    supportEmail: string;
    supportPhoneNumber: string | undefined;
    paymentInstructions: string | undefined;
    shouldShowPasswordForm: boolean;
    hasSignedUp: boolean | undefined;
    isSigningUp: boolean | undefined;
    onSignUp(values: SignUpFormValues): void;
    shopperConfig: ShopperConfig;
    customerCanBeCreated: boolean;
    siteLink: string;
    currency: StoreCurrency;
    shopperCurrency: ShopperCurrency;
    isShippingDiscountDisplayEnabled: boolean;
    error: Error | undefined;
    onErrorModalClose(): void;
}

export const OrderConfirmationPage = ({
    config,
    currency,
    customerCanBeCreated,
    error,
    hasSignedUp,
    isShippingDiscountDisplayEnabled,
    isSigningUp,
    onErrorModalClose,
    onSignUp,
    order,
    paymentInstructions,
    shopperConfig,
    shopperCurrency,
    shouldShowPasswordForm,
    siteLink,
    supportEmail,
    supportPhoneNumber,
}: OrderConfirmationPageProps): ReactElement => (
    <div
        className={classNames('layout optimizedCheckout-contentPrimary', {
        'is-embedded': isEmbedded(),
        })}
    >
        {order.status === 'DECLINED' ? (
            <div className="orderConfirmation">
                <OrderConfirmationSection>
                    <StatusHeader status='rechazada' />
                    <p>Lamentamos informarle que la transacción no pudo completarse.</p>
                    <p>Para conocer los detalles del rechazo y los próximos pasos, por favor, consulta el estado de tu solicitud directamente en tu cuenta de Kueski o comunícate con su soporte.</p>
                    <p>Puedes intentar con otra forma de pago (de momento no disponible)</p>
                    <ContinueButton siteLink={siteLink} />
                </OrderConfirmationSection>
            </div>
        ) : order.status === 'CANCELLED' ? (
            <div className="orderConfirmation">
                <OrderConfirmationSection>
                    <StatusHeader status='cancelada' />
                    <p>Lamentamos informarle que la transacción no pudo completarse.</p>
                    <p>Para conocer los detalles de la cancelación y los próximos pasos, por favor, consulta el estado de tu solicitud directamente en tu cuenta de Kueski o comunícate con su soporte.</p>
                    <p>Puedes intentar con otra forma de pago (de momento no disponible)</p>
                    <ContinueButton siteLink={siteLink} />
                </OrderConfirmationSection>
            </div>
        ) : (
            <div className="layout-main">
                <div className="orderConfirmation">
                    <ThankYouHeader name={order.billingAddress.firstName} />
                    <OrderStatus
                        config={config}
                        order={order}
                        supportEmail={supportEmail}
                        supportPhoneNumber={supportPhoneNumber}
                    />
                    {paymentInstructions && (
                        <OrderConfirmationSection>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(paymentInstructions),
                            }}
                            data-test="payment-instructions"
                        />
                        </OrderConfirmationSection>
                    )}

                    {shouldShowPasswordForm && !hasSignedUp && (
                        <GuestSignUpForm
                            customerCanBeCreated={customerCanBeCreated}
                            isSigningUp={isSigningUp}
                            onSignUp={onSignUp}
                            passwordRequirements={getPasswordRequirementsFromConfig(shopperConfig)}
                        />
                    )}

                    {hasSignedUp &&
                        (order?.customerId ? <PasswordSavedSuccessAlert /> : <SignedUpSuccessAlert />)}

                    <ContinueButton siteLink={siteLink} />
                </div>
            </div>
        )}

        {order.status !== 'DECLINED' && order.status !== 'CANCELLED' && (
            <OrderSummaryContainer
                currency={currency}
                isShippingDiscountDisplayEnabled={isShippingDiscountDisplayEnabled}
                order={order}
                shopperCurrency={shopperCurrency}
            />
        )}

        <ErrorModal error={error} onClose={onErrorModalClose} shouldShowErrorCode={false} />
    </div>
);
