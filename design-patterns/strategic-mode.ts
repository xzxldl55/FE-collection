/**
 * 策略模式模拟
 *
 * 计算器模拟
 */

// 1. 定义好策略（接口）
interface CalculatorStrategy {
	calculate(a: number, b: number): number;
}

// 2. 定义具体的策略 --> 即对接口进行实现
export class AddStrategy implements CalculatorStrategy {
	calculate(a: number, b: number): number {
		return a + b;
	}
}

export class SubtractStrategy implements CalculatorStrategy {
	calculate(a: number, b: number): number {
		return a - b;
	}
}

export class MultiplyStrategy implements CalculatorStrategy {
	calculate(a: number, b: number): number {
		return a * b;
	}
}

export class DivStrategy implements CalculatorStrategy {
	calculate(a: number, b: number): number {
		return a / b;
	}
}

// 3. 创建上下文用于调用不同策略
export class CalculatorContext {
	private strategy: CalculatorStrategy;

	constructor(strategy: CalculatorStrategy) {
		this.strategy = strategy;
	}

	setStrategy(strategy: CalculatorStrategy) {
		this.strategy = strategy;
	}

	calculate(a: number, b: number): number {
		return this.strategy.calculate(a, b);
	}
}

// 4. 使用策略模式进行计算
const addStrategy = new AddStrategy();
const subtractStrategy = new SubtractStrategy();
const multiplyStrategy = new MultiplyStrategy();
const divStrategy = new DivStrategy();

const calculator = new CalculatorContext(addStrategy);

console.log(calculator.calculate(3, 5));

calculator.setStrategy(subtractStrategy);

console.log(calculator.calculate(8, 3));

calculator.setStrategy(multiplyStrategy);

console.log(calculator.calculate(2, 9));

calculator.setStrategy(divStrategy);

console.log(calculator.calculate(7, 4));
