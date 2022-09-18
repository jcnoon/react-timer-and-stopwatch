import { describe, expect, test, beforeEach } from 'vitest';

import { Callbacks } from "../callbacks";

describe('Callbacks setup', () => {
    let callbacks: Callbacks
    let testNum: number;
    beforeEach(() => {
        testNum = 0;
        callbacks = new Callbacks({
            create: {
                timerWithDuration: {
                    time: 5000
                }
            },
            callbacks: {
                onTick: () => testNum += 1,
                onFinish: () => testNum += 1,
                onProgress: [
                    {
                        callback: () => testNum += 1,
                        time: 1000
                    },
                    {
                        callback: () => testNum += 1,
                        time: 2000
                    },
                    {
                        callback: () => testNum += 1,
                        time: 3000
                    },
                    {
                        callback: () => testNum += 1,
                        time: 4000
                    },
                ],
                onTimeLeft: [
                    {
                        callback: () => testNum += 1,
                        time: 4000
                    },
                    {
                        callback: () => testNum += 1,
                        time: 3000
                    },
                    {
                        callback: () => testNum += 1,
                        time: 2000
                    },
                    {
                        callback: () => testNum += 1,
                        time: 1000
                    },
                ]
            }
        },
        5000);
    });

    describe('Callback Tests', () => {
        test('onFinish', () => {
            expect(testNum).toBe(0);
            callbacks.onFinish?.();
            expect(testNum).toBe(1);
        });
        test('onTick', () => {
            expect(testNum).toBe(0);
            callbacks.onTick?.();
            expect(testNum).toBe(1);
        });
        test('onProgress', () => {
            expect(testNum).toBe(0);
            expect(callbacks.onProgressControllers.length === 4);

            callbacks.onProgress(1000);
            expect(testNum).toBe(1);
            expect(callbacks.onProgressControllers.length === 3);

            callbacks.onProgress(2000);
            expect(testNum).toBe(2);
            expect(callbacks.onProgressControllers.length === 2);

            callbacks.onProgress(3000);
            expect(testNum).toBe(3);
            expect(callbacks.onProgressControllers.length === 1);

            callbacks.onProgress(4000);
            expect(testNum).toBe(4);
            expect(callbacks.onProgressControllers.length === 0);

            callbacks.onProgress(5000);
            expect(testNum).toBe(4);
            
        });

        test('onTimeLeft', () => {
            expect(testNum).toBe(0);
            expect(callbacks.onTimeLeftControllers.length === 4);

            callbacks.onTimeLeft(4000);
            expect(testNum).toBe(1);
            expect(callbacks.onTimeLeftControllers.length === 3);

            callbacks.onTimeLeft(3000);
            expect(testNum).toBe(2);
            expect(callbacks.onTimeLeftControllers.length === 2);

            callbacks.onTimeLeft(2000);
            expect(testNum).toBe(3);
            expect(callbacks.onTimeLeftControllers.length === 1);

            callbacks.onTimeLeft(1000);
            expect(testNum).toBe(4);
            expect(callbacks.onTimeLeftControllers.length === 0);

            callbacks.onTimeLeft(0);
            expect(testNum).toBe(4);
            
        });
    });
});