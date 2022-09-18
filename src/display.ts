import { IDisplay } from "./interfaces/IDisplay";
import { RelevantDisplayUnits, TimerDisplayNumbers, TimerDisplayStrings, UnitOfTime, UseTimerOptions } from "./types/types";

/** Handles the creation of DisplayNumbers and TimerText */
export class Display implements IDisplay {
    textOutputWithWords: boolean;
    includeMilliseconds: boolean;

    constructor(options: Partial<UseTimerOptions>) {
        this.textOutputWithWords = options.textOutputWithWords ? true : false;
        this.includeMilliseconds = options.includeMilliseconds ?? false;
    }

    /**Determine which units of time are relevant to the display string */
    getRelevantDisplayUnits(millisecondsToDisplay: number): RelevantDisplayUnits {
        return {
            days: millisecondsToDisplay >= 86400000 ? true : false,
            hours: millisecondsToDisplay >= 3600000 ? true : false,
            minutes: millisecondsToDisplay >= 60000 ? true : false,
            seconds: millisecondsToDisplay >= 1000 ? true : false,
            milliseconds: true
        };
    }

    createDisplayNumbers(millisecondsToDisplay: number): TimerDisplayNumbers {
        const absoluteMilliseconds = Math.abs(millisecondsToDisplay);
        const milliseconds = absoluteMilliseconds % 1000;
        const seconds = absoluteMilliseconds / 1000;
        const secondsRounded = Math.floor(seconds);
        const minutes = seconds / 60;
        const minutesRounded = Math.floor(minutes);
        const hours = minutes / 60;
        const hoursRounded = Math.floor(hours);
        const days = hours / 24;
        const daysRounded = Math.floor(days);
        return {
            milliseconds,
            seconds: this.totalOrRemainderTime(secondsRounded, 60, 'seconds'),
            minutes: this.totalOrRemainderTime(minutesRounded, 60, 'minutes'),
            hours: this.totalOrRemainderTime(hoursRounded, 24, 'hours'),
            days: daysRounded
        };
    }

    createDisplayStrings(millisecondsToDisplay: number): TimerDisplayStrings {
        const timerDisplayNumbers = this.createDisplayNumbers(millisecondsToDisplay);
        return this.displayNumbersToDisplayStrings(timerDisplayNumbers);
    }

    displayNumberToString(displayNumber: number, numberIsMilliseconds?: boolean) {
        displayNumber = Math.abs(displayNumber)
        if (numberIsMilliseconds) {
            if (displayNumber < 100) {
                return displayNumber < 10 ? `00${displayNumber}` : `0${displayNumber}`;
            }
            return String(displayNumber);
        }
        // textOutputWithWords keeps the extra 0 or 00 in milliseconds
        // so that the rest of the string doesn't jump around rapidly
        if (this.textOutputWithWords) {
            return String(displayNumber);
        }
        return displayNumber < 10 ? `0${displayNumber}` : String(displayNumber);
    }

    displayNumbersToDisplayStrings(displayNumbers: TimerDisplayNumbers): TimerDisplayStrings {
        return {
            seconds: this.displayNumberToString(displayNumbers.seconds),
            minutes: this.displayNumberToString(displayNumbers.minutes),
            hours: this.displayNumberToString(displayNumbers.hours),
            days: this.displayNumberToString(displayNumbers.days),
            milliseconds: this.displayNumberToString(displayNumbers.milliseconds, true)
        };
    }

    createTimerText(millisecondsToDisplay: number, pastFinish?: boolean): string {
        millisecondsToDisplay = Math.abs(millisecondsToDisplay);
        const timerDisplayNumbers = this.createDisplayNumbers(millisecondsToDisplay);
        const timerDisplayStrings = this.displayNumbersToDisplayStrings(timerDisplayNumbers);
        const relevantDisplayUnits = this.getRelevantDisplayUnits(millisecondsToDisplay);
        if (this.textOutputWithWords) {
            return this.createTextOutputWithWords(timerDisplayStrings, relevantDisplayUnits, pastFinish);
        }
        return this.createTextOutputWithoutWords(timerDisplayStrings, relevantDisplayUnits, pastFinish);
    }

    private createTextOutputWithoutWords(timerDisplayStrings: TimerDisplayStrings, relevantDisplayUnits: RelevantDisplayUnits, pastFinish?: boolean): string {
        const negative = pastFinish ? '-' : '';
        const days = relevantDisplayUnits.days ? timerDisplayStrings.days + ":" : "";
        const milliseconds = this.includeMilliseconds ? `:${timerDisplayStrings.milliseconds}` : '';
        return `${negative}${days}${timerDisplayStrings.hours}:${timerDisplayStrings.minutes}:${timerDisplayStrings.seconds}${milliseconds}`;
    }

    private createTextOutputWithWords(timerDisplayStrings: TimerDisplayStrings, relevantDisplayUnits: RelevantDisplayUnits, pastFinish?: boolean): string {
        const ago = pastFinish ? ' ago' : '';
        let days = '';
        const daysPlural = Number(timerDisplayStrings.days) === 1 ? '' : 's';
        if (relevantDisplayUnits.days)
            days = `${timerDisplayStrings.days} day${daysPlural}, `;
        let hours = '';
        const hoursPlural = Number(timerDisplayStrings.hours) === 1 ? '' : 's';
        if (relevantDisplayUnits.hours)
            hours = `${timerDisplayStrings.hours} hour${hoursPlural}, `;
        let minutes = '';
        const minutesPlural = Number(timerDisplayStrings.minutes) === 1 ? '' : 's';
        if (relevantDisplayUnits.minutes)
            minutes = `${timerDisplayStrings.minutes} minute${minutesPlural}, `;
        let seconds = '';
        const secondsPlural = Number(timerDisplayStrings.seconds) === 1 ? '' : 's';
        if (relevantDisplayUnits.seconds)
            seconds = `${timerDisplayStrings.seconds} second${secondsPlural}`;
        // So seconds at 0 doesn't disappear as the only unit of time left
        if (!relevantDisplayUnits.seconds && !this.includeMilliseconds)
            seconds = '0 seconds';
        let milliseconds = '';
        if (this.includeMilliseconds) {
            milliseconds = relevantDisplayUnits.seconds ? `, ${timerDisplayStrings.milliseconds} milliseconds` : `${timerDisplayStrings.milliseconds} milliseconds`;
        }
        return `${days}${hours}${minutes}${seconds}${milliseconds}${ago}`;
    }

     /** Determines whether the total time or the remainder should be returned, critical to display for example "60 minutes" or "24 hours" */
    private totalOrRemainderTime(total: number, remainder: number, unitOfTime: UnitOfTime) {
        if (unitOfTime !== 'days') {
            if (unitOfTime === 'seconds' && total > 60) {
                return total % 60 ? total % 60 : 0;
            }
            if (unitOfTime === 'minutes' && total > 60) {
                return total % 60 ? total % 60 : 0;
            }
            if (unitOfTime === 'hours' && total > 24) {
                return total % 24 ? total % 24 : 0;
            }
        }
        if (total === remainder) return 0;
        if (total === 0) return total;
        return total % remainder ? total % remainder : remainder;
    }
}