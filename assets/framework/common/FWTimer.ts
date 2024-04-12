import { director, ISchedulable } from "cc";

export class FWTimer {
    static schedule(callback: (dt?: number) => void, target: ISchedulable, interval: number, repeat?: number, delay?: number, paused?: boolean) {
        director.getScheduler().schedule(callback, target, interval, repeat, delay, paused);
    }
    static scheduleOnce(callback: (dt?: number) => void, target: ISchedulable, interval: number, delay?: number, paused?: boolean) {
        director.getScheduler().schedule(callback, target, interval, 0, delay, paused);
    }
    static scheduleUpdate(target: ISchedulable, priority: number, paused: boolean) {
        director.getScheduler().scheduleUpdate(target, priority, paused);
    }
}

export const timer = FWTimer;