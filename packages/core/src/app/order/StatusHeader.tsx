import React, { type FunctionComponent, memo } from 'react';

import { PrimaryHeader } from '../ui/header';

export interface HeaderProps {
    status: string;
}

const StatusHeader: FunctionComponent<HeaderProps> = ({ status }) => (
    <PrimaryHeader testId="order-confirmation-heading">
        <>Tu compra con kueski ha sido {status}</>
    </PrimaryHeader>
);

export default memo(StatusHeader);
