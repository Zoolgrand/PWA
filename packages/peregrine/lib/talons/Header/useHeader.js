import { useCallback, useEffect } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { gql, useQuery } from '@apollo/client';

const GET_STORE_CONFIG = gql`
query getStoreConfig {
            
    storeConfig {
        store_code
        header_logo_src
        id
        logo_alt
        logo_height
        logo_width
    }
} 
`;

export const useHeader = ({classes, headerRef}) => {
    const [{ hasBeenOffline, isOnline, isPageLoading }] = useAppContext();
    const {
        elementRef: searchRef,
        expanded: isSearchOpen,
        setExpanded: setIsSearchOpen,
        triggerRef: searchTriggerRef
    } = useDropdown();

    const { data} = useQuery(GET_STORE_CONFIG, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'

    });
    const storeConfigData = data?.storeConfig

  // IntersectionObserver  params
    const options = {
        threshold: 1,
    };

    const callback = (entries) => {

        if (headerRef.current) {
            headerRef.current.classList.toggle(
                classes.sticky,
                !entries[0].isIntersecting
            );
        }

    }

    const observer = new IntersectionObserver(callback, options)

    useEffect(() => {
        if (headerRef.current) {
            observer.observe(document.querySelector('.my-header'));
        }
    }, []);


    const handleSearchTriggerClick = useCallback(() => {
        // Toggle the Search input form.
        setIsSearchOpen(isOpen => !isOpen);
    }, [setIsSearchOpen]);

    return {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isPageLoading,
        isSearchOpen,
        searchRef,
        searchTriggerRef,
        storeConfigData  
    };
};
