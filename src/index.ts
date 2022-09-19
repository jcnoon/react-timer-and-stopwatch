import { useRef, useReducer } from 'react';
import { TimerController } from './timer-controller';
import { timerReducer } from './reducers/timer-reducer';
import { UseTimerOptions, Timer, Time, CreationType } from './types/types';
import {
    createTimerController,
    finishTimer,
    getTimerController,
    handleOptionsReset,
    initializeTimerState,
    shouldTimerContinue,
    timerTickState,
    useInterval
} from './util';

/** @param options - `options` object must include a `create` object with one of `timerWithDuration`, `timerWithTimestamp`, or `stopwatch`, otherwise useTimer will throw an error. */
export function useTimer(options: UseTimerOptions): Timer {
    const timerControllerRef = useRef<TimerController | null>(null);
    const timerController = getTimerController(timerControllerRef, options);
    const [timerState, timerDispatch] = useReducer(
        timerReducer, 
        null, 
        () => initializeTimerState(options, timerController)
    );
    function togglePause(): void {
        if (timerController.creationType === CreationType.UnixTimestamp) return;
        if (timerState.timerIsFinished && !timerController.pastFinish) return;
        timerDispatch({ type: 'togglePause' });
    }
    function pauseTimer(): void {
        if (timerController.creationType === CreationType.UnixTimestamp) return;
        if ((timerState.paused || timerState.timerIsFinished) && !timerController.pastFinish) return;
        timerDispatch({ type: 'pause' });
    }
    function resumeTimer(): void {
        if (timerController.creationType === CreationType.UnixTimestamp) return;
        if ((!timerState.paused || timerState.timerIsFinished) && !timerController.pastFinish) return;
        timerDispatch({ type: 'resume' });
    }
    function resetTimer(adjustedOptions?: Partial<UseTimerOptions>, replaceOptions?: boolean): void {
        if (timerController.creationType === CreationType.UnixTimestamp) return;
        const newOptions = handleOptionsReset(options, adjustedOptions, replaceOptions);
        timerControllerRef.current = createTimerController(newOptions);
        timerDispatch({
            type: 'resetTimer',
            payload: initializeTimerState(newOptions, timerControllerRef.current)
        });
    }
    function addTime(time: Time): void {
        if (timerController.creationType === CreationType.UnixTimestamp) return;
        if (timerState.timerIsFinished) return;
        timerController.addTime(time);
        if (timerController.isFinished()) {
            finishTimer(timerController, timerDispatch);
            return;
        }
        timerTickState(timerController, timerDispatch);
    }
    function subtractTime(time: number | { days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number }): void {
        if (timerController.creationType === CreationType.UnixTimestamp) return;
        if (timerState.timerIsFinished) return;
        timerController.subtractTime(time);
        if (timerController.isFinished()) {
            finishTimer(timerController, timerDispatch);
            return;
        }
        timerTickState(timerController, timerDispatch);
    }
    useInterval(function() {
        if (!timerController.isFinished() || timerController.isPastFinish()) {
            timerController.advanceTimestamps();
            timerController.fireCallbacks();
        }
        if (!timerState.timerIsFinished) {
            if (timerController.isFinished()) {
                finishTimer(timerController, timerDispatch);
                return;
            }
        }
        timerTickState(timerController, timerDispatch);

    }, shouldTimerContinue(timerController, timerState) ? timerController.intervalRate : null);

    return {
        timerText: timerState.timerText,
        timerDisplayStrings: timerState.timerDisplayStrings,
        timeElapsed: timerState.timeElapsed,
        timerIsPaused: timerState.paused,
        timerIsFinished: timerState.timerIsFinished,
        pastFinish: timerState.pastFinish,
        pauseTimer,
        resumeTimer,
        togglePause,
        resetTimer,
        addTime,
        subtractTime
    };
};