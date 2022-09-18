import { describe, expect, test } from 'vitest';

import { Duration } from "../duration";
import { DirectionOfTime } from "../types/types";

describe('determine Duration behavior', () => {

    test('constructor', () => {
        const duration = new Duration({
            create: {
                timerWithDuration: {
                    time: 10000,
                    directionOfTimeForward: true
                }
            },
            intervalRate: 86
        });
        expect(duration.timestamps.start).toBe(0);
        expect(duration.timestamps.end).toBe(10000);
        expect(duration.directionOfTime).toBe(DirectionOfTime.Forward);
        expect(duration.intervalRate).toBe(86);
    });

    test('Duration.advanceTimestamps', () => {
        const duration1 = new Duration({
            create: {
                timerWithDuration: {
                    time: 5000
                }
            }
        });
        expect(duration1.timestamps.start).toBe(0);
        duration1.advanceTimestamps(); // Advance to 1 second
        duration1.advanceTimestamps(); // Advance to 2 seconds
        expect(duration1.timestamps.start).toBe(2000);
        const duration2 = new Duration({
            create: {
                timerWithDuration: {
                    time: 5000,
                }
            },
            intervalRate: 50
        });
        expect(duration2.timestamps.start).toBe(0);
        duration2.advanceTimestamps(); // Advance to 50 milliseconds
        duration2.advanceTimestamps(); // Advance to 100 milliseconds
        expect(duration2.timestamps.start).toBe(100);
    });

    test('Duration.millisecondsToDisplay', () => {
        const duration1 = new Duration({
            create: {
                timerWithDuration: {
                    time: 5000,
                    directionOfTimeForward: false
                }
            }
        });
        expect(duration1.millisecondsToDisplay()).toBe(5000);
        duration1.advanceTimestamps(); // Advance to 4 seconds
        duration1.advanceTimestamps(); // Advance to 3 seconds
        expect(duration1.millisecondsToDisplay()).toBe(3000);
        const duration2 = new Duration({
            create: {
                timerWithDuration: {
                    time: 5000,
                    directionOfTimeForward: true
                }
            },
            intervalRate: 64
        });
        expect(duration2.millisecondsToDisplay()).toBe(0);
        duration2.advanceTimestamps(); // Advance to 64 milliseconds
        duration2.advanceTimestamps(); // Advance to 128 milliseconds
        expect(duration2.millisecondsToDisplay()).toBe(128);
    });

    test('Duration.isFinished', () => {
        const duration1 = new Duration({
            create: {
                timerWithDuration: {
                    time: 3000,
                    directionOfTimeForward: false
                }
            }
        });
        expect(duration1.isFinished()).toBe(false);
        duration1.advanceTimestamps();
        duration1.advanceTimestamps();
        duration1.advanceTimestamps();
        expect(duration1.isFinished()).toBe(true);
    });

    test('Duration.addTime', () => {
        const duration = new Duration({
            create: {
                timerWithDuration: {
                    time: 5000
                }
            }
        });
        const oldTimestampsEnd = duration.timestamps.end;
        duration.addTime(1000);
        expect(duration.timestamps.end).toEqual(oldTimestampsEnd + 1000);
    });

    test('Duration.subtractTime', () => {
        const duration1 = new Duration({
            create: {
                timerWithDuration: {
                    time: 5000
                }
            },
            intervalRate: 1000
        });
        duration1.advanceTimestamps(); // Advance to 1 second
        duration1.advanceTimestamps(); // Advance to 2 seconds
        duration1.advanceTimestamps(); // Advance to 3 seconds
        duration1.subtractTime(1000); // Contracts the timer, adding to timestamps.start
        expect(duration1.timestamps.start).toEqual(4000);
        duration1.subtractTime(3000); // Tries to contract and add 3 seconds to start, but it reaches end of timer at 5000 milliseconds so it stops there
        expect(duration1.timestamps.start).toEqual(5000);
    });
});