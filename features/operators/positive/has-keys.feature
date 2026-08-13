Feature: compare JSON has keys X

Scenario: {} has keys []
  Given A is {}
  When asserting that A has keys []
  Then the assertion passes

Scenario: { "a": 1 } has keys ["a"]
  Given A is { "a": 1 }
  When asserting that A has keys ["a"]
  Then the assertion passes

Scenario: { "a": 1, "b": 2 } has keys ["a"]
  Given A is { "a": 1, "b": 2 }
  When asserting that A has keys ["a"]
  Then the assertion passes

Scenario: { "a": 1, "b": 2 } has keys ["a", "b"]
  Given A is { "a": 1, "b": 2 }
  When asserting that A has keys ["a", "b"]
  Then the assertion passes

Scenario: { "a": 1 } has keys ["b"]
  Given A is { "a": 1 }
  When asserting that A has keys ["b"]
  Then the assertion fails with {"a":1} does not have key ["b"]

Scenario: { "a": 1 } has keys ["b", "c"]
  Given A is { "a": 1 }
  When asserting that A has keys ["b", "c"]
  Then the assertion fails with {"a":1} does not have keys ["b","c"]

Scenario: null has keys ["a"]
  Given A is null
  When asserting that A has keys ["a"]
  Then the assertion fails with null is not an object ["a"]

Scenario: a string has keys ["a"]
  Given A is "hello"
  When asserting that A has keys ["a"]
  Then the assertion fails with "hello" is not an object ["a"]

Scenario: { "a": 1 } has keys with a key list that is not an array
  Given A is { "a": 1 }
  When asserting that A has keys "a"
  Then the assertion fails with {"a":1} cannot be compared against a non-array key list "a"
