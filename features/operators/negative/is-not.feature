Feature: compare JSON is X

Scenario: 1 is not 2
  Given A is 1
  When asserting that A isn't 2
  Then the assertion passes

Scenario: 1 is not 1
  Given A is 1
  When asserting that A isn't 1
  Then the assertion fails with 1 is 1

Scenario: array inside object
  Given A is ["first"]
  And B is { "arr": ["first", "second"] }
  When asserting that A isn't ${B.arr}
  Then the assertion passes

Scenario: array inside object that fails
  Given A is ["first"]
  And B is { "arr": ["first"] }
  When asserting that A isn't ${B.arr}
  Then the assertion fails with ["first"] is ["first"]

Scenario: string inside array inside object
  Given A is "first"
  And B is { "arr": ["second"] }
  When asserting that A isn't "${B.arr.0}"
  Then the assertion passes

Scenario: string inside array inside object that fails
  Given A is "first"
  And B is { "arr": ["first"] }
  When asserting that A isn't "${B.arr.0}"
  Then the assertion fails with "first" is "first"

Scenario: {} is not null
  Given A is {}
  When asserting that A isn't null
  Then the assertion passes

Scenario: a Date nested in null is not null
  Given A holds under x the date 2026-01-01T00:00:00Z
  When asserting that A isn't { "x": null }
  Then the assertion passes
