/**
 * logger.service.spec.ts - Logging service for server-side dashboard
 *
 * @authors Félix Boulet, Erica Bugden
 * @date 2017/03/17
 */

import * as Collections from 'typescript-collections';

export class LoggerService {
    private readonly LOG_QUEUE_MAX_SIZE = 100;
    private logList: Collections.LinkedList<string>;
    constructor() {
        this.logList = new Collections.LinkedList<string>();
    }

    public logEvent(type: string, description: string) {
        if (this.logList.size() >= this.LOG_QUEUE_MAX_SIZE) {
            this.logList.remove(this.logList.first());
        }
        let date = new Date();
        let day = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        this.logList.add(day + " -- " + time + " : " + type + " : " + description);
    }

    public getLog(): Array<String> {
        return this.logList.toArray();
    }

    public getMaxLogSize(): number {
        return this.LOG_QUEUE_MAX_SIZE;
    }
}
