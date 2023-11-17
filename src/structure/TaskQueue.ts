type Task = (...args: unknown[]) => Promise<void>;

export default class TaskQueue {
    private storage: Task[] = [];
    private isRunning = false;

    private execute() {
        const task = this.dequeue();
        if (task == null) {
            this.isRunning = false;
            return;
        }
        this.isRunning = true;
        void task().then(() => this.execute());
    }

    public enqueue(item: Task) {
        this.storage.push(item);
        if (!this.isRunning) {
            this.execute();
        }
    }

    public dequeue(): Task | undefined {
        return this.storage.shift();
    }
}
