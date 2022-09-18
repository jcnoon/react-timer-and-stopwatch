import { TimeObject } from "./time-object";
import { CallbackType, CallbackController, CallbackOption, OnProgressController, OnTimeLeftController, UseTimerOptions } from "./types/types";

interface ICallbacks {
    onTick?: () => void;
    onFinish?: () => void;
    onProgress?: (currentTimerTime: number) => void;
    onProgressCallbacks?: OnProgressController[]
    onTimeLeftControllers?: OnTimeLeftController[]
}

export class Callbacks implements ICallbacks {
    onTick?: () => void;
    onFinish?: () => void;
    onProgressControllers: OnProgressController[];
    onTimeLeftControllers: OnTimeLeftController[];

    constructor(options: UseTimerOptions, timeLeft: number) {
        this.onTick = options.callbacks?.onTick ?? undefined;
        this.onFinish = options.callbacks?.onFinish ?? undefined;
        this.onProgressControllers = options.callbacks?.onProgress ? 
            this.CallbackOptionsToControllers(options.callbacks.onProgress, CallbackType.OnProgress) : [];
        this.onTimeLeftControllers = options.callbacks?.onTimeLeft ?
            this.CallbackOptionsToControllers(options.callbacks.onTimeLeft, CallbackType.OnTimeLeft, timeLeft) : [];
    }

    private CallbackOptionToController(callbackOption: CallbackOption): CallbackController {
        return {
                milliseconds: new TimeObject(callbackOption.time).toMilliseconds(),
                callback: callbackOption.callback,
                fired: false
        };
    }

    private CallbackOptionsToControllers(callbackOptions: CallbackOption[], callbackType: CallbackType, timeLeft?: number): CallbackController[] {
        // Make sure callback is function and that the milliseconds in timer is greater than 0,
        // otherwise filter them out of the array.
        const viableCallbackOptions = callbackOptions.filter((option) => {
            if (typeof option.callback === 'function') {
                const callbackMilliseconds = new TimeObject(option.time).toMilliseconds();
                if (callbackType === CallbackType.OnProgress && callbackMilliseconds > 0) return true;
                if (callbackType === CallbackType.OnTimeLeft && timeLeft !== undefined) {
                    return timeLeft > callbackMilliseconds;
                }
            }
            return false;
        });
        return viableCallbackOptions.map((option) => this.CallbackOptionToController(option));
    }
    
    /** Calls relevant onProgress callbacks and removes them from the array of onProgress callbacks */
    public onProgress(currentTimerTime: number): void {
        if (this.onProgressControllers.length > 0) {
            let callbackFired: boolean = false;
            this.onProgressControllers.forEach((onProgressController) => {
                if (currentTimerTime >= onProgressController.milliseconds) {
                    onProgressController.callback();
                    onProgressController.fired = true;
                    callbackFired = true;
                    return;
                }
            });
            // Remove the obsolete callbacks from the array.
            if (callbackFired) {
                this.onProgressControllers = this.onProgressControllers.filter(onProgressController => !onProgressController.fired);
            }
        }
    }

    /** Calls relevant onTimeLeft callbacks and removes them from the array of onTimeLeft callbacks */
    public onTimeLeft(timeLeft: number): void {
        if (this.onTimeLeftControllers.length > 0) {
            let callbackFired: boolean = false;
            this.onTimeLeftControllers.forEach((onTimeLeftController) => {
                if (timeLeft <= onTimeLeftController.milliseconds) {
                    onTimeLeftController.callback();
                    onTimeLeftController.fired = true;
                    callbackFired = true;
                    return;
                }
            });
            // Remove the obsolete callbacks from the array.
            if (callbackFired) {
                this.onTimeLeftControllers = this.onTimeLeftControllers.filter(onTimeLeftController => !onTimeLeftController.fired);
            }
        }
    }
}