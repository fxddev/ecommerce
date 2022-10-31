function MyWritableStore(value) {
  let subscribeFunctions = [];

  function set(newValue) {
    value = newValue;
    subscribeFunctions.forEach((func) => func(newValue));
  }

  function update(callback) {
    set(callback(value));
  }

  function subscribe(callback) {
    subscribeFunctions.push(callback);
    callback(value);

    return function () {
      subscribeFunctions = subscribeFunctions.filter(
        (func) => callback !== func
      );
    };
  }

  return { set, update, subscribe };
}

// const Drawer = MyWritableStore(0);
// const ProductData = MyWritableStore(0);

// export { Drawer, ProductData };

export const drawerStore = MyWritableStore(0);
export const productData = MyWritableStore(0);
export const cartSelected = MyWritableStore(0);

// https://svelte.dev/repl/f6f20772142f43568c3cff9c4b4d073b?version=3.29.0