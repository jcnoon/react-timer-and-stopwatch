import { describe, expect, test } from 'vitest';

import { CreationType } from "../types/types";
import { determineCreationType } from "../util";

describe('util behavior', () => {

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

});