import { valueOf, IdentifierNode } from "../src/types";
import { emitGraphNode } from "../src/emit";
import assert from "assert";

const identifier: IdentifierNode = {
  type: "identifier",
  name: "test",
};

describe("value", () => {
  it("has strings", () => {
    const $val = valueOf(identifier, "string");
    assert.equal(emitGraphNode($val), "[test]");
  });

  it("has numbers", () => {
    const $val = valueOf(identifier, "number");
    assert.equal(emitGraphNode($val), "[test]");
  });

  it("has booleans", () => {
    const $val = valueOf(identifier, "boolean");
    assert.equal(emitGraphNode($val), "[test]");
  });

  it("has any arrays", () => {
    const $val = valueOf(identifier, "array");
    assert.equal(emitGraphNode($val), "[test]");

    const $elem0 = $val[0];
    assert.equal(emitGraphNode($elem0), "[test[0]]");

    const $len = $val.length;
    assert.equal(emitGraphNode($len), "[test.length]");
  });

  it("has arrays of strings", () => {
    const $val = valueOf(identifier, ["string"]);
    assert.equal(emitGraphNode($val), "[test]");

    const $elem0 = $val[0];
    assert.equal(emitGraphNode($elem0), "[test[0]]");

    const $len = $val.length;
    assert.equal(emitGraphNode($len), "[test.length]");
  });

  it("has arrays of objects", () => {
    const $val = valueOf(identifier, [{ x: "number", y: "number" }]);
    assert.equal(emitGraphNode($val), "[test]");

    const $elem0 = $val[0];
    assert.equal(emitGraphNode($elem0), "[test[0]]");

    const $len = $val.length;
    assert.equal(emitGraphNode($len), "[test.length]");

    const $elem0x = $elem0.x;
    assert.equal(emitGraphNode($elem0x), "[test[0].x]");
  });

  it("has any objects", () => {
    const $val = valueOf(identifier, "object");
    assert.equal(emitGraphNode($val), "[test]");

    const $valx = $val.x;
    assert.equal(emitGraphNode($valx), "[test.x]");
  });

  it("has objects", () => {
    const $val = valueOf(identifier, { x: "number", y: "number" });
    assert.equal(emitGraphNode($val), "[test]");

    const $valx = $val.x;
    assert.equal(emitGraphNode($valx), "[test.x]");
  });
});
