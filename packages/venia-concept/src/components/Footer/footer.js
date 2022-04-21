import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { useFooter } from '@magento/peregrine/lib/talons/Footer/useFooter';
import Logo from '@magento/venia-ui/lib/components/Logo';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './footer.module.css';
import { DEFAULT_LINKS, LOREM_IPSUM } from '@magento/venia-ui/lib/components/Footer/sampleData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBehance, faFacebookF, faGoogle, faSkype, faTwitter } from '@fortawesome/free-brands-svg-icons';


const Footer = props => {
    const { links } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useFooter();
    const { copyrightText } = talonProps;

    const linkGroups = Array.from(links, ([groupKey, linkProps]) => {
        const linkElements = Array.from(linkProps, ([text, path]) => {
            const itemKey = `text: ${text} path:${path}`;
            const child = path ? (
                <Link className={classes.link} to={path}>
                    <FormattedMessage id={text} defaultMessage={text} />
                </Link>
            ) : (
                <span className={classes.label}>
                    <FormattedMessage id={text} defaultMessage={text} />
                </span>
            );

            return (
                <li key={itemKey} className={classes.linkItem}>
                    {child}
                </li>
            );
        });

        return (
            <ul key={groupKey} className={classes.linkGroup}>
                {linkElements}
            </ul>
        );
    });

    return (
        <footer className={classes.root}>
            <div className={classes.links}>
                <div className={classes.link}>
                    <Link to="/foo">
                        <span className={classes.linkCustomStyle}>Foo Demo Page</span>
                    </Link>
                </div>
                {linkGroups}
                <div className={classes.callout}>
                    <h3 className={classes.calloutHeading}>
                        <FormattedMessage
                            id={'footer.followText'}
                            defaultMessage={'Follow Us!'}
                        />
                    </h3>
                    <p className={classes.calloutBody}>
                        <FormattedMessage
                            id={'footer.calloutText'}
                            defaultMessage={LOREM_IPSUM}
                        />
                    </p>
                    <ul className={classes.socialLinks}>

                        <li className={classes.behance}>
                            <FontAwesomeIcon height={16} icon={faBehance} width={19} />
                        </li>
                        <li className={classes.facebook}>
                            <FontAwesomeIcon height={16} icon={faFacebookF} width={10} />
                        </li>
                        <li className={classes.google}>
                            <FontAwesomeIcon height={16} icon={faGoogle} width={15} />
                        </li>
                        <li className={classes.skype}>
                            <FontAwesomeIcon height={16} icon={faSkype} width={15} />
                        </li>
                        <li className={classes.twitter}>
                            <FontAwesomeIcon height={16} icon={faTwitter} width={16} />
                        </li>


                    </ul>
                </div>
            </div>
            <div className={classes.branding}>
                <ul className={classes.legal}>
                    <li className={classes.terms}>
                        <FormattedMessage
                            id={'footer.termsText'}
                            defaultMessage={'Terms of Use'}
                        />
                    </li>
                    <li className={classes.privacy}>
                        <FormattedMessage
                            id={'footer.privacyText'}
                            defaultMessage={'Privacy Policy'}
                        />
                    </li>
                </ul>
                <p className={classes.copyright}>{copyrightText || null}</p>
                <Link className={classes.logo} to="/">
                    <Logo />
                </Link>
            </div>
        </footer>
    );
};

export default Footer;

Footer.defaultProps = {
    links: DEFAULT_LINKS
};

Footer.propTypes = {
    classes: shape({
        root: string
    })
};
