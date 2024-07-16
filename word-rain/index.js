const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Canvas用的物理像素，所以要乘以设备像素比
// 设备像素比 = 物理像素 / 逻辑像素（px）
let { width, height } = canvas;
canvas.width = width * devicePixelRatio;
canvas.height = height * devicePixelRatio;
({ width, height } = canvas);

const fontSize = 8 * devicePixelRatio;

// 列数
const columnCount = Math.floor(width / fontSize);

// 每列文字待绘制的行序号
const columnIndex = new Array(columnCount).fill(0);

setInterval(draw, 40);

function draw() {
	// 每次行渲染时增加一层透明层，使得上一行渲染文字减淡
    ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
    ctx.fillRect(0, 0, width, height);
	// 绘制一行每一列的文字
	for (let i = 0; i < columnCount; i++) {
		const index = columnIndex[i];
		const x = i * fontSize;
		const y = (index + 1) * fontSize; // 因为默认文字基线对齐（靠近底部）所以这里 + 1
		ctx.fillStyle = getRandomColor();
		ctx.font = `${fontSize}px "Roboto Mono"`;
		ctx.fillText(getRandomChar(), x, y);

		// 使用随机值让不同列文字回溯时机不同，营造错落的文字雨效果
        if (y > height && Math.random() > 0.9) {
			columnIndex[i] = 0;
		} else {
			columnIndex[i] = index + 1;
		}
	}
}

function getRandomChar() {
	return String.fromCharCode(Math.floor(Math.random() * 94) + 33);
}

function getRandomColor() {
	return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
}
