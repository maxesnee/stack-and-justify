export const WorkerPool = (function() {
	const workerCount = 1;
	const workers = [];
	const queue = [];

	for (let i = 0; i < workerCount; i++) {
		const worker = new Worker('./js/SortDictionaryWorker.js');
		workers[i] = {
			worker,
			available: true
		};		
	}

	function handleNextMessage() {
		if (queue.length) {
			const message = queue.shift();
			postMessage(message.message, message.promise, message.trigger);
		}
	}

	function queueMessage(message, promise) {
		queue.push({message, promise});
	} 

	function postMessage(message, promise) {
		const worker = workers.find(worker => worker.available);
		
		if (!promise) promise = Deferred();

		if (!worker) {
			queueMessage(message, promise);
		} else {
			worker.worker.postMessage(message);
			worker.worker.onmessage = (e) => {
				worker.available = true;
				promise.resolve(e);
				handleNextMessage();
			}
			worker.available = false;
		}

		return promise;
	}

	return {
		postMessage
	}
})();

function Deferred() {
	var res, rej;

	var promise = new Promise((resolve, reject) => {
		res = resolve;
		rej = reject;
	});

	promise.resolve = res;
	promise.reject = rej;

	return promise;
}