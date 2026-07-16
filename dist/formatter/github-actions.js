import { SummaryFormatter, formatterHelpers } from '@cucumber/cucumber';
// ts-unused-exports:disable-next-line
export default class GithubFormatter extends SummaryFormatter {
    constructor(options) {
        super(options);
        options.eventBroadcaster.on('envelope', ({ testCaseFinished }) => {
            if (testCaseFinished) {
                this.logTestCaseFinished(testCaseFinished);
            }
        });
    }
    logTestCaseFinished(testCaseFinished) {
        const testCaseAttempt = this.eventDataCollector.getTestCaseAttempt(testCaseFinished.testCaseStartedId);
        const parsed = formatterHelpers.parseTestCaseAttempt({
            snippetBuilder: this.snippetBuilder,
            supportCodeLibrary: this.supportCodeLibrary,
            testCaseAttempt,
        });
        const color = this.colorFns.forStatus(parsed.testCase.worstTestStepResult.status);
        if (!testCaseAttempt.gherkinDocument.feature) {
            return;
        }
        const passed = parsed.testCase.worstTestStepResult.status === 'PASSED';
        const testCaseTitle = color(testCaseAttempt.gherkinDocument.feature.name +
            ' / ' +
            testCaseAttempt.pickle.name);
        // No need to log failures, they are in the summary
        if (passed) {
            this.log(`✅ ${testCaseTitle}\n`);
        }
    }
    logIssues(args) {
        if (process.env.PICKLED_NO_WARN &&
            args.title &&
            args.title.includes('Warning')) {
            return;
        }
        return super.logIssues(args);
    }
}
//# sourceMappingURL=github-actions.js.map