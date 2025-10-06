import React, { type FunctionComponent } from 'react';

import {
    type PaymentMethodProps,
    type PaymentMethodResolveId,
    toResolvableComponent,
} from '@bigcommerce/checkout/payment-integration-api';
import { LoadingOverlay } from '@bigcommerce/checkout/ui';

import KueskyCommercePaymentMethodComponent from '../components/KueskyCommercePaymentMethodComponent';

const KueskyCommercePaymentMethod: FunctionComponent<PaymentMethodProps> = (props) => {
    const {
        checkoutState: {
            data: { isPaymentDataRequired },
            statuses: { isLoadingPaymentMethod },
        },
        method,
    } = props;

    if (!isPaymentDataRequired()) {
        return null;
    }

    const isLoading = isLoadingPaymentMethod(method.id);

    return (
        <LoadingOverlay hideContentWhenLoading isLoading={isLoading}>
            <KueskyCommercePaymentMethodComponent providerOptionsKey="kueskycommerce" {...props} />
        </LoadingOverlay>
    );
};

export default toResolvableComponent<PaymentMethodProps, PaymentMethodResolveId>(
    KueskyCommercePaymentMethod,
    [{ id: 'kueskycommerce' }],
);
