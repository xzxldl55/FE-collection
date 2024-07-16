import '../style.css'

const COLOR = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

// 获取一个随即色
function getColor() {
  function getRandomNum() {
    return Math.floor(Math.random() * 16);
  }

  return new Array(6).fill('').reduce(pre => pre + COLOR[getRandomNum()], '#');
}

let beforeTop = 0;
let valve = false;

window.onmousewheel = function (e) {
  if (valve) {
    return;
  }
  valve = true;
  const { deltaY } = e;
  const count = document.querySelectorAll('.scroll-view').length;

  if (deltaY > 0 && beforeTop < window.innerHeight * (count - 1)) {
    beforeTop += window.innerHeight;
    console.log('down')
  } else if (deltaY < 0 && beforeTop !== 0) {
    beforeTop -= window.innerHeight;
    console.log('up')
  }

  // 平滑滚动
  app.scrollTo({
    top: beforeTop,
    behavior: 'smooth'
  })

  setTimeout(() => valve = false, 300)
}