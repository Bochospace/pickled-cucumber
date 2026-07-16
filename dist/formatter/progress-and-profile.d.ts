import { SummaryFormatter } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
export type FirstArg<T> = T extends (X: infer X) => void ? X : never;
export type FormatterOptions = ConstructorParameters<typeof SummaryFormatter>[0];
/**
 * Formatter class
 *
 * Cucumber requires it to be the export default
 */
export default class ProgressAndProfileFormatter extends SummaryFormatter {
    constructor(options: FormatterOptions);
    logTestCaseFinished(testCaseFinished: messages.TestStepFinished): void;
    private formatFeature;
    private formatStatus;
    private formatLocation;
    logIssues(args: FirstArg<InstanceType<typeof SummaryFormatter>['logIssues']>): void;
}
