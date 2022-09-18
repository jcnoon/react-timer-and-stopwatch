import { describe, expect, test, beforeEach } from 'vitest';

import { UnixTimestamp } from "../unix-timestamp";


describe('UnixTimestamp test setup', () => {
    let unixTimestamp: UnixTimestamp;
    let timestamp: number;
    beforeEach(() => {
        timestamp = Date.now() + 10000;
        unixTimestamp = new UnixTimestamp({ create: {timerWithUnixTimestamp: { unixTimestampMilliseconds: timestamp } } });
    });
    describe('UnixTimestamp tests', () => {

        test('UnixTimestamp constructor', () => {
            const unixTimestampCtr = new UnixTimestamp({
                create: {
                    timerWithUnixTimestamp: {
                        unixTimestampMilliseconds: Date.now() + 10000,
                    }
                },
                intervalRate: 1000
            });
            expect(unixTimestampCtr.intervalRate).toEqual(1000);
        });
    });

    test('UnixTimestamp.advanceTimestamps', () => {
        expect(unixTimestamp.timestamps.start).toBe(0);
        unixTimestamp.advanceTimestamps(); // Advance to 1 second
        unixTimestamp.advanceTimestamps();  // Advance to 2 seconds
        expect(unixTimestamp.timestamps.start).toBe(2000);
    });

    test('UnixTimestamp.millisecondsToDisplay', () => {
        expect(unixTimestamp.millisecondsToDisplay()).toBe(10000);
        unixTimestamp.advanceTimestamps(); // Advance to 1 second
        unixTimestamp.advanceTimestamps();  // Advance to 2 seconds
        expect(unixTimestamp.millisecondsToDisplay()).toBe(8000);
    });

    test('UnixTimestamp.isFinished', () => {
        expect(unixTimestamp.isFinished()).toBe(false);
        for (let i = 0; i < 10; i++) {
            unixTimestamp.advanceTimestamps();
        }
        expect(unixTimestamp.isFinished()).toBe(true);
    });

    test('UnixTimestamp.IsPastFinish', () => {
        // Without continueAfterFinish option
        expect(unixTimestamp.IsPastFinish()).toBe(false);
        for (let i = 0; i < 11; i++) {
            unixTimestamp.advanceTimestamps();
        }
        expect(unixTimestamp.IsPastFinish()).toBe(false);

        // With continueAfterFinish option
        const unixTimestamp2 = new UnixTimestamp({
            create: {
                timerWithUnixTimestamp: {
                    unixTimestampMilliseconds: Date.now() + 10000,
                    continueAfterFinish: true
                }
            },
            intervalRate: 1000
        });
        expect(unixTimestamp2.IsPastFinish()).toBe(false);
        for (let i = 0; i < 11; i++) {
            unixTimestamp2.advanceTimestamps();
        }
        expect(unixTimestamp2.IsPastFinish()).toBe(true);
    });
});