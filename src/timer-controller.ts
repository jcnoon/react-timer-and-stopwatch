import { Callbacks } from "./callbacks";
import { Display } from "./display";
import { ITimerBase } from "./interfaces/ITimerBase";
import { ITimerController } from "./interfaces/ITimerController";
import { TimeObject } from "./time-object";
import { CreationType, Time, TimerDisplayNumbers, UseTimerOptions, TimerDisplayStrings } from "./types/types";

export class TimerController implements ITimerController {
    creationType: CreationType;
    timerBase: ITimerBase
    display: Display;
    callbacks: Callbacks;
    continueAfterFinish: boolean;
    intervalRate: number;
    timerIsFinished: boolean;
    pastFinish: boolean;
    
    constructor(
        options: UseTimerOptions,
        timerBase: ITimerBase,
        creationType: CreationType,
        display: Display,
        callbacks: Callbacks
        ) {
        if (!options.create.stopwatch && !options.create.timerWithDuration && !options.create.timerWithUnixTimestamp) {
            throw new Error('useTimer requires one of options.create.stopwatch, options.create.timerWithDuration, or options.create.timerWithUnixTimestamp. None provided.');
        }
        this.creationType = creationType;
        this.display = display;
        this.timerBase = timerBase;
        this.callbacks = callbacks;
        this.continueAfterFinish = timerBase.continueAfterFinish;
        this.intervalRate = options.intervalRate ?? 1000;
        this.timerIsFinished = this.timerBase.isFinished();
        this.pastFinish = this.timerBase.IsPastFinish();
    }

    isFinished(): boolean {
        return this.timerBase.isFinished();
    }

    isPastFinish(): boolean {
        const pastFinish = this.timerBase.IsPastFinish();
        this.pastFinish = pastFinish;
        return pastFinish;
    }

    addTime(time: Time): void {
        const milliseconds = new TimeObject(time).toMilliseconds();
        this.timerBase.addTime(milliseconds);
    }

    subtractTime(time: Time): void {
        const milliseconds = new TimeObject(time).toMilliseconds();
        this.timerBase.subtractTime(milliseconds);
    }

    advanceTimestamps(): void {
        this.timerBase.advanceTimestamps();
    }

    getTimerText(milliseconds?: number): string {
        if (milliseconds === undefined) return this.display.createTimerText(this.timerBase.millisecondsToDisplay(), this.pastFinish);
        return this.display.createTimerText(milliseconds, this.pastFinish);
    }

    getTimeElapsed(): number {
        return this.timerBase.timeElapsed;
    }

    getTimerDisplayNumbers(milliseconds?: number): TimerDisplayNumbers {
        if (milliseconds === undefined) return this.display.createDisplayNumbers(this.timerBase.millisecondsToDisplay());
        return this.display.createDisplayNumbers(milliseconds);
    }

    getTimerDisplayStrings(milliseconds?: number): TimerDisplayStrings {
        if (milliseconds === undefined) return this.display.createDisplayStrings(this.timerBase.millisecondsToDisplay());
        return this.display.createDisplayStrings(milliseconds);
    }

    fireCallbacks(): void {
        this.callbacks.onTick?.();
        this.callbacks.onProgress(this.timerBase.timeElapsed);
        if (this.creationType !== CreationType.Stopwatch) this.callbacks.onTimeLeft(this.timerBase.timeLeft);
    }
}