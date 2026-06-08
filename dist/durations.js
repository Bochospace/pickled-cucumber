"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scenarioDurationMs = exports.scenarioDuration = exports.humanizeDuration = void 0;
/**
 *  Formats a duration to a humane representation inside the order of magnitude
 *
 *  The optional parameter precision defines how many significan digits are shown
 */
const humanizeDuration = ({ seconds, nanos }, precision = 3) => {
    const interval = nanos + seconds * 1e9;
    if (interval < 1e3) {
        return `${interval.toPrecision(precision)} ns`;
    }
    if (interval < 1e6) {
        return `${(interval / 1e3).toPrecision(precision)} µs`;
    }
    if (interval < 1e9) {
        return `${(interval / 1e6).toPrecision(precision)} ms`;
    }
    return `${(interval / 1e9).toPrecision(precision)} s`;
};
exports.humanizeDuration = humanizeDuration;
/**
 * Adds to durations
 *
 * This didn't take into account if the number of nanos already adds to some number of seconds. That behavior is not required for the current application
 */
const addDurations = (a, b) => ({
    nanos: a.nanos + b.nanos,
    seconds: a.seconds + b.seconds,
});
/**
 * Compute the full duration of an scenario by adding the duration of each step
 */
const scenarioDuration = (parsed) => parsed.testSteps
    .map(({ result }) => result.duration)
    .reduce(addDurations, { nanos: 0, seconds: 0 });
exports.scenarioDuration = scenarioDuration;
/**
 * Compute the whole scenario duration
 */
const scenarioDurationMs = (parsed) => parsed.testSteps
    .map(({ result: { duration: { nanos, seconds }, }, }) => (nanos + seconds * 1e9) / 1e6)
    .reduce((a, b) => a + b, 0);
exports.scenarioDurationMs = scenarioDurationMs;
//# sourceMappingURL=durations.js.map