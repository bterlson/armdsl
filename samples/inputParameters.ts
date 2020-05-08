import { defineInputParameter, concat } from "../src";

const $inputString = defineInputParameter({
  name: "Input String",
  type: "string",
});

const $name = concat($inputString, "hello");

const $inputString2 = defineInputParameter({
  name: "Composed Input String",
  type: "string",
  defaultValue: $name,
});

const $inputObject = defineInputParameter({
  name: "Input Object",
  type: "object",
  defaultValue: {
    x: 1,
    y: 2,
    name: $inputString2,
  },
});
