import { TimerController } from "../timer-controller";
import { TimerState, TimerAction, DirectionOfTime } from "../types/types";

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
    switch(action.type) {
        case 'pause':
            return { ...state, paused: true };
        case 'resume':
            return { ...state, paused: false };
        case 'togglePause':
            return { ...state, paused: !state.paused};
        case 'updateTimer': {
            const timerController = action.payload as TimerController;
            return { 
                ...state, 
                timerText: timerController.getTimerText(),
                timerDisplayStrings: timerController.getTimerDisplayStrings(),
                timeElapsed: timerController.getTimeElapsed()
            };
        }
        case 'timerIsFinished': {
            const timerController = action.payload as TimerController;
            const pastFinish = timerController.continueAfterFinish;
            // The finished timer string should either represent 0 milliseconds (if timer flows backward) or the timer's end
            const milliseconds = timerController.timerBase.directionOfTime === DirectionOfTime.Backward ? 0 : timerController.timerBase.timestamps.end;
            return { ...state,
                timerIsFinished: true,
                pastFinish,
                timerText: timerController.getTimerText(milliseconds),
                timerDisplayStrings: timerController.getTimerDisplayStrings(milliseconds),
                timeElapsed: timerController.timerBase.timestamps.end
            };
        }
        case 'resetTimer':
            return { ...action.payload };
        case 'timerIsPastFinish':
            return { ...state, pastFinish: true }
        default:
            return state;
    }
}