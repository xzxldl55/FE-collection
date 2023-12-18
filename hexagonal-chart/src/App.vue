<script setup>
import { ref, onMounted } from 'vue';
import { sin, cos } from './utils/tri-func';

const canvasRef = ref();
const canvasWidth = 400;
const canvasHeight = 400;
const maxEdge = 180;
const maxScore = 150;

function computedPoint(width, height, edge) {
  // 以左上角为坐标原点的中心点坐标
  let centerX = width / 2
  let centerY = height / 2

  // 左上角顶点能够与 edge 形成一个最小角为 30° 以 edge 为斜边的直角三角形
  // 这里计算其余两边长
  let x = edge * cos(30);
  let y = edge * sin(30);

  // 设六边形六个定点为 x1,y1; x2,y2 ...
  let x1, x2, x3, x4, x5, x6;
  let y1, y2, y3, y4, y5, y6;

  // 计算左上角顶点坐标
  let left = centerX - x;
  let top = centerY - (2 * y);

  x5 = x6 = left; // 最左侧两个顶点
  x2 = x3 = left + 2 * x; // 最右侧两个顶点
  x1 = x4 = left + x; // 上下两个居中顶点

  y1 = top;
  y2 = y6 = top + y;
  y3 = y5 = top + 3 * y;
  y4 = top + 4 * y;

  let points = [];
  points[0] = [x1, y1];
  points[1] = [x2, y2];
  points[2] = [x3, y3];
  points[3] = [x4, y4];
  points[4] = [x5, y5];
  points[5] = [x6, y6];

  return points;
}

function draw() {
  const context = canvasRef.value.getContext('2d');
  const allPoints = [];
  const score = [
    {
      score: 90,
      name: '语文'
    },
    {
      score: 138,
      name: '数学'
    },
    {
      score: 126,
      name: '英语'
    },
    {
      score: 75,
      name: '政治'
    },
    {
      score: 88,
      name: '历史'
    },
    {
      score: 89,
      name: '地理'
    },
  ]

  for (let i = 0; i < 6; i++) {
    // 按照最大六边形边长 5 倍数缩放
    allPoints[i] = computedPoint(canvasWidth, canvasHeight, maxEdge - i * maxEdge / 5);
  }

  drawHexagonInner();
  drawScore(score);

  // 绘制背景底图
  function drawHexagonInner() {
    context.strokeStyle = '#30987d';

    // 绘制六个递减缩小的六边形
    for (let i = 0; i < 6; i++) {
      const points = allPoints[i];
      context.beginPath();

      // 移动到点 (x6, y6)
      context.moveTo(points[5][0], points[5][1]);
      // 从左上角 x6 出发，画线
      for (let j = 0; j < 6; j++) {
        context.lineTo(points[j][0], points[j][1]);
      }
      context.closePath();
      context.stroke();
    }

    // 绘制三条轴线
    context.beginPath();
    const outerPoints = allPoints[0];
    for (let i = 0; i < 3; i++) {
      console.log(outerPoints[i])
      context.moveTo(outerPoints[i][0], outerPoints[i][1]);
      context.lineTo(outerPoints[i + 3][0], outerPoints[i + 3][1]);
      context.stroke();
    }
    context.closePath();
  }

  // 绘制能力覆盖图
  function drawScore(data) {
    const outerPoints = allPoints[0];
    const powerPoints = [];

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // 根据最外顶点坐标乘以分数的比例来计算出 能力点 的坐标
    context.beginPath();
    context.fillStyle = 'rgba(165, 237, 250, 0.4)'
    for (let i = 0; i < 6; i++) {
      const ratio = data[i].score / maxScore;
      powerPoints.push([
        centerX + (outerPoints[i][0] - centerX) * ratio,
        centerY + (outerPoints[i][1] - centerY) * ratio
      ])

      if (i === 0) {
        context.moveTo(powerPoints[i][0], powerPoints[i][1]);
      } else if (i === 5) {
        context.lineTo(powerPoints[i][0], powerPoints[i][1]);
        context.lineTo(powerPoints[0][0], powerPoints[0][1]);
      } else {
        context.lineTo(powerPoints[i][0], powerPoints[i][1]);
      }
    }
    context.stroke();
    context.fill();
    context.closePath();

    // 描点
    context.fillStyle = 'rgba(165, 237, 250, 1)'
    for (let i = 0; i < 6; i++) {
      context.beginPath();
      context.arc(powerPoints[i][0], powerPoints[i][1], 5, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
    }
  }
}

onMounted(() => {
  if (canvasRef.value) {
    draw();
  }
});
</script>

<template>
  <div class="box">
    <canvas ref="canvasRef" id="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
