import React, { useEffect, useRef, MutableRefObject } from "react";
import { TimerController } from "./timer-controller";
import { UnixTimestamp } from "./unix-timestamp";
import { Duration } from "./duration";
import { Stopwatch } from "./stopwatch";
import { Callbacks } from "./callbacks";
import { Display } from "./display";
import { ITimerBase } from "./interfaces/ITimerBase";
import {
    CreationType,
    UseTimerOptions,
    TimerState,
    TimerAction} from "./types/types"

export function shouldTimerContinue(timerController: TimerController, timerState: TimerState): boolean {
    if (timerController.timerBase.continueAfterFinish && timerController.creationType === CreationType.UnixTimestamp) {
        if (timerState.paused) return false;
        return true;
    }
    return timerState.paused || timerState.timerIsFinished ? false : true;
}

export function determineCreationType(options: UseTimerOptions): CreationType {
    if (options.create.timerWithDuration) return CreationType.Duration;
    if (options.create.timerWithUnixTimestamp?.unixTimestampMilliseconds) return CreationType.UnixTimestamp;
    return CreationType.Stopwatch;
}

export function createTimerBase(creationType: CreationType, options: UseTimerOptions): ITimerBase {
    if (creationType === CreationType.Duration) {
        return new Duration(options);
    }
    if (creationType === CreationType.UnixTimestamp) {
        return new UnixTimestamp(options);
    }
    return new Stopwatch(options);
}

export function createTimerController(options: UseTimerOptions): TimerController {
    const creationType: CreationType = determineCreationType(options);
    const timerBase: ITimerBase = createTimerBase(creationType, options);
    const display: Display = new Display(options);
    const callbacks: Callbacks = new Callbacks(options, timerBase.timeLeft);
    return new TimerController(
        options,
        timerBase,
        creationType,
        display,
        callbacks
    );
}

export function initializeTimerState(options: UseTimerOptions, timerController: TimerController): TimerState {
    return {
        paused: options.autoplay === false && timerController.creationType !== CreationType.UnixTimestamp ? true : false,
        timerIsFinished: timerController.timerIsFinished,
        timerText: timerController.getTimerText(),
        timerDisplayStrings: timerController.getTimerDisplayStrings(),
        timeElapsed: timerController.getTimeElapsed(),
        pastFinish: false
    }
}

export function timerTickState(timerController: TimerController, timerDispatch: React.Dispatch<TimerAction>) {
    timerDispatch({
        type: 'updateTimer',
        payload: timerController
    })
}

export function finishTimer(timerController: TimerController, timerDispatch: React.Dispatch<TimerAction>) {
    timerController.callbacks.onFinish?.();
    timerController.timerIsFinished = true;
    timerController.pastFinish = timerController.continueAfterFinish;
    timerDispatch({
        type: 'timerIsFinished',
        payload: timerController
    });
}

export function timerIsPastFinish(timerController: TimerController, timerState: TimerState, timerDispatch: React.Dispatch<TimerAction>) {
    if (timerController.creationType !== CreationType.UnixTimestamp) return;
    console.log(timerController.pastFinish && !timerState.pastFinish);
    if (timerController.pastFinish && !timerState.pastFinish) {
        timerDispatch({
            type: 'timerIsPastFinish'
        });
    }
    if (timerController.timerBase.continueAfterFinish && timerController.timerIsFinished && !timerController.pastFinish) {
        timerController.pastFinish = true;
    }
}

/** Lazily initialize timerController ref and return them on each subsequent render */
export function getTimerController(timerControllerRef: MutableRefObject<TimerController | null>, options: UseTimerOptions): TimerController {
    if (timerControllerRef.current === null) {
      timerControllerRef.current = createTimerController(options);
    }
    return timerControllerRef.current;
}

export function handleOptionsReset(oldOptions: UseTimerOptions, adjustedOptions?: Partial<UseTimerOptions>, replaceOptions?: boolean): UseTimerOptions {
    if (adjustedOptions) {
        if (replaceOptions) {
            if (!adjustedOptions.create) return { ...oldOptions, ...adjustedOptions };
            return { create: { }, ...adjustedOptions };
        }
        return { ...oldOptions, ...adjustedOptions };
    }
    return oldOptions;
}

export function useInterval(cb: () => void, delay: number | null) {
    const savedCB: React.MutableRefObject<() => void> = useRef<() => void>(function() {});
  
    useEffect(() => {
      savedCB.current = cb;
    }, [cb]);
  
    useEffect(() => {
        function tick() {
          savedCB.current();
        }
        if (delay !== null) {
          let id = setInterval(tick, delay);
          return () => clearInterval(id);
        }
    }, [delay]);
}