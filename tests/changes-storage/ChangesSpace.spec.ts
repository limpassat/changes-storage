import { ChangesSpace } from "../../src/ChangesSpace";


const initial1 = {
  field: 1
};

describe("ChangesSpace", () => {

  it("getStack()", () => {
    const changesSpace = new ChangesSpace();
    const stack = changesSpace.getStack("test-stack");
    expect(stack).not.toBe(undefined);
  });

  it("updateInitial()", () => {
    const changesSpace = new ChangesSpace();
    changesSpace.getStack("test-stack").clear();
    changesSpace.getStack("test-stack").push({meta: {}, progress: () => void 0});
    expect(changesSpace.getStack("test-stack")["elements"].length).toEqual(1);
    changesSpace.updateInitial("test-stack", initial1);
    expect(changesSpace["initialMap"].get("test-stack")).toEqual(initial1);
    expect(changesSpace.getStack("test-stack")["elements"].length).toEqual(1);
    changesSpace.getStack("test-stack").push({meta: {}, progress: () => void 0});
    changesSpace.updateInitial("test-stack", initial1);
    expect(changesSpace["initialMap"].get("test-stack")).toEqual(initial1);
    expect(changesSpace.getStack("test-stack")["elements"].length).toEqual(2);
  });

  it("haveChanges", () => {
    const changesSpace = new ChangesSpace();
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
    const changesSpace = new ChangesSpace();

    changesSpace.updateInitial("test-stack", {field: 1});

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
    const changesSpace = new ChangesSpace();

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

  it("save()", async () => {
    const changesSpace = new ChangesSpace();

    changesSpace.getStack("test-stack").clear();
    changesSpace.updateInitial("test-stack", {field: 1});

    changesSpace.getStack("test-stack")
    .push({
      meta: {value: 2},
      progress: (progressed: any, meta) => {
        progressed.field = meta.value;
        return progressed;
      }
    });

    changesSpace.getStack("test-stack")
    .push({
      meta: {value: 3},
      progress: (progressed: any, meta) => {
        progressed.field = meta.value;
        return progressed;
      }
    });

    expect(changesSpace.getStack("test-stack")["elements"].length === 2);

    changesSpace.setSaveFunction("test-stack", (progressed, initial) => Promise.resolve(progressed));

    await changesSpace.save("test-stack", false);

    expect(changesSpace.getProgressed("test-stack")).toEqual({field: 3});
    expect(changesSpace.getInitial("test-stack")).toEqual({field: 1});

    changesSpace.getStack("test-stack")
    .push({
      meta: {value: 4},
      progress: (progressed: any, meta) => {
        progressed.field = meta.value;
        return progressed;
      }
    });

    await changesSpace.save("test-stack", true);

    expect(changesSpace.getProgressed("test-stack")).toEqual({field: 4});
    expect(changesSpace.getInitial("test-stack")).toEqual({field: 4});
  });

});
