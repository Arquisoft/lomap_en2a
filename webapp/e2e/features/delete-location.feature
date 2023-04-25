Feature: Delete a location

  Scenario: A user deletes a location
    Given The user logs in 
    And goes to the list of locations
    And selects a location
    When The user clicks the delete location button
    Then A confirmation of deletion message is shown in the screen