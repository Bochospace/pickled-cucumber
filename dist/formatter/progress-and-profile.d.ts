import { SummaryFormatter } from '@cucumber/cucumber';
import { IFormatterOptions } from '@cucumber/cucumber/lib/formatter';
import * as messages from '@cucumber/messages';
export type FirstArg<T> = T extends (X: infer X) => void ? X : never;
/**
 * Formatter class
 *
 * Cucumber requires it to be the export default
 */
export default class ProgressAndProfileFormatter extends SummaryFormatter {
    constructor(options: IFormatterOptions);
    logTestCaseFinished(testCaseFinished: messages.TestStepFinished): void;
    private formatFeature;
    private formatStatus;
    private formatLocation;
    logIssues(args: FirstArg<SummaryFormatter['logIssues']>): void;
}
