import { type PaymentMethod } from '@bigcommerce/checkout-sdk';

import { useCheckout } from '@bigcommerce/checkout/payment-integration-api';

const useKueskyCommerce = (method: PaymentMethod) => {
    const { checkoutState } = useCheckout();
    const customer = checkoutState.data.getCustomer();

    return {
        // Properties
        customer,
        method,
        // Methods
    };
};

export default useKueskyCommerce;
