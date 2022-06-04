import { ChangesStack } from "./ChangesStack";
import { deepCopy } from "./deepCopy";
import { deepEqual } from "./deepEqual";


type ChangeRecord = {
  progress: <T>(val: T, meta: any) => T;
  meta: any;
};

type StackIdent = string;

export class ChangesSpace {

  private stackMap = new Map<StackIdent, ChangesStack<ChangeRecord>>();

  private initialMap = new Map<StackIdent, any>();

  getStack(ident: StackIdent): ChangesStack<ChangeRecord> {
    if (!this.stackMap.has(ident)) {
      this.stackMap.set(ident, new ChangesStack());
    }
    return this.stackMap.get(ident);
  }

  updateInitial(ident: StackIdent, initial: any) {
    this.initialMap.set(ident, initial);
  }

  get progressed(): {[ident: StackIdent]: any} {
    const stacksIdents = Array.from(this.stackMap.keys());
    const result = {};
    stacksIdents.forEach(ident => {
      const stack = this.getStack(ident);
      const initial = this.initialMap.get(ident);
      let progressed = initial;
      for (let record of stack) {
        progressed = record.progress(deepCopy(progressed), record.meta);
      }
      result[ident] = progressed;
    });
    return result;
  }

  get haveChanges(): boolean {
    const stacksIdents = Array.from(this.stackMap.keys());
    const initialEqualMapped = stacksIdents.map(ident => deepEqual(this.progressed[ident], this.initialMap.get(ident)));
    const someNotEqualInitial = initialEqualMapped.some(val => !val);
    return someNotEqualInitial;
  }

}
