Feature: compare JSON contains X

Scenario: "a1c" does not contain b
  Given A is "a1c"
  When asserting that A does not contain "b"
  Then the assertion passes

Scenario: "abc" does not contain b
  Given A is "abc"
  When asserting that A does not contain "b"
  Then the assertion fails with "abc" contains "b"

Scenario: an object does not contain a different object
  Given A is { "a": 1 }
  When asserting that A does not contain { "a": 2 }
  Then the assertion passes

Scenario: an object contains its own serialization
  Given A is { "a": 1 }
  When asserting that A does not contain { "a": 1 }
  Then the assertion fails with {"a":1} contains "{\"a\":1}"
