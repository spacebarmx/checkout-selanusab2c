import { type CheckoutStoreSelector } from '@bigcommerce/checkout-sdk';

import serverApi from './api';

const kueskiHandler = async (data: CheckoutStoreSelector) => {
    const { getOrder, getConfig } = data;
    const order = getOrder();
    const config = getConfig();

    if (!order || !config) return null;

    const { orderId } = order;
    const { storeHash } = config.storeProfile;

    const payload = {
        orderId,
        url: window.location.origin,
    };

    const { callbackUrl } = await serverApi.post<{ callbackUrl: string }>(
        '/kueski/payment',
        payload,
        { headers: { storeHash } },
    );

    return callbackUrl;
};

export default kueskiHandler;
