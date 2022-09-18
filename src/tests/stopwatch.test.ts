import { describe, expect, test, beforeEach } from 'vitest';

import { Stopwatch } from "../stopwatch";

describe('Stopwatch behavior', () => {
    let stopwatch: Stopwatch;
    beforeEach(() => {
        stopwatch = new Stopwatch({ create: { stopwatch: {} } })
    });
    describe('Stopwatch tests', () => {
        test('Stopwatch.advanceTimestamps', () => {
            expect(stopwatch.timestamps.start).toBe(0);
            stopwatch.advanceTimestamps(); // Advance to 1 second
            stopwatch.advanceTimestamps(); // Advance to 2 seconds
            expect(stopwatch.timestamps.start).toBe(2000);

            const stopwatch2 = new Stopwatch({ create: { stopwatch: {} }, intervalRate: 86 })
            expect(stopwatch2.timestamps.start).toBe(0);
            stopwatch2.advanceTimestamps(); // Advance to 86 milliseconds
            stopwatch2.advanceTimestamps(); // Advance to 172 milliseconds
            expect(stopwatch2.timestamps.start).toBe(172);
        });
        test('Stopwatch.millisecondsToDisplay', () => {
            expect(stopwatch.millisecondsToDisplay()).toBe(0);
            stopwatch.advanceTimestamps(); // Advance to 1 second
            stopwatch.advanceTimestamps(); // Advance to 2 seconds
            expect(stopwatch.millisecondsToDisplay()).toBe(2000);
        });
        test('Stopwatch.addTime', () => {
            expect(stopwatch.timestamps.start).toBe(0);
            stopwatch.addTime(5000);
            expect(stopwatch.timestamps.start).toBe(5000);
        });
        test('Stopwatch.subractTime', () => {
            stopwatch.advanceTimestamps(); // Advance to 1 second
            stopwatch.advanceTimestamps(); // Advance to 2 seconds
            stopwatch.advanceTimestamps(); // Advance to 3 seconds
            expect(stopwatch.timestamps.start).toBe(3000);
            stopwatch.subtractTime(1000);
            expect(stopwatch.timestamps.start).toBe(2000);

            const stopwatch2 = new Stopwatch({
                create: { stopwatch: {} }
            });
            stopwatch2.advanceTimestamps(); // Advance to 1 second
            expect(stopwatch2.timestamps.start).toBe(1000);
            stopwatch2.subtractTime(5000);
            expect(stopwatch2.timestamps.start).toBe(0); // If subtractTime subtracts past 0, start is set to 0
        });
    });
    
});