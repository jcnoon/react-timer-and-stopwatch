import { Timestamps, DirectionOfTime, Time } from "../types/types";

/** Properties shared by Duration, UnixTimestamp, and Stopwatch */
export interface ITimerBase {
    timestamps: Timestamps;
    intervalRate: number;
    //** Whether timer should continue after finished in negative numbers */
    continueAfterFinish: boolean;
    directionOfTime: DirectionOfTime;
    /** Get the milliseconds which will be used with Display class */
    millisecondsToDisplay: () => number;
    /** Advance timestamps one interval tick */
    advanceTimestamps: () => void;
    addTime: (time: Time) => void;
    subtractTime: (time: Time) => void;
    isFinished: () => boolean;
    IsPastFinish: () => boolean;
    /** Time elapsed in timer in milliseconds */
    timeElapsed: number;
    //** Time left until timer is finished in milliseconds. For Stopwatch, this is always 0. */
    timeLeft: number;
}
