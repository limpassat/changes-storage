

export class Stack<T> {

  private elements: T[] = [];

  push(elem: T): void {
    this.elements.push(elem);
  }

  pop(): T {
    return this.elements.pop();
  }

  [Symbol.iterator]() {
    let index = 0;

    return {
      next() {
        const result = {
          value: this.elements[index],
          done: index >= this.elements.length
        };
        index++;
        return result;
      }
    };
  }

}