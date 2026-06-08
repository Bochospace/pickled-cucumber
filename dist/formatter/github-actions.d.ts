import { SummaryFormatter } from '@cucumber/cucumber';
import { IFormatterOptions } from '@cucumber/cucumber/lib/formatter';
import * as messages from '@cucumber/messages';
import { FirstArg } from './progress-and-profile';
export default class GithubFormatter extends SummaryFormatter {
    constructor(options: IFormatterOptions);
    logTestCaseFinished(testCaseFinished: messages.TestStepFinished): void;
    logIssues(args: FirstArg<SummaryFormatter['logIssues']>): void;
}
