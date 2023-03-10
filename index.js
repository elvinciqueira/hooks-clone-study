const MyReact = (function () {
  let hooks = [],
    currentHook = 0;

  function render(Component) {
    const Comp = Component();
    Comp.render();
    currentHook = 0;
    return Comp;
  }

  function useEffect(callback, depArray) {
    const hasNoDeps = !depArray;
    const deps = hooks[currentHook];
    const hasChangedDeps = deps
      ? !depArray.every((el, i) => Object.is(el, deps[i]))
      : true;
    if (hasNoDeps || hasChangedDeps) {
      callback();
      hooks[currentHook] = depArray;
    }
    currentHook++;
  }

  function useState(initialValue) {
    hooks[currentHook] = hooks[currentHook] || initialValue;
    const setStateHookIndex = currentHook;
    const setState = (newState) => (hooks[setStateHookIndex] = newState);
    return [hooks[currentHook++], setState];
  }

  function useRef(initialValue) {
    return useState({ current: initialValue || null })[0];
  }

  return { useState, useEffect, useRef, render };
})();

function Counter() {
  const [count, setCount] = MyReact.useState(0);
  const [text, setText] = MyReact.useState('foo');

  MyReact.useEffect(() => {
    console.log('effect', count, text);
  }, [count, text]);

  return {
    click: () => setCount(count + 1),
    type: (txt) => setText(txt),
    noop: () => setCount(count),
    render: () => console.log('render', { count, text }),
  };
}

let App;
App = MyReact.render(Counter);
// effect 0 foo
// render {count: 0, text: 'foo'}
App.click();
App = MyReact.render(Counter);
// effect 1 foo
// render {count: 1, text: 'foo'}
App.type('bar');
App = MyReact.render(Counter);
// effect 1 bar
// render {count: 1, text: 'bar'}
App.noop();
App = MyReact.render(Counter);
// // no effect run
// render {count: 1, text: 'bar'}
App.click();
App = MyReact.render(Counter);
// effect 2 bar
// render {count: 2, text: 'bar'}
