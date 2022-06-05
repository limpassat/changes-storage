import { ChangesSpace } from "../../src/ChangesSpace";


const changesSpace = new ChangesSpace();

const initial1 = {
  field: 1
};

describe("ChangesSpace", () => {

  it("getStack()", () => {
    const stack = changesSpace.getStack("test-stack");
    expect(stack).not.toBe(undefined);
  });

  it("updateInitial()", () => {
    changesSpace.getStack("test-stack").push({meta: {}, progress: () => void 0});
    expect(changesSpace.getStack("test-stack")["elements"].length).toEqual(1);
    changesSpace.updateInitial("test-stack", initial1);
    expect(changesSpace["initialMap"].get("test-stack")).toEqual(initial1);
    expect(changesSpace.getStack("test-stack")["elements"].length).toEqual(0);
    changesSpace.getStack("test-stack").push({meta: {}, progress: () => void 0});
    changesSpace.updateInitial("test-stack", initial1, false);
    expect(changesSpace["initialMap"].get("test-stack")).toEqual(initial1);
    expect(changesSpace.getStack("test-stack")["elements"].length).toEqual(1);
  });

  it("haveChanges", () => {
    changesSpace.updateInitial("test-stack", initial1);

    changesSpace.getStack("test-stack")
    .push({
      meta: {value: 2},
      progress: (progressed: any, meta) => {
        progressed.field = meta.value;
        return progressed;
      }
    });

    expect(changesSpace.haveChanges).toEqual(true);

    changesSpace.getStack("test-stack")
    .push({
      meta: {value: 1},
      progress: (progressed: any, meta) => {
        progressed.field = meta.value;
        return progressed;
      }
    });

    expect(changesSpace.haveChanges).toEqual(false);

  });

  it("validate stack", () => {
    changesSpace.updateInitial("test-stack", initial1);

    changesSpace.getStack("test-stack")
    .push({
      meta: {value: 2},
      progress: (progressed: any, meta) => {
        progressed.field = meta.value;
        return progressed;
      }
    });

    expect(changesSpace.validated["test-stack"]).toEqual(true);

    changesSpace.setValidator("test-stack", (progressed) => {
      return progressed.field === 1;
    });

    expect(changesSpace.validated["test-stack"]).toEqual(false);

    changesSpace.getStack("test-stack").undo();

    expect(changesSpace.validated["test-stack"]).toEqual(true);

    changesSpace.getStack("test-stack").redo();

    expect(changesSpace.validated["test-stack"]).toEqual(false);
  });

  it("haveChanges with validator", () => {
    changesSpace.updateInitial("test-stack", initial1);

    changesSpace.deleteValidator("test-stack");

    changesSpace.getStack("test-stack")
    .push({
      meta: {value: 2},
      progress: (progressed: any, meta) => {
        progressed.field = meta.value;
        return progressed;
      }
    });

    expect(changesSpace.validated["test-stack"]).toEqual(true);

    changesSpace.setValidator("test-stack", (progressed) => {
      return progressed.field === 1;
    });

    expect(changesSpace.validated["test-stack"]).toEqual(false);

    expect(changesSpace.stackHaveChanges("test-stack")).toEqual(false);
  });

});
