# React Timer and Stopwatch hook
A simple out of the box but highly customizable timer and stopwatch hook for React.

## Contents
- [Installation](#installation)
- [Setup](#setup)
    - [Duration timer](#duration-timer)
    - [Unix timer](#unix-timer)
    - [Stopwatch](#stopwatch)
- [Control Functions](#control-functions)
- [Customization](#customization)
    - [timerText](#timerText)
    - [Callbacks](#callbacks)
    - [Misc Options](#misc-options)
- [Timer Properties](#timer-properties)
- [Common Parameters](#common-parameters)
- [Terminology](#terminology)
- [Demo](#demo)
- [License](#license)

## Installation
```sh
npm install react-timer-and-stopwatch
```

## Setup
There are three ways to set up the timer hook: countdown with a duration of time, countdown with a [Unix](https://en.wikipedia.org/wiki/Unix_time) timestamp in milliseconds, or as a stopwatch.

### Duration timer
To set up a timer with a duration, use the `timerWithDuration` object property on **useTimer**'s `options.create` object parameter. Inside of `timerWithDuration` are two properties, [`time`](#common-parameters) (required) and the optional `directionOfTimeForward` bool property. The [`time`](#common-parameters) property takes either a number of milliseconds or alternatively a [time object](#terminology). The optional `directionOfTimeForward` bool property controls whether the direction of the timer will flow forward (start at 00:00:00) or backward (start at end, finish at 00:00:00). Time flows backward by default on Duration timers.
#### Example
```jsx
import { useTimer } from "react-timer-and-stopwatch";
const SomeReactComponent = () => {
    const timer = useTimer({
        create: {
            timerWithDuration: {
                time: { // Set a duration of 1 minute and 30 seconds
                    minutes: 1,
                    seconds: 30
                }
            }
        }
    });
    return (
        <span>Time Left: {timer.timerText}</span>
    );
}
```
This span element will show the following each tick:
```
Time Left: 00:01:30
Time Left: 00:01:29
Time Left: 00:01:28
etc.
```

***

### Unix timer
To set up a timer with a Unix timestamp, use the `timerWithUnixTimestamp` object property on **useTimer**'s `options.create` object parameter.
#### Example
```jsx
import { useTimer } from "react-timer-and-stopwatch";
const SomeReactComponent = () => {
    const unixTimestamp = Date.now() + 10000; // 10 seconds in the future
    const timer = useTimer({
        create: {
            timerWithUnixTimestamp: {
                unixTimestampMilliseconds: unixTimestamp
            }
        }
    });
    return (
        <span>Time Left: {timer.timerText}</span>
    );
}
```
This span element will show the following each tick:
```
Time Left: 00:00:10
Time Left: 00:00:09
Time Left: 00:00:08
etc.
``` 
If you'd like the Unix timer to go past its finish and show the time elapsed since its finish in negative numbers, you can set the optional property `continueAfterFinish` to true on `options.create.timerWithUnixTimestamp`. By default it's set to false.
It's also easy to integrate a Unix timer with popular JavaScript time libraries such as Moment.js and Luxon because in the end all you need is the Unix time in milliseconds.

#### Moment.js example
```jsx
import { useTimer } from "react-timer-and-stopwatch";
import moment from 'moment';
const SomeReactComponent = () => {
    const unixTimestamp = moment('2025-08-14T11:04:10.570Z').valueOf(); // Using an ISO 8601 timestamp
    const timer = useTimer({
        create: {
            timerWithUnixTimestamp: {
                unixTimestampMilliseconds: unixTimestamp
            }
        }
    });
    return (
        <span>Time Left: {timer.timerText}</span>
    );
}
```

***

### Stopwatch
To set up a stopwatch, set the property `stopwatch` to an object on **useTimer**'s `options.create` object parameter. There are two properties on the `options` object, [`intervalRate` and `includeMilliseconds`](#misc-options), which can be useful here. If you'd like your stopwatch to count by milliseconds and show milliseconds in the output, change the optional properties `intervalRate` to something smaller than 1000 and `includeMilliseconds` to true in `options`. If not included, by default the stopwatch will count by seconds and not show milliseconds in timerText. It will also autostart by default, which can be disabled by setting the optional `options` property `autostart` to false.
#### Example
```jsx
import { useTimer } from "react-timer-and-stopwatch";
const SomeReactComponent = () => {
    const timer = useTimer({
        create: {
            stopwatch: {}
        },
        includeMilliseconds: true,
        intervalRate: 47
    });
    return (
        <span>Time Left: {timer.timerText}</span>
    );
}
```
If you'd like to start the stopwatch past 0, you can set the optional `startAtMilliseconds` property on `create.stopwatch` to the number of milliseconds you wish.
***

## Control Functions
There are functions returned by **useTimer** which can pause, resume, and reset the timer/stopwatch. These are **togglePause**, **pauseTimer**, **resumeTimer**, and **resetTimer**. There's also a boolean returned, `timerIsPaused`, which shows if the Timer is currently paused or not.
#### Example
```jsx
const SomeReactComponent = () => {
    const timer = useTimer({
        create: {
            timerWithDuration: {
                time: { // Set to a duration of 30 seconds
                    seconds: 30
                }
            }
        }
    });
    const {togglePause, pauseTimer, resumeTimer, resetTimer, timerIsPaused, timerText} = timer;
    return (
        <>
            <span>Time Left: {timerText}</span>
            <button onClick={pauseTimer} disabled={timerIsPaused}>Pause</button>
            <button onClick={resumeTimer} disabled={!timerIsPaused}>Resume</button>
            <button onClick={togglePause} disabled={!timerIsPaused}>Toggle Pause</button>
            <button onClick={() => resetTimer()}>Reset Timer</button>
        </>
    );
}
```
**resetTimer** can reset the timer/stopwatch with the original options if no parameter is included, or you can include an options object in the first optional parameter (`adjustedOptions`) to either adjust the old options or replace the old options entirely. If you want to replace them, set the second optional parameter (`replaceOptions`) to true and be sure to include a new `create` object on your new options object.
#### Example
```jsx
const SomeReactComponent = () => {
    const timer = useTimer({
        create: {
            timerWithDuration: {
                time: { // Set to a duration of 30 seconds
                    seconds: 30
                }
            }
        }
    });
    const {togglePause, pauseTimer, resumeTimer, resetTimer, timerIsPaused, timerText} = timer;
    const resetAndAdjustOptions = () => { // These new options will essentially be patched onto the old options
        resetTimer({
            autoplay: false,
            includeMilliseconds: true,
            intervalRate: 37
        });
    }
    const resetAndReplaceOptions = () => { // This will replace the old options entirely, effectively creating a new timer/stopwatch on reset
        resetTimer({
            create: {
                stopwatch: {} // The timer was a Duration countdown timer, but after reset it will be a Stopwatch
            },
            includeMilliseconds: true,
            intervalRate: 37
        },
        true);
    }
    const resetTimerWithOldOptions = () => {
        resetTimer();
    }
    return (
        <>
            <span>Time Left: {timerText}</span>
            <button onClick={resetAndAdjustOptions}>Reset Timer and Adjust Options</button>
            <button onClick={resetAndReplaceOptions}>Reset Timer and Replace Options</button>
            <button onClick={resetTimerWithOldOptions}>Reset Timer with Old Options</button>
        </>
    );
}
```

There are also functions to add and subtract time from the current timer/stopwatch. These are **addTime** and **subtractTime**. Both take either a number of milliseconds or alternatively a [time object](#terminology).
#### Example
```jsx
const SomeReactComponent = () => {
    const timer = useTimer({
        create: {
            timerWithDuration: {
                time: { // Set to a duration of 1 day
                    days: 1
                }
            }
        }
    });
    return (
        <>
            <button onClick={() => addTime({seconds: 10})}>Add 10 seconds</button>
            <button onClick={() => subtractTime({seconds: 10})}>Subtract 10 seconds</button>
            <span>Time Left: {timer.timerText}</span>
        </>
    );
}
```
Note: none of these control functions affect Unix timestamp timers.
***
  
  
## Customization
### timerText
There are two optional properties on **useTimer**'s options object that affect the timer/stopwatch's timerText string output.
| Property | Type | Purpose | Default |
| ---- | ---- | ---- | ---- |
| textOutputWithWords | boolean | Whether the timerText string is only numbers, e.g. "00:01:45", or numbers with words, e.g. "1 minute, 45 seconds" | false, only numbers |
| includeMilliseconds | boolean | Whether milliseconds are included on the timerText string | false |

### Callbacks
There are several optional callbacks you can provide to the timer to fire at various points in time: an **onTick** callback that fires every interval, an **onFinish** callback that fires when the timer completes, and there are also arrays of callbacks you can provide for **onProgress** callbacks that fire at provided times into a timer and **onTimeLeft** callbacks that fire when there's a provided time left on the timer. **onTimeLeft** and **onFinish** callbacks will never fire on Stopwatches.
#### Example
```jsx
const SomeReactComponent = () => {
    const timer = useTimer({
        create: {
            timerWithDuration: {
                time: { // Set a duration of 1 minute and 30 seconds
                    minutes: 1,
                    seconds: 30
                }
            }
        },
        callbacks: {
            onTick: () => console.log('This runs every interval.'),
            onFinish: () => alert('The timer is done.'),
            onProgress: [
                {
                    time: { seconds: 10 },
                    callback: () => console.log('This is firing 10 seconds into the timer.')
                },
                {
                    time: { seconds: 20 },
                    callback: () => console.log('This is firing 20 seconds into the timer.')
                }
            ],
            onTimeLeft: [
                {
                    time: { seconds: 5 },
                    callback: () => console.log('This is firing when there is 5 seconds left on the timer.')
                },
                {
                    time: { seconds: 3 },
                    callback: () => console.log('This is firing when there is 3 seconds left on the timer.')
                },
            ]

        }
    });
    return (
        <span>Time Left: {timer.timerText}</span>
    );
}
```

***

## Misc Options
The rest of the optional customization properties you can include with the **useTimer** `options` object parameter:
| Property | Type | Purpose | Default |
| ------- | ------- | ------- | ------- |
| `autoplay`  | boolean | Whether the timer starts right away. Has no effect on UnixTimestamps, which is always true. | true |
| `includeMilliseconds`  | boolean | Includes milliseconds in timerText string | false |
| `intervalRate` | number | How many milliseconds between each interval tick. | 1000 |
| `textOutputWithWords`  | boolean | If false timerText output is only numbers "01:20:10", or if true it includes words "1 hour, 20 minutes, 10 seconds" | false |

***

## Timer Properties

Everything on the timer object returned from useTimer

| Property | Type | Purpose |
| ------- | ------- | ------- |
| `timerText`  | string | The string representation of the timer/stopwatch, i.e., "00:01:30" or "1 minute, 30 seconds" depending on your settings |
| `timerDisplayStrings`  | object | An object version of `timerText`, i.e., { days: "00", hours: "00", minutes: "01", seconds: "30", milliseconds: "000" }. If you need the number values of these for any reason, it's easy to convert by going Number(timerDisplayStrings.minutes) |
| `timeElapsed`  | number | Elapsed time in milliseconds. Important: this number is updated every interval, not necessarily updated every millisecond (unless your intervalRate is set to 1) |
| `timerIsPaused`  | boolean | Indicates whether the timer/stopwatch is currently paused |
| `timerIsFinished`  | boolean | Indicates whether the timer has reached its end |
| `pastFinish`  | boolean | Only relevant to Unix timers: indicates whether the timer has gone past its end |
| `pauseTimer`  | function | Pauses timer/stopwatch when called |
| `resumeTimer`  | function | Resumes timer/stopwatch when called |
| `togglePause`  | function | When called it unpauses if timer/stopwatch is paused, pauses if timer/stopwatch is unpaused |
| `resetTimer`  | function | Resets a timer/stopwatch to the beginning with originally supplied options, or with adjusted options, or with replaced options |
| `addTime`  | function | Adds time to timer/stopwatch |
| `subtractTime`  | function | Subtracts time from timer/stopwatch |

## Common Parameters

| Property | Type | Purpose |
| ------- | ------- | ------- |
| `time`  | number or [time object](#terminology) | Any time you need to provide a representation of time in a `time` property in options, the property takes either a number of milliseconds or a [time object](#terminology), which is an object with keys of units of time (`milliseconds`, `seconds`, `minutes`, `hours`, and `days`) and values of numbers. |

***

## Terminology
| Term | Definition |
| ---- | ---- |
| ``Time Object`` | An object that has keys of units of time (`milliseconds`, `seconds`, `minutes`, `hours`, and `days`) and values of numbers. Example: { hours: 2, minutes: 20, seconds: 40 } |

***

## Demo
[Demo app to play around with some functionality](https://codesandbox.io/s/dreamy-khorana-c3sr8o)

***

## License
Licensed under the MIT license