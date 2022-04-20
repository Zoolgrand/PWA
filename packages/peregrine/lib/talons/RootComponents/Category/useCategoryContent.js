import { useEffect, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';

import DEFAULT_OPERATIONS from './categoryContent.gql';

/**
 * Returns props necessary to render the categoryContent component.
 *
 * @param {object} props.data - The results of a getCategory GraphQL query.
 *
 * @returns {object} result
 * @returns {string} result.categoryDescription - This category's description.
 * @returns {string} result.categoryName - This category's name.
 * @returns {object} result.filters - The filters object.
 * @returns {object} result.items - The items in this category.
 * @returns {number} result.totalPagesFromData - The total amount of pages for the query.
 */
export const useCategoryContent = props => {
    const {
        categoryId,
        data,
        pageSize = 6,
        galleryRef,
        myCurrentPage,
        setMyCurrentPage,
        totalPages,
        isLoading,
        sectionRef,
        classes,
        urlParams,
        search,
        history
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const [itemsForRender, setItemsForRender] = useState([])
    const [view, setView] = useState(!urlParams.get('view') ? 'grid' : 'list');

    const {
        getCategoryContentQuery,
        getProductFiltersByCategoryQuery,
        getCategoryAvailableSortMethodsQuery
    } = operations;

    const placeholderItems = Array.from({ length: pageSize }).fill(null);

    const [getFilters, { data: filterData }] = useLazyQuery(
        getProductFiltersByCategoryQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const [getSortMethods, { data: sortData }] = useLazyQuery(
        getCategoryAvailableSortMethodsQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const { data: categoryData } = useQuery(getCategoryContentQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !categoryId,
        variables: {
            id: categoryId
        }
    });

    const filters = filterData ? filterData.products.aggregations : null;
    const items = data ? data.products.items : placeholderItems;
    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;
    const totalCount = data ? data.products.total_count : null;
    const categoryName = categoryData
        ? categoryData.categories.items[0].name
        : null;
    const categoryDescription = categoryData
        ? categoryData.categories.items[0].description
        : null;
    const availableSortMethods = sortData
        ? sortData.products.sort_fields.options
        : null;

    const debounce = (func, delay) => {
        let timeout;
        return function () {
            const fnCall = () => { func.apply(this, arguments) }
            clearTimeout(timeout);
            timeout = setTimeout(fnCall, delay)
        };
    }

    const handleScroll = () => {
        let scrollPercentage = (window.pageYOffset / galleryRef?.current?.clientHeight) * 100;
        if (scrollPercentage > 70 && isFinite(scrollPercentage) && myCurrentPage < totalPages) {
            setMyCurrentPage(myCurrentPage + 1);
        }
    };

    const handleView = type => {

        sectionRef.current.classList.toggle(classes.list);

        if (!urlParams.get('view')) {
            history.push(search + `venia-${categoryName.toLowerCase()}?view=list`);
        } else {
            urlParams.delete('view');
            history.push(urlParams);
        }

        if (type === 'list') {
            setView('list');
        } else {
            setView('grid');
        }
    }


    useEffect(() => {
        if (categoryId) {
            getFilters({
                variables: {
                    categoryIdFilter: {
                        eq: categoryId
                    }
                }
            });
        }
    }, [categoryId, getFilters]);

    useEffect(() => {
        if (categoryId) {
            getSortMethods({
                variables: {
                    categoryIdFilter: {
                        in: categoryId
                    }
                }
            });
        }
    }, [categoryId, getSortMethods]);

    useEffect(() => {
        window.addEventListener("scroll", debounce(handleScroll, 200), { passive: true });

        return () => {
            window.removeEventListener("scroll", debounce(handleScroll, 200), { passive: true });
        };
    });

    useEffect(() => {

        if (itemsForRender.length) {
            setItemsForRender([])
        }

    }, [categoryName])

    useEffect(() => {

        if (!isLoading) {
            setItemsForRender(prevState => [...prevState, ...items])
        }

        return () => { setItemsForRender(itemsForRender) }

    }, [items])

    useEffect(() => {

        setItemsForRender([])
        setMyCurrentPage(1)

    }, [view])

    return {
        availableSortMethods,
        categoryName,
        categoryDescription,
        filters,
        items,
        totalCount,
        totalPagesFromData,
        itemsForRender,
        handleView,
        view
    };
};
