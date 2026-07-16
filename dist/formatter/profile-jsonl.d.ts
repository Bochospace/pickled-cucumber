import { SummaryFormatter } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import { FormatterOptions } from './progress-and-profile.js';
export default class ProfileJsonlFormatter extends SummaryFormatter {
    constructor(options: FormatterOptions);
    logTestCaseFinished(testCaseFinished: messages.TestStepFinished): void;
}
