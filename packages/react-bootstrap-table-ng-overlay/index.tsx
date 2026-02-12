import React from "react";

import LoadingOverlay from "./src/loading-overlay";

interface TableLoadingOverlayWrapperProps {
  children: React.ReactNode;
}

export default (options?: any) => (loading?: boolean) =>
  class TableLoadingOverlayWrapper extends React.Component<TableLoadingOverlayWrapperProps> {

    overlay: any;

    componentDidMount() {
      if (loading) {
        const { wrapper } = this.overlay;
        const masker = wrapper.current.firstChild;
        const headerDOM = wrapper.current.parentElement.querySelector("thead");
        const bodyDOM = wrapper.current.parentElement.querySelector("tbody");
        const captionDOM =
          wrapper.current.parentElement.querySelector("caption");
        let marginTop = window.getComputedStyle(headerDOM).height;
        if (captionDOM) {
          marginTop = parseFloat(marginTop.replace("px", "")).toString();
          marginTop += parseFloat(
            window.getComputedStyle(captionDOM).height.replace("px", "")
          ).toString();
          marginTop = `${marginTop}px`;
        }
        masker.style.marginTop = marginTop;
        masker.style.height = window.getComputedStyle(bodyDOM).height;
      }
    }

    render() {
      return (
        <LoadingOverlay
          ref={(n: any) => { this.overlay = n; }}
          {...options}
          active={loading}
        >
          {this.props.children}
        </LoadingOverlay>
      );
    }
  };
