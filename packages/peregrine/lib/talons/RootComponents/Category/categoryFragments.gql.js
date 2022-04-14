import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    # eslint-disable-next-line @graphql-eslint/require-id-when-available
    fragment CategoryFragment on CategoryTree {
        uid
        meta_title
        meta_keywords
        meta_description
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
        items {
            brand
            id
            uid
            name
            price_range {
                maximum_price {
                    regular_price {
                        currency
                        value
                    }
                }
            }
            price {
                regularPrice {
                    amount {
                        currency
                        value
                    }
                }
            }
            meta_description
            categories {
                uid
                breadcrumbs {
                    category_uid
                }
            }
            description {
                html
            }
            media_gallery_entries {
                uid
                label
                position
                disabled
                file
            }
            product_brand
            sku
            small_image {
                url
            }
            stock_status
            type_id
            url_key
            rating_summary
            __typename
            url_suffix
            custom_attributes {
                selected_attribute_options {
                    attribute_option {
                        uid
                        label
                        is_default
                    }
                }
                entered_attribute_value {
                    value
                }
                attribute_metadata {
                    uid
                    code
                    label
                    attribute_labels {
                        store_code
                        label
                    }
                    data_type
                    is_system
                    entity_type
                    ui_input {
                        ui_input_type
                        is_html_allowed
                    }
                    ... on ProductAttributeMetadata {
                        used_in_components
                    }
                }
            }
            ... on ConfigurableProduct {
                configurable_options {
                    attribute_code
                    attribute_uid
                    uid
                    label
                    values {
                        uid
                        default_label
                        label
                        store_label
                        use_default_value
                        value_index
                        swatch_data {
                            ... on ImageSwatchData {
                                thumbnail
                            }
                            value
                        }
                    }
                }
                variants {
                    attributes {
                        code
                        value_index
                    }
                    product {
                        uid
                        media_gallery_entries {
                            id
                            uid
                            disabled
                            file
                            label
                            position
                        }
                        sku
                        stock_status
                        price_range {
                            maximum_price {
                                regular_price {
                                    currency
                                    value
                                }
                            }
                        }
                    }
                }
            }
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
