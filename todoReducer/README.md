程序运行过程中遇到的问题: 

1. spread order issue: 
    
```
case 'ADD_TODO':
  return [
    ...state,
    {
      id: action.id,
      text: action.text,
      completed: false
    }
  ];
```      

当 ADD_ACTION 的 reducer 写成上面这样的时候, 在 Chrome 控制台会收到错误:

```
 Uncaught Error: Parse Error: Line 5: Spread must be the final element of an element list
    at http://localhost:63342/redux-learn/todo/todo.js:5:undefined

...state,
       ^
```

根据提示 spread 放在最后, 控制台就没有错误了.

```
case 'ADD_TODO':
  return [
    {
      id: action.id,
      text: action.text,
      completed: false
    },
    ...state
  ];
```    

另外出现这种情况的原因是引用的 jsx transformer:

```
<script src="https://fb.me/JSXTransformer-0.13.3.js"></script>
<script type="text/jsx" src='todo.js'></script>
```

还可以采用 `babel` 来解决这个问题, 替换上面的引用:

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
<script type="text/babel" src='todo.js'></script>
```


 
在写 `TOGGLE_TODO` 的时候, 
 
```
<script src="https://fb.me/JSXTransformer-0.13.3.js"></script>
<script type="text/jsx" src='todo.js'></script>
```

在使用 spread `...` 的时候会报以下错误:

``` 
 todo.js:21 Uncaught SyntaxError: Unexpected token ...
```

解决办法还是引用 `babel`

