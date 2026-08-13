Feature: compare JSON includes X

Scenario: { "a": 1 } includes {}
  Given A is { "a": 1 }
  When asserting that A includes {}
  Then the assertion passes

Scenario: { "a": 1 } includes { "a": 1 }
  Given A is { "a": 1 }
  When asserting that A includes { "a": 1 }
  Then the assertion passes

Scenario: { "a": 1, "b": 1 } includes { "a": 1 }
  Given A is { "a": 1, "b": 1 }
  When asserting that A includes { "a": 1 }
  Then the assertion passes

Scenario: { "a": 1 } includes { "a": 2 }
  Given A is { "a": 1 }
  When asserting that A includes { "a": 2 }
  Then the assertion fails with {"a":1} does not include {"a":2}
  And the sub error is: got 1 instead of 2 at "a"

Scenario: [1, 2] includes 1
  Given A is [1, 2]
  When asserting that A includes 1
  Then the assertion passes

Scenario: [{ "a": 1 }] includes { "a": 2 }
  Given A is [{ "a": 1 }]
  When asserting that A includes { "a": 2 }
  Then the assertion fails with [{"a":1}] does not include {"a":2}

Scenario: [{ "a": 1 }, { "a": 2 }] includes { "a": 2 }
  Given A is [{ "a": 1 }, { "a": 2 }]
  When asserting that A includes { "a": 2 }
  Then the assertion passes

Scenario: { "members": [] } includes { "members": ["a"] }
  Given A is { "members": [] }
  When asserting that A includes { "members": ["a"] }
  Then the assertion fails with {"members":[]} does not include {"members":["a"]}
  And the sub error is: got [] instead of ["a"] at "members"

Scenario: { "a": { "b": 1, "c": 1 } } includes { "a": { "b": 1 } }
  Given A is { "a": { "b": 1, "c": 1 } }
  When asserting that A includes { "a": { "b": 1 } }
  Then the assertion passes

Scenario: {} includes { "a": null }
  Given A is {}
  When asserting that A includes { "a": null }
  Then the assertion passes

Scenario: [] includes { "a": 1 }
  Given A is []
  When asserting that A includes { "a": 1 }
  Then the assertion fails with [] does not include {"a":1}

Scenario: { "p": {}, "s": "running" } includes { "p": null }
  Given A is { "p": {}, "s": "running" }
  When asserting that A includes { "p": null }
  Then the assertion fails with {"p":{},"s":"running"} does not include {"p":null}
  And the sub error is: got {} instead of null at "p"

Scenario: { "x": { "k": 1 } } includes { "x": null }
  Given A is { "x": { "k": 1 } }
  When asserting that A includes { "x": null }
  Then the assertion fails with {"x":{"k":1}} does not include {"x":null}
  And the sub error is: got {"k":1} instead of null at "x"

Scenario: a Date nested in null
  Given A holds under p the date 2026-01-01T00:00:00Z
  When asserting that A includes { "p": null }
  Then the assertion fails with {"p":"2026-01-01T00:00:00.000Z"} does not include {"p":null}

Scenario: no item of an array satisfies both a null and a sibling key
  Given A is [{ "p": {}, "s": "running" }, { "p": null, "s": "idle" }]
  When asserting that A includes { "p": null, "s": "running" }
  Then the assertion fails with [{"p":{},"s":"running"},{"p":null,"s":"idle"}] does not include {"p":null,"s":"running"}

Scenario: some item of an array has the expected null
  Given A is [{ "x": { "a": 1 } }, { "x": null }]
  When asserting that A includes { "x": null }
  Then the assertion passes

Scenario: null includes { "a": 1 }
  Given A is null
  When asserting that A includes { "a": 1 }
  Then the assertion fails with null does not include {"a":1}

Scenario: [[null]] includes [null]
  Given A is [[null]]
  When asserting that A includes [null]
  Then the assertion passes
