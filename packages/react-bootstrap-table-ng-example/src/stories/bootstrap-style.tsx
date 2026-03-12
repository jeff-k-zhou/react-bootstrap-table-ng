/* eslint no-return-assign: 0 */

import React, { Fragment, PureComponent } from "react";

interface WithBootstrapStyleProps {
  version: string;
  render: (loading: boolean) => React.ReactNode;
}

interface WithBootstrapStyleState {
  loading: boolean;
}

export const BOOTSTRAP_VERSION = {
  FIVE: "5.3.8",
  FOUR: "4.6.2",
  THREE: "3.4.1",
};

const WithBootstrapStyle = ({ version, render }: WithBootstrapStyleProps) => {
  const [loading, setLoading] = React.useState(true);
  const styleRef = React.useRef<HTMLLinkElement>(null);

  React.useEffect(() => {
    const handleLoadEvent = () => {
      setLoading(false);
    };

    const linkElement = styleRef.current;
    if (linkElement) {
      linkElement.addEventListener("load", handleLoadEvent);
    }

    return () => {
      if (linkElement) {
        linkElement.removeEventListener("load", handleLoadEvent);
      }
    };
  }, []);

  const href = `style/bootstrap.${version}.min.css`;

  return (
    <Fragment>
      <link
        href={href}
        rel="stylesheet"
        ref={styleRef}
      />
      {render(loading)}
    </Fragment>
  );
};

/**
 * Currently we adopt version 3 as default.
 */
export default (version: string = BOOTSTRAP_VERSION.THREE) => (Story: any) => (
  <WithBootstrapStyle
    version={version}
    render={(loading) => !loading && <Story />}
  />
);
