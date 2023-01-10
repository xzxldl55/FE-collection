import './style.scss'

const $dragBar = document.querySelector('.drag-bar');
const $dragBlock = document.querySelector('.drag-block');
const $verifyBlock = document.querySelector('.verify-block');
const $restart = document.querySelector('.restart');

// 最大X轴偏移量
const maxTranslateX = $dragBar.clientWidth - getComputedStyle($dragBar)['paddingLeft'].replace('px', '') - getComputedStyle($dragBar)['paddingRight'].replace('px', '') - $dragBlock.clientWidth;

// 鼠标按下起始位置
let startX = 0;
const offsetLeft = 6; // 校验块左边偏移量
const epsilon = 8; // 可允许校验偏差
const target = 150; // 目标位置
let currentMoveX = 0; // 当前校验块偏移量

// 鼠标点击滑块后，监听移动与弹起事件
const mouseDownFn = (event) => {
    const { x } = event;
    startX = x;
    document.addEventListener('mousemove', mouseMoveFn);
    document.addEventListener('mouseup', mouseUpFn);
}

// 移动鼠标，计算偏移位置【需要限制在容器范围内】
const mouseMoveFn = (event) => {
    const move = event.x - startX;
    const translateX = currentMoveX = move < 0 ? 0 : (move > maxTranslateX ? maxTranslateX : move);
    $verifyBlock.style.transform = `translateX(${translateX}px)`;
    $dragBlock.style.transform = `translateX(${translateX}px)`;
}

// 鼠标抬起，检测偏移结果，确认校验成功 / 失败
const mouseUpFn = () => {
    document.removeEventListener('mousemove', mouseMoveFn);
    document.removeEventListener('mouseup', mouseUpFn);
    const moveResult = Math.abs(currentMoveX + offsetLeft - target);

    // 检测结果
    if (moveResult <= epsilon) { // 成功后移除鼠标事件，重新开始按钮可点击
        alert('校验成功');
        $dragBlock.removeEventListener('mousedown', mouseDownFn);
        $restart.removeAttribute('disabled');
    } else { // 失败情况，将组件复位
        $verifyBlock.style.transform = `translateX(${0}px)`;
        $dragBlock.style.transform = `translateX(${0}px)`;
        alert('校验失败');
    }
}
$dragBlock.addEventListener('mousedown', mouseDownFn);

// 点击重新开始，复位并重新监听鼠标事件
$restart.addEventListener('click', () => {
    $dragBlock.addEventListener('mousedown', mouseDownFn);
    $verifyBlock.style.transform = `translateX(${0}px)`;
    $dragBlock.style.transform = `translateX(${0}px)`;
    $restart.setAttribute('disabled', true);
})