import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Rich Functionality',
    image: 'icon/bulb.svg',
    description: (
      <>
        Sortable, Row Selection, Cell Editor, Row Expand, Column Filter Pagination etc.
      </>
    ),
  },
  {
    title: 'Customization',
    image: 'icon/tool.svg',
    description: (
      <>
        Configurable and customizable table to fit your needs.
      </>
    ),
  },
  {
    title: 'Remote',
    image: 'icon/store.svg',
    description: (
      <>
        Satisfy for Redux/Mobx or any other state management tool.
      </>
    ),
  },
];

function Feature({ image, title, description }) {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img
          src={`${siteConfig.baseUrl}img/${image}`}
          className={styles.featureSvg}
          alt={title}
          style={{ width: '48px', height: '48px' }}
        />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

