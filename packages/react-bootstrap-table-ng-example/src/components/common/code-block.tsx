
import React, { useEffect } from "react";

interface DefaultComponentProps {
  children?: any;
}

const DefaultComponent: React.FC<DefaultComponentProps> = ({ children = "" }) => {
  useEffect(() => {
    // code-prettify https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js
    // run the PR.prettyPrint() function once your page has finished loading
    // defined in .storybook/main.ts file
    // @ts-ignore
    if (typeof PR !== "undefined") {
      // @ts-ignore
      PR.prettyPrint();
    }
  }, []);

  return (
    <div className="highlight-text-html-basic">
      <pre className="prettyprint lang-js">{children}</pre>
    </div>
  );
};

export default DefaultComponent;
