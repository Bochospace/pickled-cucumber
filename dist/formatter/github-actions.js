"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
// ts-unused-exports:disable-next-line
class GithubFormatter extends cucumber_1.SummaryFormatter {
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
        const parsed = cucumber_1.formatterHelpers.parseTestCaseAttempt({
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
exports.default = GithubFormatter;
//# sourceMappingURL=github-actions.js.map