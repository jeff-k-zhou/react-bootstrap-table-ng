import React from "react";
import PaginationHandler from "./pagination-handler";
import PaginationJump from "./pagination-jump";
import paginationJumpAdapter from "./pagination-jump-adapter";
import standaloneAdapter from "./standalone-adapter";

// Base passthrough so the HOC chain has a concrete React component to wrap
const PaginationJumpStandaloneBase = (props: any) => (
  <PaginationJump {...props} />
);

export default standaloneAdapter(
  PaginationHandler(paginationJumpAdapter(PaginationJumpStandaloneBase))
);
