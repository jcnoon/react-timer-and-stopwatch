import { describe, expect, test } from 'vitest';

import { TimeObject } from "../time-object";

describe('confirm TimeObject behavior', () => {
    test('with number argument', () => {
        const timeObject = new TimeObject(5000);
        expect(timeObject.toMilliseconds()).toEqual(5000);
    });
    test('with object argument', () => {
        let timeObject = new TimeObject({
            seconds: 8,
            minutes: 1
        });
        expect(timeObject.toMilliseconds()).toEqual(68000);
        timeObject = new TimeObject({
            days: 2,
            hours: 4
        });
        expect(timeObject.toMilliseconds()).toEqual(187200000);
        timeObject = new TimeObject({
            minutes: 4,
            seconds: 2,
            milliseconds: 583
        });
        expect(timeObject.toMilliseconds()).toEqual(242583);
    });
});