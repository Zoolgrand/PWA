import React from 'react';
import { FocusScope } from 'react-aria';
import { bool, func, object } from 'prop-types';
import { Portal } from '../Portal';
import { X as CloseIcon } from 'react-feather';
import QuickViewItem from './quickViewItem';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { useIntl } from 'react-intl';
import classes from '../Portal/portal.module.css';

const QuickView = props => {
    const { isOpen, onCancel, product } = props;
    const { formatMessage } = useIntl();
    const close = formatMessage({ defaultMessage: '', id: 'global.close' });

    if (!isOpen) {
        return null;
    }

    const maybeCloseXButton = isOpen ? (
        <button
            className={classes.headerButton}
            onClick={onCancel}
            title={close}
            type={'reset'}
        >
            <Icon src={CloseIcon} />
        </button>
    ) : null;

    return (
        <Portal>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <FocusScope contain restoreFocus autoFocus>
                <aside>
                    <button
                        className={classes.mask}
                        onClick={onCancel}
                        title={close}
                        type={'reset'}
                    />
                    <div className={classes.portal}>
                        {maybeCloseXButton}
                        <QuickViewItem item={product} onCancel={onCancel} />
                    </div>
                </aside>
            </FocusScope>
        </Portal>
    );
};

QuickView.propTypes = {
    isOpen: bool,
    onCancel: func,
    product: object,
};

export default QuickView;
