import './style.css';

const app = document.getElementById('app')!;

app.innerHTML = `
  <ul class="flex p-24 justify-center gap-4">
    <li class="card">
      <div class="light"></div>
    </li>
    <li class="card">
      <div class="light"></div>
    </li>
    <li class="card">
      <div class="light"></div>
    </li>
  </ul>
`;

function computedMove(clientX: number, clientY: number, card: HTMLElement, light: HTMLElement) {
	const { x, y } = card.getBoundingClientRect(); // 获取卡片位置大小
	const { width, height } = light.getBoundingClientRect();

	const left = clientX - x - width / 2;
	const top = clientY - y - height / 2;

	return { left, top };
}

const $cards = document.querySelectorAll<HTMLElement>('.card');

Array.from($cards).forEach(($card: HTMLElement) => {
	const $light = $card.querySelector('.light') as HTMLElement;
	if ($light) {
		$card.addEventListener('mouseenter', (e) => {
			$light.classList.add('on');
		});
		$card.addEventListener('mousemove', (e: MouseEvent) => {
			const { clientX, clientY } = e;
			const { left, top } = computedMove(clientX, clientY, $card, $light);

			$light.style.left = left + 'px';
			$light.style.top = top + 'px';
		});
		$card.addEventListener('mouseleave', (e) => {
			$light.classList.remove('on');
		});
	}
});
