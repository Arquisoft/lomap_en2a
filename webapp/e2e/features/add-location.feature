 Feature: Adding a new location

Scenario: The user is registered in the site
  Given A registered user goes to the Add Location form
  When I fill the data in the form and press submit
  Then A confirmation message should be shown in the screen