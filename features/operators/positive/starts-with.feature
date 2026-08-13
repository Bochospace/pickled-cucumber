Feature: compare JSON starts with X

Scenario: "abc" starts with "a"
  Given A is "abc"
  When asserting that A starts with "a"
  Then the assertion passes

Scenario: "abc" starts with "X"
  Given A is "abc"
  When asserting that A starts with "X"
  Then the assertion fails with "abc" does not start with "X"

Scenario: an object starts with its own serialization
  Given A is { "a": 1 }
  When asserting that A starts with { "a": 1 }
  Then the assertion passes

Scenario: an object does not start with a different object
  Given A is { "a": 1 }
  When asserting that A starts with { "b": 1 }
  Then the assertion fails with {"a":1} does not start with "{\"b\":1}"

Scenario: an array starts with its own serialization
  Given A is [1, 2]
  When asserting that A starts with [1, 2]
  Then the assertion passes
