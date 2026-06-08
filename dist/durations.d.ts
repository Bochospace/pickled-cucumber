import { IParsedTestCaseAttempt } from '@cucumber/cucumber/lib/formatter/helpers/test_case_attempt_parser';
interface Duration {
    seconds: number;
    nanos: number;
}
/**
 *  Formats a duration to a humane representation inside the order of magnitude
 *
 *  The optional parameter precision defines how many significan digits are shown
 */
export declare const humanizeDuration: ({ seconds, nanos }: Duration, precision?: number) => string;
/**
 * Compute the full duration of an scenario by adding the duration of each step
 */
export declare const scenarioDuration: (parsed: IParsedTestCaseAttempt) => Duration;
/**
 * Compute the whole scenario duration
 */
export declare const scenarioDurationMs: (parsed: IParsedTestCaseAttempt) => number;
export {};
