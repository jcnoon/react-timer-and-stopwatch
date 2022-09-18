import { describe, expect, test, beforeEach } from 'vitest';

import { timerReducer } from "../reducers/timer-reducer";
import { TimerController } from "../timer-controller";
import { UseTimerOptions } from "../types/types";
import { createTimerController, initializeTimerState } from "../util";

describe('timerReducer test setup', () => {
    let timerController: TimerController;
    let options: UseTimerOptions;
    beforeEach(() => {
        options = {
            create: {
                timerWithDuration: {
                    time: 3000
                }
            },
            intervalRate: 1000
        }
        timerController = createTimerController(options);
    });

    describe('Confirm timerReducer behavior', () => {
        test('pause', () => {
            const state = initializeTimerState(options, timerController);
            const updatedState = timerReducer(state, {
                type: 'pause'
            });
            expect(updatedState.paused).toBe(true);
        });

        test('resume', () => {
            const state = initializeTimerState(options, timerController);
            const updatedState = timerReducer(state, {
                type: 'resume'
            });
            expect(updatedState.paused).toBe(false);
        });

        test('togglePause', () => {
            const state = initializeTimerState(options, timerController);
            expect(state.paused).toBe(false);
            const updatedState1 = timerReducer(state, {
                type: 'togglePause'
            });
            expect(updatedState1.paused).toBe(true);

            const updatedState2 = timerReducer(updatedState1, {
                type: 'togglePause'
            });
            expect(updatedState2.paused).toBe(false);
        });

        test('timerIsFinished', () => {
            const state = initializeTimerState(options, timerController);
            expect(state.timerIsFinished).toBe(false);
            timerController.advanceTimestamps();
            timerController.advanceTimestamps();
            timerController.advanceTimestamps();
            const updatedState = timerReducer(state, {
                type: 'timerIsFinished',
                payload: timerController
            });
            expect(updatedState.timerIsFinished).toBe(true);
        });

        test('updateTimer', () => {
            const state = initializeTimerState(options, timerController);
            expect(state.timerText).toBe("00:00:03");
            timerController.advanceTimestamps();
            const updatedState = timerReducer(state, {
                type: 'updateTimer',
                payload: timerController
            });
            expect(updatedState.timerText).toBe("00:00:02");
        });

        test('resetTimer', () => {
            const state = initializeTimerState(options, timerController);
            expect(state.timerText).toBe("00:00:03");
            timerController.advanceTimestamps();
            timerController.advanceTimestamps();
            const updatedState1 = timerReducer(state, {
                type: 'updateTimer',
                payload: timerController
            });
            expect(updatedState1.timerText).toBe("00:00:01");
            options = {
                create: {
                    timerWithDuration: {
                        time: 3000
                    }
                },
                intervalRate: 1000
            }
            timerController = createTimerController(options);
            const updatedState2 = timerReducer(updatedState1, {
                type: 'resetTimer',
                payload: initializeTimerState(options, timerController)
            });
            expect(updatedState2.timerText).toBe("00:00:03");
        });

        test('timerIsPastFinish', () => {
            options = {
                create: {
                    timerWithUnixTimestamp: { unixTimestampMilliseconds: Date.now() + 2000 }
                },
                intervalRate: 1000
            }
            timerController = createTimerController(options);
            const state = initializeTimerState(options, timerController);
            timerController.advanceTimestamps();
            timerController.advanceTimestamps();
            timerController.advanceTimestamps();
            const updatedState1 = timerReducer(state, {
                type: 'timerIsPastFinish',
                payload: timerController
            });
            expect(updatedState1.pastFinish).toBe(true);
        });
    });
});