import { SummaryFormatter } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import { FirstArg, FormatterOptions } from './progress-and-profile.js';
export default class GithubFormatter extends SummaryFormatter {
    constructor(options: FormatterOptions);
    logTestCaseFinished(testCaseFinished: messages.TestStepFinished): void;
    logIssues(args: FirstArg<InstanceType<typeof SummaryFormatter>['logIssues']>): void;
}
