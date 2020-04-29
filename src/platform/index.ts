export * from "./parameters";
export * from "./resources";
export * from "./string";
export * from "./arguments";

import { emit } from "../emit";

process.on("beforeExit", emit);
