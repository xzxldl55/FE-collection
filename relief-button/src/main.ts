/**
 * 白天黑夜浮雕按钮
 * 
 * 通过background多个渐变色叠加，与box-shadow多个阴影叠加来实现太阳，月亮，云层，星星
 * 通过transition来实现动画切换效果
 */

import './style.css';

const reliefButton = document.createElement('button');
reliefButton.classList.add('relief-button');

document.querySelector<HTMLDivElement>('#app')!.append(reliefButton);

reliefButton.addEventListener('click', () => {
  reliefButton.classList.toggle('active');
});
