import { DirectionOfTime, Timestamps, UseTimerOptions } from './types/types';
import { ITimerBase } from "./interfaces/ITimerBase";

interface IUnixTimestamp {
    unixTimeMilliseconds: number
}

/** Handles timers created with a Unix timestamp of milliseconds */
export class UnixTimestamp implements IUnixTimestamp, ITimerBase {
    unixTimeMilliseconds: number;
    timestamps: Timestamps;
    intervalRate: number;
    continueAfterFinish: boolean;
    directionOfTime: DirectionOfTime;
    private millisecondsLeft: number;
    public get timeElapsed(): number {
        return this.timestamps.start;
    }
    public get timeLeft(): number {
        return this.timestamps.end - this.timestamps.start;
    }
    
    constructor(options: UseTimerOptions) {
        this.intervalRate = options.intervalRate ?? 1000;
        this.continueAfterFinish = options.create.timerWithUnixTimestamp?.continueAfterFinish ?? false;
        this.directionOfTime = DirectionOfTime.Backward;
        this.unixTimeMilliseconds = options.create.timerWithUnixTimestamp?.unixTimestampMilliseconds ?? Date.now();
        this.millisecondsLeft = this.unixTimeMilliseconds - Date.now();
        this.timestamps = {
            start: 0,
            end: this.millisecondsLeft
        };
    }

    millisecondsToDisplay(): number {
        return this.timestamps.end - this.timestamps.start;
    }

    advanceTimestamps(): void {
        this.timestamps.start += this.intervalRate;
    }

    isFinished(): boolean {
        return this.timestamps.start >= this.timestamps.end;
    }

    IsPastFinish() {
        return this.timestamps.start >= this.timestamps.end && this.continueAfterFinish;
    }

    addTime(): void {return undefined}
    subtractTime(): void {return undefined}
}