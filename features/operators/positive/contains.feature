Feature: compare JSON contains X

Scenario: "a1c" contains 1
  Given A is "a1c"
  When asserting that A contains 1
  Then the assertion passes

Scenario: "abc" contains 1
  Given A is "abc"
  When asserting that A contains 1
  Then the assertion fails with "abc" does not contain "1"

Scenario: an object contains its own serialization
  Given A is { "a": 1 }
  When asserting that A contains { "a": 1 }
  Then the assertion passes

Scenario: an object does not contain a different object
  Given A is { "a": 1 }
  When asserting that A contains { "a": 2 }
  Then the assertion fails with {"a":1} does not contain "{\"a\":2}"

Scenario: an array contains its own serialization
  Given A is [1, 2]
  When asserting that A contains [1, 2]
  Then the assertion passes

Scenario: an array does not contain an array it merely overlaps
  Given A is [1, 2]
  When asserting that A contains [2, 3]
  Then the assertion fails with [1,2] does not contain "[2,3]"

Scenario: null contains null
  Given A is null
  When asserting that A contains null
  Then the assertion passes

Scenario: a string does not contain the text of an expected null
  Given A is "xnullx"
  When asserting that A contains null
  Then the assertion fails with "xnullx" does not contain "\"\""
