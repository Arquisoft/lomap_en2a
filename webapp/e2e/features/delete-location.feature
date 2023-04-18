Feature: Deleting a location

Scenario: The user is registered in the site
  Given A registered user
  When I go to a Location information and click on Delete button
  Then A confirmation message should be shown in the screen