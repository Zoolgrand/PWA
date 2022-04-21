import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';
import { useState, useCallback } from 'react';

export const useGalleryItem = (props = {}) => {
    const { item, storeConfig } = props;

    const [isOpenQuick, setIsOpenQuick] = useState(false);
    const [iconOpacity, setIconOpacity] = useState(0)

    const handleOpen = useCallback(() => {
        setIsOpenQuick(true);
    }, [setIsOpenQuick]);

    const handleClose = useCallback(() => {
        setIsOpenQuick(false);
    }, [setIsOpenQuick]);

    const productType = item ? item.__typename : null;

    const isSupportedProductType = isSupported(productType);

    const wishlistButtonProps =
        storeConfig && storeConfig.magento_wishlist_general_is_enabled === '1'
            ? {
                  item: {
                      sku: item.sku,
                      quantity: 1
                  },
                  storeConfig
              }
            : null;

    return { ...props, wishlistButtonProps, isSupportedProductType, isOpenQuick, iconOpacity, handleOpen, handleClose,setIconOpacity };
};
