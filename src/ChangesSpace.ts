import { ChangesStack } from "./ChangesStack";
import { deepCopy } from "./deepCopy";
import { deepEqual } from "./deepEqual";


export type ChangeRecord = {
  progress: <T>(val: T, meta: any) => T;
  meta: any;
};

type StackIdent = string;

export type ChangesValidator<T = any> = (progressed: T) => boolean;

function defaultValidator(progressed) {
  return true;
}

export class ChangesSpace {

  private stackMap = new Map<StackIdent, ChangesStack<ChangeRecord>>();

  private initialMap = new Map<StackIdent, any>();

  private validatorsMap = new Map<StackIdent, ChangesValidator>();

  getStack(ident: StackIdent): ChangesStack<ChangeRecord> {
    if (!this.stackMap.has(ident)) {
      this.stackMap.set(ident, new ChangesStack());
    }
    return this.stackMap.get(ident);
  }

  setValidator(ident: StackIdent, validator: ChangesValidator) {
    this.validatorsMap.set(ident, validator);
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

  get validated(): {[ident: StackIdent]: boolean} {
    return Object.keys(this.stackMap).reduce((acc, ident) => {
      const progressed = this.progressed[ident];
      const validator = this.validatorsMap.get(ident) || defaultValidator;
      const valid = validator(progressed);
      acc[ident] = valid;
      return acc;
    }, {});
  }

}
