import React, { useLayoutEffect, useRef } from "react";
import LoadingOverlay from "./src/loading-overlay";

interface TableLoadingOverlayWrapperProps {
  children: React.ReactNode;
  active?: boolean;
}

export default (options?: any) => (loading?: boolean) => {
  const TableLoadingOverlayWrapper: React.FC<TableLoadingOverlayWrapperProps> = ({
    children,
    active,
  }) => {
    const overlayRef = useRef<any>(null);
    const isActive = typeof active !== "undefined" ? active : loading;

    useLayoutEffect(() => {
      if (isActive && overlayRef.current && overlayRef.current.wrapper.current) {
        const wrapper = overlayRef.current.wrapper.current;
        const masker = wrapper.firstChild;
        const parent = wrapper.parentElement;

        if (parent) {
          const headerDOM = parent.querySelector("thead");
          const bodyDOM = parent.querySelector("tbody");
          const captionDOM = parent.querySelector("caption");

          if (headerDOM && bodyDOM) {
            let marginTop = window.getComputedStyle(headerDOM).height;
            if (captionDOM) {
              const captionHeight = parseFloat(
                window.getComputedStyle(captionDOM).height.replace("px", "")
              );
              const currentHeaderHeight = parseFloat(marginTop.replace("px", ""));
              marginTop = `${currentHeaderHeight + captionHeight}px`;
            }
            masker.style.marginTop = marginTop;
            masker.style.height = window.getComputedStyle(bodyDOM).height;
          }
        }
      }
    }, [isActive]);

    return (
      <LoadingOverlay ref={overlayRef} {...options} active={isActive}>
        {children}
      </LoadingOverlay>
    );
  };

  TableLoadingOverlayWrapper.displayName = "TableLoadingOverlayWrapper";

  return TableLoadingOverlayWrapper;
};
