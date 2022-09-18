import { describe, expect, test } from 'vitest';

import { Display } from "../display";
import { RelevantDisplayUnits, TimerDisplayNumbers, TimerDisplayStrings } from "../types/types";

describe('Determine Display behavior', () => {

    test('Display constructor', () => {
        const display1 = new Display({
            includeMilliseconds: false
        });
        expect(display1.includeMilliseconds).toBe(false);
        expect(display1.textOutputWithWords).toBe(false);
        const display2 = new Display({
            includeMilliseconds: true,
            textOutputWithWords: true
        });
        expect(display2.includeMilliseconds).toBe(true);
        expect(display2.textOutputWithWords).toBe(true);
    });

    test('Display.getRelevantDisplayUnits', () => {
        const display = new Display({
            textOutputWithWords: true
        });
        const milliseconds1 = 5000;
        const expectedValues1: RelevantDisplayUnits = {
            milliseconds: true,
            seconds: true,
            minutes: false,
            hours: false,
            days: false
        };
        expect(display.getRelevantDisplayUnits(milliseconds1)).toEqual(expectedValues1);
        const milliseconds2 = 1800000;
        const expectedValues2: RelevantDisplayUnits = {
            milliseconds: true,
            seconds: true,
            minutes: true,
            hours: false,
            days: false
        };
        expect(display.getRelevantDisplayUnits(milliseconds2)).toEqual(expectedValues2);
        const milliseconds3 = 7200000;
        const expectedValues3: RelevantDisplayUnits = {
            milliseconds: true,
            seconds: true,
            minutes: true,
            hours: true,
            days: false
        };
        expect(display.getRelevantDisplayUnits(milliseconds3)).toEqual(expectedValues3);
        const milliseconds4 = 172800000;
        const expectedValues4: RelevantDisplayUnits = {
            milliseconds: true,
            seconds: true,
            minutes: true,
            hours: true,
            days: true
        };
        expect(display.getRelevantDisplayUnits(milliseconds4)).toEqual(expectedValues4);
    });

    test('Display.createDisplayNumbers', () => {
        const display = new Display({});
        const expectedValues1: TimerDisplayNumbers = {
            milliseconds: 0,
            seconds: 30,
            minutes: 1,
            hours: 0,
            days: 0
        };
        expect(display.createDisplayNumbers(90000)).toEqual(expectedValues1);
        const expectedValues2: TimerDisplayNumbers = {
            milliseconds: 0,
            seconds: 0,
            minutes: 1,
            hours: 0,
            days: 0
        };
        expect(display.createDisplayNumbers(60000)).toEqual(expectedValues2);
        const expectedValues3: TimerDisplayNumbers = {
            milliseconds: 0,
            seconds: 0,
            minutes: 0,
            hours: 1,
            days: 0
        };
        expect(display.createDisplayNumbers(3600000)).toEqual(expectedValues3);
        const expectedValues4: TimerDisplayNumbers = {
            milliseconds: 0,
            seconds: 0,
            minutes: 0,
            hours: 0,
            days: 1
        };
        expect(display.createDisplayNumbers(86400000)).toEqual(expectedValues4);
        const expectedValues5: TimerDisplayNumbers = {
            milliseconds: 839,
            seconds: 35,
            minutes: 32,
            hours: 12,
            days: 2
        };
        expect(display.createDisplayNumbers(217955839)).toEqual(expectedValues5);
        const expectedValues6: TimerDisplayNumbers = {
            milliseconds: 839,
            seconds: 0,
            minutes: 0,
            hours: 0,
            days: 0
        };
        expect(display.createDisplayNumbers(839)).toEqual(expectedValues6);
    });

    test('Display.displayNumberToString', () => {
        const display = new Display({});
        // Return string that's >= 10 or less than 10 with a 0 in front
        const displayString1 = display.displayNumberToString(20);
        expect(displayString1).toBe('20');
        const displayString2 = display.displayNumberToString(7);
        expect(displayString2).toBe('07');
        // test milliseconds
        const displayString3 = display.displayNumberToString(7, true);
        expect(displayString3).toBe('007');
        const displayString4 = display.displayNumberToString(20, true);
        expect(displayString4).toBe('020');
        const displayString5 = display.displayNumberToString(520, true);
        expect(displayString5).toBe('520');
    });

    test('Display.displayNumbersToDisplayStrings', () => {
        const display = new Display({
            textOutputWithWords: false
        });
        const timeDisplayNumbers1 = display.createDisplayNumbers(5000);
        const expectedValues1: TimerDisplayStrings = {
            milliseconds: '000',
            seconds: '05',
            minutes: '00',
            hours: '00',
            days: '00'
        };
        expect(display.displayNumbersToDisplayStrings(timeDisplayNumbers1)).toEqual(expectedValues1);
        display.textOutputWithWords = true;
        const timeDisplayNumbers2 = display.createDisplayNumbers(5000);
        const expectedValues2: TimerDisplayStrings = {
            milliseconds: '000',
            seconds: '5',
            minutes: '0',
            hours: '0',
            days: '0'
        };
        expect(display.displayNumbersToDisplayStrings(timeDisplayNumbers2)).toEqual(expectedValues2);
    });

    test('Display.createTimerText', () => {
        // With defaults
        const display = new Display({});
        const timerText1 = display.createTimerText(90000);
        expect(timerText1).toBe('00:01:30');
        // With days
        const timerText2 = display.createTimerText(90000);
        expect(timerText2).toBe('00:01:30');
        // With milliseconds
        display.includeMilliseconds = true;
        const timerText3 = display.createTimerText(7500000);
        expect(timerText3).toBe('02:05:00:000');
        // The rest are with numbersWithWords
        display.textOutputWithWords = true;
        display.includeMilliseconds = false;
        const timerText5 = display.createTimerText(90000);
        expect(timerText5).toBe('1 minute, 30 seconds');
        // With milliseconds
        display.includeMilliseconds = true;
        const timerText6 = display.createTimerText(7500000);
        expect(timerText6).toBe('2 hours, 5 minutes, 0 seconds, 000 milliseconds');
        // With days
        display.includeMilliseconds = false;
        const timerText7 = display.createTimerText(217955839);
        expect(timerText7).toBe('2 days, 12 hours, 32 minutes, 35 seconds');
        // With days and milliseconds
        display.includeMilliseconds = true;
        const timerText8 = display.createTimerText(217955839);
        expect(timerText8).toBe('2 days, 12 hours, 32 minutes, 35 seconds, 839 milliseconds');
    });
});