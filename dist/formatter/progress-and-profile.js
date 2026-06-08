"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const durations_1 = require("../durations");
/**
 * Formatter class
 *
 * Cucumber requires it to be the export default
 */
// ts-unused-exports:disable-next-line
class ProgressAndProfileFormatter extends cucumber_1.SummaryFormatter {
    constructor(options) {
        super(options);
        options.eventBroadcaster.on('envelope', ({ testCaseFinished }) => {
            if (testCaseFinished) {
                this.logTestCaseFinished(testCaseFinished);
            }
        });
    }
    logTestCaseFinished(testCaseFinished) {
        var _a;
        const testCaseAttempt = this.eventDataCollector.getTestCaseAttempt(testCaseFinished.testCaseStartedId);
        const { gherkinDocument, pickle, worstTestStepResult: { status }, } = testCaseAttempt;
        const parsed = cucumber_1.formatterHelpers.parseTestCaseAttempt({
            snippetBuilder: this.snippetBuilder,
            supportCodeLibrary: this.supportCodeLibrary,
            testCaseAttempt,
        });
        const formattedLocation = this.formatLocation(parsed.testCase.sourceLocation);
        const coloredStatus = this.formatStatus(status);
        const ruleId = pickle.astNodeIds[0];
        let ruleName = '';
        (_a = gherkinDocument.feature) === null || _a === void 0 ? void 0 : _a.children.forEach(({ rule }) => {
            var _a;
            if ((_a = rule === null || rule === void 0 ? void 0 : rule.children) === null || _a === void 0 ? void 0 : _a.some(({ scenario }) => (scenario === null || scenario === void 0 ? void 0 : scenario.id) === ruleId))
                ruleName = rule === null || rule === void 0 ? void 0 : rule.name;
        });
        const coloredFeature = gherkinDocument.feature &&
            this.formatFeature(gherkinDocument.feature, ruleName);
        const humaneDuration = (0, durations_1.humanizeDuration)((0, durations_1.scenarioDuration)(parsed));
        this.log(`[${coloredStatus}] (${humaneDuration}) ${coloredFeature} ${pickle.name} # ${formattedLocation}\n`);
    }
    formatFeature(feature, rule) {
        if (rule) {
            return `${this.colorFns.tag(feature.name)} ${this.colorFns.location('>')} ${this.colorFns.tag(rule)} ${this.colorFns.location('>')}`;
        }
        else if (feature.name) {
            return `${this.colorFns.tag(feature.name)} ${this.colorFns.location('>')}`;
        }
        return '<Empty>';
    }
    formatStatus(status) {
        return this.colorFns.forStatus(status)(cucumber_1.Status[status]);
    }
    formatLocation(sourceLocation) {
        if (!sourceLocation) {
            return '';
        }
        const { line, uri } = sourceLocation;
        return this.colorFns.location(`${uri}:${line}`);
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
exports.default = ProgressAndProfileFormatter;
//# sourceMappingURL=progress-and-profile.js.map