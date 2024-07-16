import './index.scss';

const getV = () => 5 * (Math.random() - 0.5);
const getP = () => 5 * (Math.random() - 0.5);

// Flake Class
class Flake {
	_node = document.createElement('div');
	_vec = {
		x: getV(),
		y: getV(),
	};
	_pos = {
		x: this._vec.x * 40,
		y: this._vec.y * 40 - 10,
	};
	_scale = 2 + Math.random();

	constructor() {
		this._node.className = 'flake';
		this._scale = Math.max(0, this._scale - 0.03 * 60);

        if (this._pos.x * this._pos.x + this._pos.y * this._pos.y < 8000) {
            this._render();
        }
	}

    _render() {
        const transformCss = `translate3d(${this._pos.x}px, ${this._pos.y}px, 0) scale(${this._scale})`;

        this._node.style['transform'] = transformCss;
    }

    getNode() {
        return this._node
    }

    update() {
        // 消失后，进行复位，again
        if (!this._pos) {
            this._pos = { x:0, y: 0 }
            this._vec = { x: getV(), y: getV() }
            this._scale = 2 + Math.random()
        }

        // 进行运动
        this._vec.y += 0.05 // Y轴运动加速（模拟重力）
        this._pos.x += this._vec.x
        this._pos.y += this._vec.y
        this._scale = Math.max(0, this._scale - 0.035)

        // 渲染到 DOM
        this._render()

        // 超出限定范围消失
        if (this._pos.x * this._pos.x + this._pos.y * this._pos.y > 100000) {
            this._pos = null
        }
    }
}

const MAX_FLAKES = 300;
const $orb = document.querySelector('.orb');
const flakes = new Array(MAX_FLAKES)
let flake, i = 0;

// 创建花火对象，push 到 DOM 里
for (; i < MAX_FLAKES; i++) {
    flake = new Flake();
    const node = flake.getNode();
    $orb.appendChild(node);
    flakes[i] = flake;
}

const tick = () => {
    // 更新花火的运动状态
    for(i = 0; i < MAX_FLAKES; i++) {
        flake = flakes[i]
        flake.update();
    }

    // 循环动画
    requestAnimationFrame(() => tick())
}

tick();