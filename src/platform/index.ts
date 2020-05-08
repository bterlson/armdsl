export * from "./parameters";
export * from "./resources";
export * from "./string";
export * from "./arguments";
export * from "./boolean";
export * from "./controlFlow";

import { emit } from "../emit";

process.on("beforeExit", emit);
