import { ChangesStack } from "../../src/ChangesStack";
import { ChangeRecord } from "../../src/ChangesSpace";


describe("ChangesStack", () => {

  it("push()", () => {
    const stack = new ChangesStack<ChangeRecord>();
    stack.push({progress: val => void 0, meta: {}});
    expect(stack["elements"].length).toEqual(1);
    stack.push({progress: val => void 0, meta: {}});
    stack.push({progress: val => void 0, meta: {}});
    expect(stack["elements"].length).toEqual(3);
    expect(stack["virtualIndex"]).toEqual(2);
  });

  it("clear()", () => {
    const stack = new ChangesStack<ChangeRecord>();
    stack.push({progress: val => void 0, meta: {}});
    stack.push({progress: val => void 0, meta: {}});
    stack.push({progress: val => void 0, meta: {}});
    stack.clear();
    expect(stack["elements"].length).toEqual(0);
    expect(stack["virtualIndex"]).toEqual(-1);
  });

  it("undo()", () => {
    const stack = new ChangesStack<ChangeRecord>();
    stack.push({progress: val => void 0, meta: {}});
    stack.push({progress: val => void 0, meta: {}});
    stack.undo();
    expect(stack["elements"].length).toEqual(2);
    expect(stack["virtualIndex"]).toEqual(0);
    stack.push({progress: val => void 0, meta: {}});
    expect(stack["elements"].length).toEqual(3);
    expect(stack["virtualIndex"]).toEqual(2);
  });

  it("redo()", () => {
    const stack = new ChangesStack<ChangeRecord>();
    stack.push({progress: val => void 0, meta: {}});
    stack.push({progress: val => void 0, meta: {}});
    stack.undo();
    expect(stack["elements"].length).toEqual(2);
    expect(stack["virtualIndex"]).toEqual(0);
    stack.redo();
    expect(stack["elements"].length).toEqual(2);
    expect(stack["virtualIndex"]).toEqual(1);
  });

  it("canUndo", () => {
    const stack = new ChangesStack<ChangeRecord>();
    stack.push({progress: val => void 0, meta: {}});
    expect(stack.canUndo).toEqual(true);
    stack.push({progress: val => void 0, meta: {}});
    stack.undo();
    expect(stack.canUndo).toEqual(true);
    stack.undo();
    expect(stack.canUndo).toEqual(false);
    stack.redo();
    expect(stack.canUndo).toEqual(true);
  });

  it("canRedo", () => {
    const stack = new ChangesStack<ChangeRecord>();
    stack.push({progress: val => void 0, meta: {}});
    expect(stack.canRedo).toEqual(false);
    stack.push({progress: val => void 0, meta: {}});
    stack.undo();
    expect(stack.canRedo).toEqual(true);
    stack.undo();
    expect(stack.canRedo).toEqual(true);
    stack.redo();
    expect(stack.canRedo).toEqual(true);
    stack.redo();
    expect(stack.canRedo).toEqual(false);
  });

  it("undoAll()", () => {
    const stack = new ChangesStack<ChangeRecord>();
    stack.push({progress: val => void 0, meta: {}});
    stack.push({progress: val => void 0, meta: {}});
    stack.undoAll();
    expect(stack.canRedo).toEqual(true);
    expect(stack.canUndo).toEqual(false);
    expect(stack["elements"].length).toEqual(2);
    expect(stack["virtualIndex"]).toEqual(-1);
  });

  it("redoAll()", () => {
    const stack = new ChangesStack<ChangeRecord>();
    stack.push({progress: val => void 0, meta: {}});
    stack.push({progress: val => void 0, meta: {}});
    stack.undo();
    expect(stack.canUndo).toEqual(true);
    expect(stack.canRedo).toEqual(true);
    stack.undo();
    expect(stack.canUndo).toEqual(false);
    expect(stack.canRedo).toEqual(true);
    stack.redoAll();
    expect(stack.canUndo).toEqual(true);
    expect(stack.canRedo).toEqual(false);
    expect(stack["elements"].length).toEqual(2);
    expect(stack["virtualIndex"]).toEqual(1);
  });

});
