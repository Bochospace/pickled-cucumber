Feature: compare JSON has keys X

Scenario: {} does not have keys []
  Given A is {}
  When asserting that A does not have keys []
  Then the assertion passes

Scenario: { "a": 1 } does not have keys ["b"]
  Given A is { "a": 1 }
  When asserting that A does not have keys ["b"]
  Then the assertion passes

Scenario: { "a": 1 } does not have keys ["b", "c"]
  Given A is { "a": 1 }
  When asserting that A does not have keys ["b", "c"]
  Then the assertion passes

Scenario: { "a": 1 } does not have keys ["a"]
  Given A is { "a": 1 }
  When asserting that A does not have keys ["a"]
  Then the assertion fails with {"a":1} has key ["a"]

Scenario: { "a": 1, "b": 2 } does not have keys ["a"]
  Given A is { "a": 1, "b": 2 }
  When asserting that A does not have keys ["a"]
  Then the assertion fails with {"a":1,"b":2} has key ["a"]

Scenario: { "a": 1, "b": 2 } does not have keys ["a", "b"]
  Given A is { "a": 1, "b": 2 }
  When asserting that A does not have keys ["a", "b"]
  Then the assertion fails with {"a":1,"b":2} has keys ["a","b"]

Scenario: null does not have keys ["a"]
  Given A is null
  When asserting that A does not have keys ["a"]
  Then the assertion fails with null is not an object ["a"]

Scenario: a string does not have keys ["a"]
  Given A is "hello"
  When asserting that A does not have keys ["a"]
  Then the assertion fails with "hello" is not an object ["a"]

Scenario: a number does not have keys ["a"]
  Given A is 42
  When asserting that A does not have keys ["a"]
  Then the assertion fails with 42 is not an object ["a"]

Scenario: { "a": 1 } does not have keys with a key list that is not an array
  Given A is { "a": 1 }
  When asserting that A does not have keys "a"
  Then the assertion fails with {"a":1} cannot be compared against a non-array key list "a"
