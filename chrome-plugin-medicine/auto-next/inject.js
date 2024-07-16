/**
{
    "expired": false,
    "attendanceStatus": null,
    "attendanceStatusStr": null,
    "applyId": null,
    "applyStatus": 0,
    "applyStatusStr": "未报名",
    "workShiftStatus": 0,
    "workShiftStatusStr": "满员",
    "differNum": 9999,
    "emptyAndUnset": false,
    "check": false,
    "workShiftId": 211705
}
 */
chrome.runtime.sendMessage({ todo: 'showPageAction' });

console.log('autoNext!');

function startLearn() {
	/**
	 * 属性：
	 * paused 是否暂停
	 * ended 是否结束
	 *
	 * 事件：
	 * play 开始
	 * paused 暂停
	 * ended 结束
	 *
	 * 方法：
	 * play 开始
	 * pause 暂停
	 * load 重新加载
	 */
	const iframe = document.querySelector('.url-course-content');

	{
		// 方案 1：监测视频播放结束
		// const video = iframe.contentDocument.querySelector('video');
		// console.log('autoNext: ', video);
		// if (!video) {
		// 	alert('无法检测到视频');
		// 	return;
		// }

		// const handlePausedAndEnd = () => {
		// 	const isFinished = video.ended || video.paused; // 这网站比较特殊，会杀掉视频，这里 ended 很有可能判断不出来

		// 	console.log('autoNext: check status isFinished', isFinished);
		// 	if (isFinished) {
		// 		setTimeout(() => {
		// 			video.removeEventListener('ended', handlePausedAndEnd);
		// 			video.removeEventListener('pause', handlePausedAndEnd);

		// 			const nextBtn = iframe.contentDocument.querySelector('.next-button');
		// 			nextBtn && nextBtn.click();

		// 			setTimeout(() => {
		// 				startLearn(); // 会更新 video 标签，所以需要重新加载
		// 			}, 1000);
		// 		}, 2000);
		// 	} else {
		// 		// 意外暂停
		// 		video.play();
		// 	}
		// };
        // video.addEventListener('ended', handlePausedAndEnd);
        // video.addEventListener('pause', handlePausedAndEnd);
	}

    {
        // 方案 2：不断监测是否存在下一节按钮
        let timer;

		const video = iframe.contentDocument.querySelector('video');
		video && (video.muted = true);

        const checkNext = () => {
            const nextBtn = iframe.contentDocument.querySelector('.next-button');
            console.log('autoNext: check can next', nextBtn);
			const video = iframe.contentDocument.querySelector('video');
			video && (video.muted = true);

            if (nextBtn) {
                clearInterval(timer);
                
                // 这几确保能记录到学习记录
                setTimeout(() => {
                    nextBtn && nextBtn.click();
                    timer = setInterval(checkNext, 10000);
                }, 4000)
            }
        }

        timer = setInterval(checkNext, 10000);
    }
}

window.onload = () => {
	const startBtn = document.createElement('button');
	startBtn.classList.add('start-btn');
	startBtn.innerHTML = '开始';

	startBtn.onclick = () => {
		console.log('autoNext: Start');
		startBtn.innerHTML = '刷课中ing'
		startBtn.disabled = true
		startLearn();
	};

	document.querySelector('.cs-nav-menu').appendChild(startBtn);
};

// 监听点击开始选班
chrome.runtime.onMessage.addListener(function (request, sender, response) {
	//通过匹配接受到消息的todo是否为showPageAction，从而确定当前接受的消息是否是目标消息，
	//如果是，则使插件可以在当前页面使用
	if (request.todo == 'start') {
		console.log('autoNext: Start');
		startLearn();
	}
});
