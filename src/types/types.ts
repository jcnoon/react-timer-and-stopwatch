export type UnitOfTime = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days'

/** A number of milliseconds, or an object with units of time as keys and numbers as values which will be converted to milliseconds */
export type Time = number | { days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number }

export interface TimerDisplayStrings {
    days: string | null
    hours: string | null
    minutes: string | null
    seconds: string | null
    milliseconds: string | null
}

export interface TimerDisplayNumbers {
    days: number
    hours: number
    minutes: number
    seconds: number
    milliseconds: number
}

export interface CreateOptions {
    /** Creates timer with a duration */
    timerWithDuration?: {

        /** How long the timer will run. Either a number of milliseconds or a Time Object, e.g. { hours: 2, minutes: 5, seconds: 38 } */
        time: Time

        /** Whether the timerText will flow forward (start at 0 and count forward) or backward (start at end of timer, count backward) - Defaults to false, meaning a backward direction in time 
         * Example:
         * 
         * forward: 00:00:00 -> 00:00:01 -> 00:00:02 -> 00:00:03
         * 
         * backward: 00:00:03 -> 00:00:02 -> 00:00:01 -> 00:00:00
        */
        directionOfTimeForward?: boolean
    }

    /** Creates timer with a unix timestamp in milliseconds */
    timerWithUnixTimestamp?: {
    
        unixTimestampMilliseconds: number

        /**
            * Whether a timer continues after it reaches the end, showing a negative number (-00:02:31) or 'ago' (2 minutes, 31 seconds ago). onTick callbacks continue firing
            * - Defaults to true
        **/
        continueAfterFinish?: boolean
    }

    /** Creates a stopwatch */
    stopwatch?: {
        /** Option to start the stopwatch past zero, at the provided number of milliseconds */
        startAtMilliseconds?: number
    }
}

/**  */
export interface UseTimerOptions {

    /** Choose which timer or stopwatch you want to create. - Required */
    create: CreateOptions

    /** Options to include onTick, onFinish, and onProgress callback functions */
    callbacks?: CallbackOptions

    /** How fast the timer ticks in milliseconds. Important if you want to display milliseconds. - Defaults to 1000 */
    intervalRate?: number

    /** Whether milliseconds are included on the timerText display. - Defaults to false */
    includeMilliseconds?: boolean

    /** Whether the timerText string is numbers, e.g. 00:01:45, or numbers with words, e.g. 1 minute, 45 seconds - Defaults to 'numbers' */
    textOutputWithWords?: boolean

    /** Whether timer starts automatically - Defaults to true */
    autoplay?: boolean
}

export enum CreationType {
    Duration,
    UnixTimestamp,
    Stopwatch
}

export enum DirectionOfTime {
    Forward,
    Backward
}

export type TextOutput = 'numbers' | 'numbersWithWords'

export interface Callbacks {
    onTick?: () => void
    onFinish?: () => void
    onProgressControllers?: OnProgressController[]
}

export interface CallbackOptions {
    onTick?: () => void
    onFinish?: () => void
    /** An array of callbacks that will fire at set times in the timer */
    onProgress?: OnProgressOption[]
    /** An array of callbacks that will fire when there's X amount of time left on the timer. These callbacks will never fire on a Stopwatch. */
    onTimeLeft?: OnTimeLeftOption[]
}

export interface TimerState {
    paused: boolean
    timerIsFinished: boolean
    timerText: string
    timerDisplayStrings: TimerDisplayStrings
    timeElapsed: number
    pastFinish: boolean    
}

export type TimerActionType = 'pause' | 'resume' | 'togglePause' | 'updateTimer' | 'timerIsFinished' | 'resetTimer' | 'timerIsPastFinish'

export interface TimerAction {
    type: TimerActionType
    payload?: any
}

export interface TimerUpdatePayload {
    timerText: string
    timerDisplayNumbers: TimerDisplayNumbers
}

export interface Timestamps {
    start: number
    end: number
}

export enum CallbackType {
    OnProgress,
    OnTimeLeft
}

export interface CallbackOption {
    time: Time
    callback: () => void
}

export interface CallbackController {
    milliseconds: number
    callback: () => void
    fired: boolean
}

export interface OnProgressOption {
    /** How far into the timer you want the onProgress callback to fire. Can either be a number of milliseconds or a Time Object, e.g. { hours: 3, minutes: 45 } */
    time: Time
    callback: () => void
}

export interface OnProgressController {
    milliseconds: number
    callback: () => void
    fired: boolean
}

export interface OnTimeLeftOption {
    /** How much time is left on timer when this onTimeLeft callback is called. Can either be a number of milliseconds or a Time Object, e.g. { hours: 3, minutes: 45 } */
    time: Time
    callback: () => void
}

export interface OnTimeLeftController {
    milliseconds: number
    callback: () => void
    fired: boolean
}

// The object returned from useTimer
export interface Timer {
    /** The display text of the timer */
    timerText: string

    /** Object/string version of timerText. Has keys of units of time and values of strings, e.g. { minutes: "02", seconds: "40" } */
    timerDisplayStrings: TimerDisplayStrings
    /** Elapsed time in milliseconds. Important: this number is updated every interval, not necessarily updated every millisecond */
    timeElapsed: number
    timerIsPaused: boolean
    timerIsFinished: boolean
    pauseTimer: () => void
    resumeTimer: () => void
    togglePause: () => void

    /** Resets timer to beginning and to original options supplied to useTimer if no parameters included.
     * If you'd like to add or change some options to the timer/stopwatch, include an options object in the first parameter.
     * If you'd like that object to replace the original entirely (rather than adjust it), set the second parameter to true.
     * @param {Partial<UseTimerOptions>} [adjustedOptions] - a partial useTimer options object to adjust your options, or a full useTimer options object if you'd like to replace it
     * @param {boolean} [replaceOptions] - Indicating whether you want to replace the old original options entirely with your new one, or just adjust a few included settings on it and keep the rest of the old options.*/
    resetTimer: (adjustedOptions?: Partial<UseTimerOptions>, replaceOptions?: boolean) => void

    /** - Stopwatch - Adds time to elapsed Stopwatch time. Example: addTime(5000) on a Stopwatch with 10 seconds increases it to 15 seconds
    - Duration timer - Expands timer time, pushing back its end
    - UnixTime timer: Has no effect on UnixTime timer.
    */
    addTime: (time: number | { days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number }) => void

    /** - Stopwatch - Subtracts time from elapsed Stopwatch time. Stops at 0.
    - Duration timer - Shortens timer time, bringing it closer to its end
    - UnixTime timer: Has no effect on UnixTime timer.
    */
    subtractTime: (time: number | { days?: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number }) => void

    /** Whether the UnixTime timer is currently running past its finish, displaying how much time since it finished. Useful for customized display with timeDisplay, knowing when the timer is in the negative. */
    pastFinish: boolean
}

/** Which units of time should show up in timerText with a textOutput: 'numbersWithWords' setting */
export interface RelevantDisplayUnits {
    days: boolean
    hours: boolean
    minutes: boolean
    seconds: boolean
    milliseconds: boolean
}