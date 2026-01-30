// Type definitions for React-Loading-Overlay 1.0
// Project: https://github.com/derrickpelletier/react-loading-overlay
// Definitions by: DefinitelyTyped <https://github.com/DefinitelyTyped>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
import { css, cx } from "@emotion/css";
import { CSSTransition } from "react-transition-group";

import React, { createRef } from "react";
import Spinner from "./loading-overlay-spinner";
import STYLES from "./loading-overlay-styles";

export type LoadingOverlayStyles = {
  content?: (base: React.CSSProperties) => React.CSSProperties;
  overlay?: (base: React.CSSProperties) => React.CSSProperties;
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

  children?: any;
}

export interface LoadingOverlayState {
  overflowCSS: any;
}

class LoadingOverlay extends React.Component<
  LoadingOverlayProps,
  LoadingOverlayState
> {
  wrapper: any = createRef();
  nodeRef: any = createRef();

  constructor(props: LoadingOverlayProps) {
    super(props);
    this.state = { overflowCSS: {} };
  }

  componentDidMount() {
    const wrapperStyle = window.getComputedStyle(this.wrapper.current);
    const overflowCSS = ["overflow", "overflowX", "overflowY"].reduce(
      (m: Record<string, string>, i: string) => {
        if (wrapperStyle[i as any] !== "visible") m[i] = "hidden";
        return m;
      },
      {}
    );
    this.setState({ overflowCSS });
  }

  componentDidUpdate(prevProps: LoadingOverlayProps) {
    const { active } = this.props;
    if (active) this.wrapper.current.scrollTop = 0;
  }

  /**
   * Return an emotion css object for a given element key
   * If a custom style was provided via props, run it with
   * the base css obj.
   */
  getStyles = (key: keyof LoadingOverlayStyles, providedState?: any) => {
    const base = STYLES[key](providedState, this.props);
    const custom = this.props.styles ? this.props.styles[key] : undefined;
    if (!custom) { return base };
    return typeof custom === "function" ? custom(base, this.props) : custom;
  };

  /**
   * Convenience cx wrapper to add prefix classes to each of the child
   * elements for styling purposes.
   */
  cx = (names: any, ...args: any[]) => {
    const arr = Array.isArray(names) ? names : [names];
    return cx(
      ...arr.map((name) =>
        name
          ? `${this.props.classNamePrefix ?? "_loading_overlay_"}${name}`
          : ""
      ),
      ...args
    );
  };

  render() {
    const {
      children,
      className,
      onClick,
      active,
      fadeSpeed = 500,
      spinner,
      text,
    } = this.props;

    return (
      <div
        data-testid="wrapper"
        ref={this.wrapper}
        className={this.cx(
          ["wrapper", active && "wrapper--active"],
          css(this.getStyles("wrapper", active ? this.state.overflowCSS : {})),
          className
        )}
      >
        <CSSTransition
          in={active}
          classNames="_loading-overlay-transition"
          timeout={fadeSpeed}
          unmountOnExit
          ref={this.nodeRef}
          addEndListener={() => { }}
        >
          {(state) => (
            <div
              data-testid="overlay"
              className={this.cx(
                "overlay",
                css(this.getStyles("overlay", state))
              )}
              onClick={onClick}
            >
              <div
                className={this.cx("content", css(this.getStyles("content")))}
                ref={this.nodeRef}
              >
                {spinner &&
                  (typeof spinner === "boolean" ? (
                    <Spinner cx={this.cx} getStyles={this.getStyles} />
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
  }
}

export default LoadingOverlay;
