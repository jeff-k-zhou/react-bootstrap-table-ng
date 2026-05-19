import { css, cx } from "@emotion/css";
import { CSSTransition } from "react-transition-group";
import React, { useState, useLayoutEffect, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Spinner from "./loading-overlay-spinner";
import STYLES from "./loading-overlay-styles";

export type LoadingOverlayStyles = {
  content?: (base: React.CSSProperties) => React.CSSProperties;
  overlay?: (base: React.CSSProperties, state?: any) => React.CSSProperties;
  spinner?: (base: React.CSSProperties) => React.CSSProperties;
  wrapper?: (base: React.CSSProperties, props?: any) => React.CSSProperties;
};

export interface LoadingOverlayProps {
  /** default: ``true`` - whether the loader is visible. */
  active?: boolean;

  /** default: ``500`` - the transition speed for fading out the overlay. */
  fadeSpeed?: number;

  /** default: ``undefined`` - click handler for the overlay when active. */
  onClick?: React.MouseEventHandler<HTMLDivElement>;

  /**
   * default: ``undefined`` - the className for the wrapping ``<div />`` that
   *  is present whether active or not.
   */
  className?: string;

  /**
   * default: ``_loading_overlay_`` - the prefix for all classNames on the
   * generated elements. see Styling for more info.
   */
  classNamePrefix?: string;

  /**
   * default: ``false`` - renders the default spinner when true (and when the
   * loader is active). Otherwise you can provide any valid react node to use
   * your own spinner.
   */
  spinner?: boolean | React.ReactNode;

  /**
   * default: ``undefined`` - the text or react node to render in the loader overlay when active.
   */
  text?: React.ReactNode;

  /**
   * default: ``undefined`` - see Styling for more info.
   */
  styles?: LoadingOverlayStyles;

  /**
   * default: ``undefined`` - accessible label for the overlay when it is clickable.
   */
  ariaLabel?: string;

  children?: any;
}

const LoadingOverlay = forwardRef<any, LoadingOverlayProps>((props, ref) => {
  const {
    children,
    className,
    onClick,
    active,
    fadeSpeed = 500,
    spinner,
    text,
    classNamePrefix = "_loading_overlay_",
    styles,
    ariaLabel
  } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    wrapper: wrapperRef
  }));


  useEffect(() => {
    if (active && wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
    }
  }, [active]);

  /**
   * Return an emotion css object for a given element key
   * If a custom style was provided via props, run it with
   * the base css obj.
   */
  const getStyles = (key: keyof LoadingOverlayStyles, providedState?: any) => {
    const base = STYLES[key](providedState, props);
    const custom = styles ? styles[key] : undefined;
    if (!custom) return base;
    return typeof custom === "function" ? (custom as any)(base, props) : custom;
  };

  /**
   * Convenience cx wrapper to add prefix classes to each of the child
   * elements for styling purposes.
   */
  const getCx = (names: string | (string | boolean | undefined)[], ...args: any[]) => {
    const arr = Array.isArray(names) ? names : [names];
    return cx(
      ...arr.map((name) =>
        name
          ? `${classNamePrefix}${name}`
          : ""
      ),
      ...args
    );
  };

  return (
    <div
      data-testid="wrapper"
      ref={wrapperRef}
      aria-busy={active}  /* WCAG 4.1.3 — communicates loading state to AT */
      className={getCx(
        ["wrapper", active && "wrapper--active"],
        css(getStyles("wrapper")),
        className
      )}
    >
      {/* Visually-hidden live region — WCAG 4.1.3 Status Messages */}
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {active ? (typeof text === "string" ? text : "Loading") : ""}
      </span>
      <CSSTransition
        in={active}
        classNames="_loading-overlay-transition"
        timeout={fadeSpeed}
        unmountOnExit
        nodeRef={nodeRef}
        addEndListener={() => { }}
      >
        {(state) => (
          <div
            data-testid="overlay"
            /* WCAG 2.1.1 / 4.1.2 — only expose interactive role when onClick is provided */
            {...(onClick
              ? {
                role: "button",
                tabIndex: 0,
                "aria-label": ariaLabel || (typeof text === "string" ? text : "Dismiss loading overlay")
              }
              : {})}
            className={getCx(
              "overlay",
              css(getStyles("overlay", state))
            )}
            onClick={onClick}
            onKeyDown={(e) => {
              if (onClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onClick(e as any);
              }
            }}
          >
            <div
              className={getCx("content", css(getStyles("content")))}
              ref={nodeRef}
            >
              {spinner &&
                (typeof spinner === "boolean" ? (
                  <Spinner cx={getCx as any} getStyles={getStyles} />
                ) : (
                  spinner
                ))}
              {text}
            </div>
          </div>
        )}
      </CSSTransition>
      {children}
    </div>
  );
});

LoadingOverlay.displayName = "LoadingOverlay";

export default LoadingOverlay;
