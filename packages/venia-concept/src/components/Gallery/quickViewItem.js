import React from 'react';
import { string, number, shape, func } from 'prop-types';
import Price from '@magento/venia-ui/lib/components/Price';
import { Form } from 'informed';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import Image from '@magento/venia-ui/lib/components/Image';
import classes from './quickViewItem.module.css';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import { Link } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';


const Options = React.lazy(() => import('@magento/venia-ui/lib/components/ProductOptions'));


const ItemPlaceholder = ({ classes }) => {
    const { formatMessage } = useIntl();

    return (
        <div className={classes.rootPending}>
            <div className={classes.imagesPending}>
                <Image
                    alt={formatMessage({
                        defaultMessage: 'Item',
                        id: 'item.placeholder'
                    })}
                    classes={{
                        image: classes.imagePending,
                        root: classes.imageContainer
                    }}
                    src={transparentPlaceholder}
                />
            </div>
            <div className={classes.namePending} />
            <div className={classes.pricePending} />
        </div>
    );
};

const QuickViewItem = props => {
    const { item, onCancel } = props;
    const talonProps = useProductFullDetail({ product: item });

    const {
        handleAddToCart,
        isAddToCartDisabled,
        isSupportedProductType,
    } = talonProps;

    const {
        description,
        name,
        product_brand,
        price,
        special_price,
        url_key,
        url_suffix,
        small_image,
    } = item;

    console.log(item)

    const productLink = resourceUrl(`/${url_key}${url_suffix || ''}`);

    if (!item) {
        return <ItemPlaceholder classes={classes} />;
    }

    let cartActionContent;
    console.log(description.html)
    if (!isProductConfigurable(item)) {
        cartActionContent = isSupportedProductType ? (
            <div className={classes.AddToCart}>
                <Button
                    disabled={isAddToCartDisabled}
                    priority={'high'}
                    propClass={'Dark'}
                    type={'submit'}
                >
                    <FormattedMessage
                        defaultMessage={'Add to bag'}
                        id={'quickView.addToBag'}
                    />
                </Button>
            </div>
        ) : null;
    }

    const addToCart = formValue => {
        handleAddToCart(formValue);
        onCancel();
    };

    return (
        <div className={classes.root}>
            <Image src={small_image.url} alt='Image not found' height={550} width={390} placeholder='Pr' type='image-product' />
            <div className={classes.productDetailWrapper}>
                {product_brand ? (
                    <p className={classes.brand}>{product_brand}</p>
                ) : null}
                <Link className={classes.name} title={name} to={productLink}>
                    <span>{name}</span>
                </Link>

                <Form className={classes.addToCartForm} onSubmit={addToCart}>
                    {price.regularPrice.amount.value !== 0 ? (
                        <div className={classes.price}>
                            <div className={classes.priceName}>
                                <FormattedMessage
                                    defaultMessage={'Price '}
                                    id={'quickView.price'}
                                />
                            </div>
                            <Price
                                currencyCode={
                                    price.regularPrice.amount.currency
                                }
                                specialValue={special_price}
                                value={price.regularPrice.amount.value}
                            />
                        </div>
                    ) : null}
                    <div className={classes.quantity}>
                        <div className={classes.quantityFields}>
                            <QuantityFields initialValue={1} itemId={item.id} />
                        </div>
                    </div>
                    {cartActionContent}
                </Form>
                {description && description.html ? (
                    <div className={classes.description}>
                        <RichContent html={description.html} />
                    </div>
                ) : null}


            </div>

        </div>
    );
};

QuickViewItem.propTypes = {
    item: shape({
        description: shape({
            html: string
        }),
        id: number.isRequired,
        name: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired,
        sku: string,
        special_price: number,
        url_key: string.isRequired,
        url_suffix: string
    }),
    onCancel: func
};

export default QuickViewItem;
