import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

class PipelineSingleton {
    static task = 'sentiment-analysis';
    static model = 'Xenova/twitter-roberta-base-sentiment-latest';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    if (event.data.type === 'load') {
        try {
            await PipelineSingleton.getInstance((x) => {
                // Post progress back to main thread
                self.postMessage({ type: 'progress', data: x });
            });
            self.postMessage({ type: 'ready' });
        } catch (e) {
            self.postMessage({ type: 'error', error: e.message });
        }
    } else if (event.data.type === 'predict') {
        const text = event.data.text;
        try {
            const classifier = await PipelineSingleton.getInstance();
            const output = await classifier(text);
            self.postMessage({ type: 'result', output });
        } catch (e) {
            self.postMessage({ type: 'error', error: e.message });
        }
    }
});
