import React from 'react';
import { string, number, shape } from 'prop-types';
import { Link } from 'react-router-dom';
import Price from '@magento/venia-ui/lib/components/Price';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './item.module.css';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import QuickView from '../QuickView/quickView';
import AddToCartbutton from '@magento/venia-ui/lib/components/Gallery/addToCartButton';
import { useScrollLock } from '@magento/peregrine/lib/hooks/useScrollLock';
import { Info } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

// eslint-disable-next-line no-unused-vars


// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
    .set(640, IMAGE_WIDTH)
    .set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    const {
        handleLinkClick,
        item,
        wishlistButtonProps,
        isSupportedProductType, 
        isOpenQuick, 
        iconOpacity, 
        handleOpen, 
        handleClose,
        setIconOpacity
    } = useGalleryItem(props);

    useScrollLock(isOpenQuick)

    const { storeConfig, layout } = props;
    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const classes = useStyle(defaultClasses, props.classes);

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    // eslint-disable-next-line no-unused-vars
    const { name, price_range, small_image, url_key, rating_summary } = item;

    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const wishlistButton = wishlistButtonProps ? (
        <WishlistGalleryButton {...wishlistButtonProps} />
    ) : null;

    const addButton = isSupportedProductType ? (
        <AddToCartbutton item={item} urlSuffix={productUrlSuffix} />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'galleryItem.unavailableProduct'}
                    defaultMessage={'Currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    // Hide the Rating component until it is updated with the new look and feel (PWA-2512).
    const ratingAverage = null;
    // const ratingAverage = rating_summary ? (
    //     <Rating rating={rating_summary} />
    // ) : null;

    return (
        <div
            data-cy="GalleryItem-root"
            className={classes.root}
            aria-live="polite"
            aria-busy="false"
            onMouseEnter={() => { setIconOpacity(1) }}
            onMouseLeave={() => { setIconOpacity(0) }}
        >
            <Link
                onClick={handleLinkClick}
                to={productLink}
                className={classes.images}
            >
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        loaded: classes.imageLoaded,
                        notLoaded: classes.imageNotLoaded,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    resource={smallImageURL}
                    widths={IMAGE_WIDTHS}
                />
                {ratingAverage}
            </Link>

            <FontAwesomeIcon
                className={classes.faIcon}
                style={{ opacity: iconOpacity }}
                onClick={() => handleOpen()}
                height={35}
                icon={faEye}
                width={35}
            />
            <div className={layout === 'list' ? classes.bottomWrap : null}>
                <Link
                    onClick={handleLinkClick}
                    to={productLink}
                    className={classes.name}
                    data-cy="GalleryItem-name"
                >
                    <span>{name}</span>
                </Link>
                <div data-cy="GalleryItem-price" className={classes.price}>
                    {item.brand && <div>Brand: {item.product_brand}</div>}
                    <Price
                        value={price_range.maximum_price.regular_price.value}
                        currencyCode={
                            price_range.maximum_price.regular_price.currency
                        }
                    />
                </div>

                <div className={classes.actionsContainer}>
                    {' '}
                    {addButton}
                    {wishlistButton}
                </div>
            </div>
            <QuickView
                isOpen={isOpenQuick}
                onCancel={handleClose}
                product={item}
            />

        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string
    })
};

export default GalleryItem;
