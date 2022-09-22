import { describe, expect, test } from 'vitest';

import { CreationType, UseTimerOptions } from "../types/types";
import { determineCreationType, handleOptionsReset } from "../util";

describe('util functions', () => {

    test('determineCreationType', () => {
        const creation1 = determineCreationType({
            create: { stopwatch: {} }
        });
        expect(creation1).toBe(CreationType.Stopwatch);

        const creation2 = determineCreationType({
            create: { timerWithDuration: { time: 5000 } }
        });
        expect(creation2).toBe(CreationType.Duration);

        const creation3 = determineCreationType({
            create: { timerWithUnixTimestamp: { unixTimestampMilliseconds: Date.now() + 5000 } }
        });
        expect(creation3).toBe(CreationType.UnixTimestamp);
    });

    describe('handleOptionsReset behavior', () => {
        const oldOptions: UseTimerOptions = {
            create: { stopwatch: {} },
            autoplay: true,
            intervalRate: 23,
            includeMilliseconds: true
        };
        const adjustedOptionsWithoutCreate: Partial<UseTimerOptions> = {
            autoplay: false,
            intervalRate: 74,
            includeMilliseconds: false
        };
        const adjustedOptionsWithCreate: Partial<UseTimerOptions> = {
            create: {
                timerWithDuration: {
                    time: { seconds: 30 }
                }
            },
            autoplay: false,
            intervalRate: 5000,
            includeMilliseconds: false
        };
        test('a simple reset', () => {
            const simpleResetOptions = handleOptionsReset(oldOptions);
            expect(simpleResetOptions).toEqual(oldOptions);
        });
        test('adjusting options', () => {
            const patchedOptions = handleOptionsReset(oldOptions, adjustedOptionsWithoutCreate, false);
            expect(patchedOptions).toEqual({ ...oldOptions, ...adjustedOptionsWithoutCreate });
        });
        test('replacing options (including create object)', () => {
            const replacedOptions = handleOptionsReset(oldOptions, adjustedOptionsWithCreate, true);
            expect(replacedOptions).toEqual(adjustedOptionsWithCreate);
        });
        test('replacing options (neglecting to include create object)', () => {
            const replacedOptions = handleOptionsReset(oldOptions, adjustedOptionsWithoutCreate, true);
            // create wasn't included, so it defaults to only adjusting the old options instead of replacing them entirely
            expect(replacedOptions).toEqual({ ...oldOptions, ...adjustedOptionsWithoutCreate });
        });
    });

    
});