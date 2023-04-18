Feature: Delete a location

  Scenario: A user logs into the site
    Given The user goes to the Add Location form
    And fills the form with data
    When The user clicks the Add location button
    Then The location is added