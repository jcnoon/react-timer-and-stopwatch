import { Time } from "./types/types";

export interface ITimeObject {
    milliseconds?: number
    seconds?: number
    minutes?: number
    hours?: number
    days?: number
    toMilliseconds: () => number
}

/** Holds keys of units of time and values of numbers and can convert them into a total number of milliseconds */
export class TimeObject implements ITimeObject {
    milliseconds?: number;
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    /** Can take either a number of milliseconds or an object with units of time as keys and numbers as values */
    constructor(time: Time) {
        this.milliseconds = typeof time === 'object' ? time.milliseconds : time;
        this.seconds = typeof time === 'object' ? time.seconds : 0;
        this.minutes = typeof time === 'object' ? time.minutes : 0;
        this.hours = typeof time === 'object' ? time.hours : 0;
        this.days = typeof time === 'object' ? time.days : 0;
    }
    /** Converts TimeObject's units of time into a total number of milliseconds */
    toMilliseconds(): number {
        let total = 0;
        if (this.days) total = this.days * 24; // Turn into hours
        if (this.hours) total += this.hours; // Add hours
        if (total) total = total * 60; // Turn into minutes
        if (this.minutes) total += this.minutes; // Add minutes
        if (total) total = total * 60; // Turn into seconds
        if (this.seconds) total += this.seconds; // Add seconds
        if (total) total = total * 1000; // Turn into milliseconds
        if (this.milliseconds) total += this.milliseconds; // Add milliseconds
        return total;
    }
}