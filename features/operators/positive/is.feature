Feature: compare JSON is X

Scenario: 1 is 1
  Given A is 1
  When asserting that A is 1
  Then the assertion passes

Scenario: 1 is 2
  Given A is 1
  When asserting that A is 2
  Then the assertion fails with 1 is not 2

Scenario: array inside object
  Given A is ["first"]
  And B is { "arr": ["first"] }
  When asserting that A is ${B.arr}
  Then the assertion passes

Scenario: string inside array inside object
  Given A is "first"
  And B is { "arr": ["first"] }
  When asserting that A is "${B.arr.0}"
  Then the assertion passes

Scenario: null is null
  Given A is null
  When asserting that A is null
  Then the assertion passes

Scenario: {} is null
  Given A is {}
  When asserting that A is null
  Then the assertion fails with {} is not null

Scenario: null is {}
  Given A is null
  When asserting that A is {}
  Then the assertion fails with null is not {}

Scenario: a Date is null
  Given A holds the date 2026-01-01T00:00:00Z
  When asserting that A is null
  Then the assertion fails with "2026-01-01T00:00:00.000Z" is not null

Scenario: an empty object nested in null
  Given A is { "x": {} }
  When asserting that A is { "x": null }
  Then the assertion fails with {"x":{}} is not {"x":null}
  And the error path is "x"

Scenario: a populated object nested in null
  Given A is { "x": { "k": 1 } }
  When asserting that A is { "x": null }
  Then the assertion fails with {"x":{"k":1}} is not {"x":null}
  And the error path is "x"

Scenario: a Date nested in null
  Given A holds under x the date 2026-01-01T00:00:00Z
  When asserting that A is { "x": null }
  Then the assertion fails with {"x":"2026-01-01T00:00:00.000Z"} is not {"x":null}
  And the error path is "x"
