import { SummaryFormatter, formatterHelpers, Status } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import { humanizeDuration, scenarioDuration } from '../durations.js';

export type FirstArg<T> = T extends (X: infer X) => void ? X : never;

// Derived from the public `SummaryFormatter` constructor instead of reaching
// into `@cucumber/cucumber/lib/*`, whose `exports` map is CommonJS-only and so
// is unresolvable under ESM (NodeNext) module resolution.
export type FormatterOptions = ConstructorParameters<
  typeof SummaryFormatter
>[0];

interface ILineAndUri {
  line: number;
  uri: string;
}

/**
 * Formatter class
 *
 * Cucumber requires it to be the export default
 */
// ts-unused-exports:disable-next-line
export default class ProgressAndProfileFormatter extends SummaryFormatter {
  constructor(options: FormatterOptions) {
    super(options);
    options.eventBroadcaster.on('envelope', ({ testCaseFinished }) => {
      if (testCaseFinished) {
        this.logTestCaseFinished(testCaseFinished);
      }
    });
  }
  public logTestCaseFinished(
    testCaseFinished: messages.TestStepFinished,
  ): void {
    const testCaseAttempt = this.eventDataCollector.getTestCaseAttempt(
      testCaseFinished.testCaseStartedId,
    );
    const {
      gherkinDocument,
      pickle,
      worstTestStepResult: { status },
    } = testCaseAttempt;

    const parsed = formatterHelpers.parseTestCaseAttempt({
      snippetBuilder: this.snippetBuilder,
      supportCodeLibrary: this.supportCodeLibrary,
      testCaseAttempt,
    });
    const formattedLocation = this.formatLocation(
      parsed.testCase.sourceLocation,
    );
    const coloredStatus = this.formatStatus(status);

    const ruleId = pickle.astNodeIds[0];
    let ruleName = '';
    gherkinDocument.feature?.children.forEach(({ rule }) => {
      if (rule?.children?.some(({ scenario }) => scenario?.id === ruleId))
        ruleName = rule?.name;
    });
    const coloredFeature =
      gherkinDocument.feature &&
      this.formatFeature(gherkinDocument.feature, ruleName);

    const humaneDuration = humanizeDuration(scenarioDuration(parsed));

    this.log(
      `[${coloredStatus}] (${humaneDuration}) ${coloredFeature} ${pickle.name} # ${formattedLocation}\n`,
    );
  }

  private formatFeature(feature: messages.Feature, rule?: string) {
    if (rule) {
      return `${this.colorFns.tag(feature.name)} ${this.colorFns.location(
        '>',
      )} ${this.colorFns.tag(rule)} ${this.colorFns.location('>')}`;
    } else if (feature.name) {
      return `${this.colorFns.tag(feature.name)} ${this.colorFns.location(
        '>',
      )}`;
    }
    return '<Empty>';
  }

  private formatStatus(status: messages.TestStepResultStatus): string {
    return this.colorFns.forStatus(status)(Status[status]);
  }

  private formatLocation(sourceLocation?: ILineAndUri): string {
    if (!sourceLocation) {
      return '';
    }
    const { line, uri } = sourceLocation;
    return this.colorFns.location(`${uri}:${line}`);
  }

  logIssues(
    args: FirstArg<InstanceType<typeof SummaryFormatter>['logIssues']>,
  ): void {
    if (
      process.env.PICKLED_NO_WARN &&
      args.title &&
      args.title.includes('Warning')
    ) {
      return;
    }
    return super.logIssues(args);
  }
}
