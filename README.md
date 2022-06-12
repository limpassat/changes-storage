# changes-storage
Utility library for work with undo-redo and saving your changes on your API


### Install
```npm i changes-storage```

### Usage
```ts
import {ChangesStorage} from "changes-storage";

// Create general storage
const changesStorage = new ChangesStorage();

// Create your changes space
const changesSpace = changesStorage.getSpace("my-space");

// Set initial values of ...
// form, as example
changesSpace.getStack("my-form").updateInitial({
  field1: null,
  field2: null
});

// Push change for field1 in the form
changesSpace.getStack("my-form").push({
  progress: (progressed, meta) => {
    progressed.field1 = meta.field1;
    return progressed;
  },
  meta: {field1: "changed value 1"}
});

changesSpace.getProgressed("my-form"); // {field1: "changed value 1", field2: null}

// Now changesSpace have changes, because stack "my-form" have functions, which create a result that differs from the initial value
changesSpace.haveChanges // true
// And general storage have changes
changesStorage.haveChanges // true

// You can undo change
changesSpace.getStack("my-form").undo();
changesSpace.haveChanges // false
changesSpace.getProgressed("my-form"); // {field1: null, field2: null}

// And redo in changes stack
changesSpace.getStack("my-form").redo();
changesSpace.haveChanges // true
changesSpace.getProgressed("my-form"); // {field1: "changed value 1", field2: null}

```