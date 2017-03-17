import * as Collections from 'typescript-collections';

export class LoggerService {
    private LOG_QUEUE_MAX_SIZE = 100;
    private logList: Collections.LinkedList<string>;
    constructor() {
        this.logList = new Collections.LinkedList<string>();
    }

    public logEvent(type: string, description: string) {
        if (this.logList.size() >= this.LOG_QUEUE_MAX_SIZE) {
            this.logList.remove(this.logList.first());
        }
        let date = new Date();
        let day = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
        let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        this.logList.add(day + " -- " + time + " : " + type + " : " + description);
    }

    public getLog(): Array<String> {
        return this.logList.toArray();
    }
}