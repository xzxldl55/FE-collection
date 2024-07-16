# React 学习练手项目

## 什么是应用状态管理？

我们先看应用状态（Application State）。理论上，一个应用在运行的时候内存里所有跟它有关的数据都可以称作是应用状态，但实际上，这远远超出了应用开发者需要关注的范围。

我们姑且可以类比一下后端服务：有状态服务（Stateful Service）和无状态服务（Stateless Service）常被一起提及：比如一个购物车 HTTP 服务，在服务器端临时保存了当前登录用户的 session 信息，用户先后两次请求都会读写这个 session，那这个 HTTP 服务就是有状态服务；另一个商品列表 HTTP 服务，并不关心用户是否登录，仅凭用户发过来的 HTTP 请求里包含的参数就可以完成工作，把结果作为 HTTP 响应返回给用户，那么它就是无状态服务。

这两个服务相减，得出“服务器端临时保存的登录用户的 session 信息”就是我们需要关注的应用状态。

React 这样由数据驱动的前端框架，更是依赖浏览器本地的应用状态。当开发本地状态越来越复杂，复杂到需要一层专门的抽象时，就出现了应用状态管理框架，来管理这些应用状态。

### Redux

```ts
import { createStore } from 'redux';

function cardListReducer(state = [], action) {
  switch (action.type) {
    case 'card/add':
      return [action.newCard, ...state];
    case 'card/remove':
      return state.filter(card => card.title !== action.title);
    default:
      return state;
  }
}

const store = createStore(cardListReducer);
store.subscribe(() => console.log(store.getState()));

store.dispatch({ type: 'card/add', newCard: { title: '开发任务-1' } });
// [{ title: '开发任务-1' }]
store.dispatch({ type: 'card/add', newCard: { title: '测试任务-2' } });
// [{ title: '测试任务-2' }, { title: '开发任务-1' }]
store.dispatch({ type: 'card/remove', title: '开发任务-1' });
// [{ title: '测试任务-2' }]
```

#### Redux 三个基本原则：这三个基本原则保证了 Redux 管理的应用状态是可预测的

1. 单一事实来源（Single Source Of Truth）。Redux 全局只有一个 store，里面包含了唯一的状态对象树；

2. 状态只读。这就是在强调状态的不可变性，只有通过派发 action 的方式才能触发 reducer，返回一个包含变更的新状态；

3. 状态变更不应有副作用。在 store 中使用的 reducer，都必须是不会产生副作用的纯函数（Pure Function）。

#### 三个基本概念

`action`: 定义动作，通过 action 来在 reducer 区分我们需要进行的数据操作

`reducer`: 定义 reducer 数据状态处理函数

`dispatch`: 调用以出发我们设定的 action 来变化数据

#### 什么时候使用 Redux？

一般情况下，当你的 React 项目足够小，引入 Redux 的成本要大于收益。只有你预期项目规模会逐渐增大，或者项目已经是大中型的体量了，这时可以考虑引入 Redux。Redux 鼓励全局只有单一 store，所以比较适合管理全局状态。

## React 自定义 Hooks

## React 组件组合

## React组件性能优化（useMemo + useCallback）

[官网例子](https://zh-hans.react.dev/reference/react/useCallback)

> 背景我们知道但组件 props 变化时，组件将会重新进行渲染，包括重新渲染其子组件。

### 情景 1：props 是基本数据类型

所以如果有这样的组件关系 `A -> B -> C`，当我们在 A 中修改了传入 B 的 props，则 B, C 两个组件都将重新渲染。

倘若，C 组件 props 接收的 props 与 A 传给 B 的 props 无关，那么 C 的渲染就是“徒增”的。

#### fix：

```tsx
import C from 'xxx'

const EnhanceC = React.memo(C); // 使用 React.memo 进行组件缓存优化，但组件 props 没有变化（Object.is 比较的）时，直接复用，不重新渲染

function B({fromA}) {
  const fromB: number | string = xxx;

  return (
    <>
      ...
      {/* 将不会受到 fromA 变化影响而重新渲染 */}
      <EnhanceC  fromB={fromB} />

      {/* 会因为 fromA 变化导致的 B 重新渲染而重新渲染 */}
      <C fromB={fromB} />
    </>
  )
}
```

### 情景 2：props 是引用数据类型

紧接着上面的情景，假如 `C` 的 `props` `fromB` 是一个函数（或者是个对象之类的引用类型），则由于 JS 函数声明语法，我们每次都是新增了一个新的函数，`Object.is` 必定是 `false` 的，这样我们的 Memo 就失效了。

#### fix：使用 useCallback 或 useMemo 缓存函数 或 对象

> useCallback(fn, [dependencies]) 用 Object.is 比较 dependencies 来返回缓存的函数 fn

> useMemo(() => res, [dependencies]) 用 Object.is 比较 dependencies 来返回缓存的函数执行结果 res

```tsx
import C from 'xxx'

const EnhanceC = React.memo(C); // 使用 React.memo 进行组件缓存优化，但组件 props 没有变化（Object.is 比较的）时，直接复用，不重新渲染

function B({fromA}) {

  // 使用 useCallback 缓存函数 fromB，这样组件 B 重新渲染时执行这行代码创建的 fromB 与之前缓存的引用一致 ==> 不会导致 C 组件重新渲染
  const fromB: () => void = useCallback(() => {
    // xxxxxx
  }, []);

  return (
    <>
      ...
      {/* 将不会受到 fromA 变化影响而重新渲染 */}
      <EnhanceC  fromB={fromB} />

      {/* 会因为 fromA 变化导致的 B 重新渲染而重新渲染 */}
      <C fromB={fromB} />
    </>
  )
}
```