import { TimeObject } from "./time-object";
import { DirectionOfTime, Time, UseTimerOptions } from "./types/types";
import { ITimerBase } from "./interfaces/ITimerBase";

/** Handles timers created with duration of time */
export class Duration implements ITimerBase {
    timestamps: { start: number; end: number; };
    intervalRate: number;
    continueAfterFinish: boolean;
    directionOfTime: DirectionOfTime;
    public get timeElapsed(): number {
        return this.timestamps.start;
    }
    public get timeLeft(): number {
        return this.timestamps.end - this.timestamps.start;
    }
    
    constructor(options: UseTimerOptions) {
        this.intervalRate = options.intervalRate ?? 1000
        this.continueAfterFinish = false;
        const milliseconds = new TimeObject(options.create.timerWithDuration?.time ?? 0).toMilliseconds();
        this.directionOfTime = options.create.timerWithDuration?.directionOfTimeForward ? DirectionOfTime.Forward : DirectionOfTime.Backward;
        this.timestamps = {
            start: 0,
            end: 0 + milliseconds
        };
    }

    millisecondsToDisplay(): number {
        if (this.directionOfTime === DirectionOfTime.Forward) return this.timestamps.start;
        return this.timestamps.end - this.timestamps.start;
    }

    advanceTimestamps(): void {
        this.timestamps.start += this.intervalRate;
    }

    isFinished(): boolean {
        return this.timestamps.start >= this.timestamps.end;
    }

    addTime(time: Time): void {
        const milliseconds = new TimeObject(time).toMilliseconds();
        this.timestamps.end += milliseconds;
    }

    subtractTime(time: Time): void {
        const milliseconds = new TimeObject(time).toMilliseconds();
        const totalMilliseconds = this.timestamps.start + milliseconds;
        this.timestamps.start = totalMilliseconds > this.timestamps.end ? this.timestamps.end : totalMilliseconds;
    };

    IsPastFinish = () => false;
}