import { Callbacks } from "../callbacks"
import { Display } from "../display"
import { Time, TimerDisplayNumbers } from "../types/types"
import { ITimerBase } from "./ITimerBase"

export interface ITimerController {
    display: Display
    callbacks: Callbacks
    timerBase: ITimerBase
    continueAfterFinish: boolean
    intervalRate: number
    timerIsFinished: boolean
    pastFinish: boolean
    addTime: (time: Time) => void
    subtractTime: (time: Time) => void
    /** Advance timestamps one interval tick */
    advanceTimestamps(): void
    getTimerText: (milliseconds?: number) => string
    getTimerDisplayNumbers: (milliseconds?: number) => TimerDisplayNumbers
}