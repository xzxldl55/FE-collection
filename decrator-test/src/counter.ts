function Log(target: object, fnName: string, decoration: object) {
	console.log(decoration.value);
	return decoration;
}

class ComputedCenter {
	ele: HTMLElement;
	counter: number;

	constructor(ele: HTMLElement) {
		this.ele = ele;
		this.counter = 0;
	}

	@Log
	addCounter(count: number) {
		this.counter = count;
		this.ele.innerHTML = `count is ${this.counter}`;
	}
}

export { ComputedCenter };
