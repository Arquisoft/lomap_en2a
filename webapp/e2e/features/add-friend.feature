Feature: Add a new friend

Scenario: A user adds a new friend
  Given The user logs in
  And goes to Add a friend
  When The user introduces a valid webId
  Then The friend is added