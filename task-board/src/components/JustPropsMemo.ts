import JustProps from './JustProps';
import React from 'react';


/**
 * 使用纯组件 API 优化组件渲染
 * 
 * 纯组件只应该作为性能优化的手段，开发者不应该将任何业务逻辑建立在到纯组件的行为上。有两个 API 可以创建纯组件，这里只介绍适合函数组件使用的 React.memo，至于 React.PureComponent，它是类组件专用
 * 
 * 这个 API 第一个参数是一个组件，函数组件或类组件都可以。它会返回一个作为高阶组件的纯组件，这个纯组件接受的 props 与原组件相同。每次渲染时纯组件会把 props 记录下来，下次渲染时会用新的 props 与老的 props 做浅对比，如果判断相等则跳过这次原组件的渲染。
 * 
 * 但要注意，原组件内部不应该有 state 和 context 操作，否则就算 props 没变，原组件还是有可能因为 props 之外的原因重新渲染。
 * 
 * 当你不满足于浅对比时，你还可以给这个 API 传入第二个可选参数，一个 compare 函数，compare 函数被调用时会接受 oldProps 和 newProps 两个参数，如果返回 true，则视为相等，反之则视为不等。
 */
export default React.memo(JustProps);
