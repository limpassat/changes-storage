

export class ChangesStack<T> {

  private virtualIndex = 0;

  private elements: T[] = [];

  push(elem: T): void {
    this.elements.push(elem);
    this.virtualIndex = this.elements.length - 1;
  }

  undo(): void {
    this.virtualIndex = this.boundInLength(this.virtualIndex - 1);
  }

  redo(): void {
    this.virtualIndex = this.boundInLength(this.virtualIndex + 1);
  }

  undoAll(): void {
    this.virtualIndex = 0;
  }

  redoAll(): void {
    this.virtualIndex = this.elements.length - 1;
  }

  get canUndo(): boolean {
    return this.virtualIndex > 0;
  }

  get canRedo(): boolean {
    return this.virtualIndex < this.elements.length - 1;
  }

  clear() {
    this.elements = [];
    this.virtualIndex = 0;
  }

  private boundInLength(index: number): number {
    return Math.max(0, Math.min(index, this.elements.length - 1));
  }

  [Symbol.iterator]() {

    let index = 0;

    return {
      next() {
        const result = {
          value: this.elements[index],
          done: index >= this.virtualIndex
        };
        index++;
        return result;
      }
    };
  }

}
