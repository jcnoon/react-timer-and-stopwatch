import { TimeObject } from "./time-object";
import { DirectionOfTime, Time, Timestamps, UseTimerOptions } from "./types/types";
import { ITimerBase } from "./interfaces/ITimerBase";

/** Handles stopwatch timers */
export class Stopwatch implements ITimerBase {
    timestamps: Timestamps;
    intervalRate: number;
    continueAfterFinish: boolean;
    directionOfTime: DirectionOfTime;
    timeLeft = 0;
    public get timeElapsed(): number {
        return this.timestamps.start;
    }

    constructor(options: UseTimerOptions) {
        this.intervalRate = options.intervalRate ?? 1000;
        this.continueAfterFinish = false;
        this.directionOfTime = DirectionOfTime.Forward;
        this.timestamps = {
            start: options.create.stopwatch?.startAtMilliseconds ?? 0,
            end: 0
        };
    }

    millisecondsToDisplay(): number {
        return this.timestamps.start;
    }

    advanceTimestamps(): void {
        this.timestamps.start += this.intervalRate;
    }

    addTime(time: Time): void {
        const milliseconds = new TimeObject(time).toMilliseconds();
        this.timestamps.start += milliseconds;
    }

    subtractTime(time: Time): void {
        const milliseconds = new TimeObject(time).toMilliseconds();
        this.timestamps.start -= milliseconds;
        if (this.timestamps.start < 0) this.timestamps.start = 0;
    }

    isFinished = () => false;
    IsPastFinish = () => false;
}