import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/about">
                        Getting Started
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`Home`}
            description="Maintenance fork of react-bootstrap-table2">
            <HomepageHeader />
            <main>
                <HomepageFeatures />

                <section className={styles.features}>
                    <div className="container">
                        <div className="row">
                            <div className={clsx('col col--12')}>
                                <div className="text--center padding-horiz--md">
                                    <Heading as="h2">Intuitive to use</Heading>
                                    <p>
                                        Compatible for Bootstrap 3 and 4. <br />
                                        Better than legacy react-bootstrap-table!!
                                    </p>
                                    <img
                                        src={`${siteConfig.baseUrl}img/react-bootstrap-table-ng-sample.png`}
                                        alt="react-bootstrap-table-ng sample"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
