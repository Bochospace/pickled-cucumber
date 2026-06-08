"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const durations_1 = require("../durations");
// ts-unused-exports:disable-next-line
class ProfileJsonlFormatter extends cucumber_1.SummaryFormatter {
    constructor(options) {
        super(options);
        options.eventBroadcaster.on('envelope', ({ testCaseFinished }) => {
            if (testCaseFinished) {
                this.logTestCaseFinished(testCaseFinished);
            }
        });
    }
    logTestCaseFinished(testCaseFinished) {
        var _a, _b, _c;
        const testCaseAttempt = this.eventDataCollector.getTestCaseAttempt(testCaseFinished.testCaseStartedId);
        const { gherkinDocument, worstTestStepResult: { status }, willBeRetried, } = testCaseAttempt;
        const parsed = cucumber_1.formatterHelpers.parseTestCaseAttempt({
            snippetBuilder: this.snippetBuilder,
            supportCodeLibrary: this.supportCodeLibrary,
            testCaseAttempt,
        });
        const { uri: filename, line } = (_a = parsed.testCase.sourceLocation) !== null && _a !== void 0 ? _a : {
            uri: '<unknown>',
            line: -1,
        };
        const feature = (_c = (_b = gherkinDocument.feature) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : '<Empty>';
        const scenario = parsed.testCase.name;
        const durationMs = (0, durations_1.scenarioDurationMs)(parsed);
        this.log(JSON.stringify({
            status: cucumber_1.Status[status],
            durationMs,
            filename,
            scenario,
            line,
            feature,
            willBeRetried,
        }));
    }
}
exports.default = ProfileJsonlFormatter;
//# sourceMappingURL=profile-jsonl.js.map