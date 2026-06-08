import { SummaryFormatter } from '@cucumber/cucumber';
import { IFormatterOptions } from '@cucumber/cucumber/lib/formatter';
import * as messages from '@cucumber/messages';
export default class ProfileJsonlFormatter extends SummaryFormatter {
    constructor(options: IFormatterOptions);
    logTestCaseFinished(testCaseFinished: messages.TestStepFinished): void;
}
