import React from 'react';
import classes from './commentsPage.module.css';
import { Redirect } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const CommentsPage = () => {
    const [{ isSignedIn }] = useUserContext();


    if (!isSignedIn) {
        return (
            <Redirect to={'/'} />
        )
    }

    return (
        <div className={classes.root}>
            Comments Page
        </div>
    );
};

export default CommentsPage;
