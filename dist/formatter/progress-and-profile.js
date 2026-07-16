import { SummaryFormatter, formatterHelpers, Status } from '@cucumber/cucumber';
import { humanizeDuration, scenarioDuration } from '../durations.js';
/**
 * Formatter class
 *
 * Cucumber requires it to be the export default
 */
// ts-unused-exports:disable-next-line
export default class ProgressAndProfileFormatter extends SummaryFormatter {
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
        const { gherkinDocument, pickle, worstTestStepResult: { status }, } = testCaseAttempt;
        const parsed = formatterHelpers.parseTestCaseAttempt({
            snippetBuilder: this.snippetBuilder,
            supportCodeLibrary: this.supportCodeLibrary,
            testCaseAttempt,
        });
        const formattedLocation = this.formatLocation(parsed.testCase.sourceLocation);
        const coloredStatus = this.formatStatus(status);
        const ruleId = pickle.astNodeIds[0];
        let ruleName = '';
        gherkinDocument.feature?.children.forEach(({ rule }) => {
            if (rule?.children?.some(({ scenario }) => scenario?.id === ruleId))
                ruleName = rule?.name;
        });
        const coloredFeature = gherkinDocument.feature &&
            this.formatFeature(gherkinDocument.feature, ruleName);
        const humaneDuration = humanizeDuration(scenarioDuration(parsed));
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
        return this.colorFns.forStatus(status)(Status[status]);
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
//# sourceMappingURL=progress-and-profile.js.map