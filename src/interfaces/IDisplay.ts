import { RelevantDisplayUnits, TimerDisplayNumbers, TimerDisplayStrings } from "../types/types"

export interface IDisplay {
    textOutputWithWords: boolean
    includeMilliseconds: boolean
    createTimerText: (millisecondsToDisplay: number, pastFinish: boolean) => string
    createDisplayNumbers: (millisecondsToDisplay: number) => TimerDisplayNumbers
    createDisplayStrings: (millisecondsToDisplay: number) => TimerDisplayStrings
    getRelevantDisplayUnits: (millisecondsToDisplay: number) => RelevantDisplayUnits
}