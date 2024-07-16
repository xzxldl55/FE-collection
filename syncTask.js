// function timeout(func, ms) {
// 	return new Promise((resolve) => {
// 		setTimeout(() => {
// 			resolve(func());
// 		}, ms);
// 	});
// }

// class SyncTask {
// 	constructor(processCount = 2) {
// 		this.processCount = processCount;
// 		this.task = [];
// 		this.runningTask = 0;
// 	}

// 	add(task) {
// 		return new Promise((resolve, reject) => {
// 			this.task.push({
// 				task,
// 				resolve,
// 				reject,
// 			});
// 			this.runningTask < this.processCount && this._run();
// 		});
// 	}

// 	_run() {
// 		while (this.processCount > this.runningTask && this.task.length > 0) {
// 			const { task, resolve, reject } = this.task.shift();
// 			Promise.resolve(task)
// 				.then(resolve, reject)
// 				.finally(() => {
// 					this.runningTask--;
// 					this.task.length && this._run();
// 				});
// 		}
// 	}
// }

// const syncTask = new SyncTask();

// const start = console.time('go');

// syncTask
// 	.add(timeout(() => console.timeLog('go', 1), 10000))
// 	.then(() => syncTask.add(timeout(() => console.timeLog('go', 2), 5000)))
// 	.then(() => syncTask.add(timeout(() => console.timeLog('go', 3), 3000)))
// 	.then(() => syncTask.add(timeout(() => console.timeLog('go', 4), 1000)))
// 	.then(() => syncTask.add(timeout(() => console.timeLog('go', 5), 6000)))
// 	.then(() => syncTask.add(() => console.timeLog('go', 6)));
// // syncTask.add(timeout(() => console.timeLog('go', 2), 5000));
// // syncTask.add(timeout(() => console.timeLog('go', 3), 3000));
// // syncTask.add(timeout(() => console.timeLog('go', 4), 1000));
// // syncTask.add(timeout(() => console.timeLog('go', 5), 6000));
// // syncTask.add(() => console.timeLog('go', 6));

// // 2 3 4 1 6 5
