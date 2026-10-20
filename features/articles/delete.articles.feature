Feature: As the author of the blog I want to delete articles through the API

  Scenario: As the author I delete an article and it can no longer be read
    Given I use seed data
    And I use admin token
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003"
    Then the response status should be 204
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003"
    Then the response status should be 404
    And the response message should say the article was not found

  Scenario: As the author I receive not found when deleting an article that does not exist
    Given I use seed data
    And I use admin token
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000099"
    Then the response status should be 404
    And the response message should say the article was not found

  Scenario: As the author I receive bad request when deleting an article with an invalid ID
    Given I use admin token
    When I send a "DELETE" request to "/api/v1/articles/not-a-uuid"
    Then the response status should be 400

  Scenario: As a stranger without a token I cannot delete an article
    Given I use seed data
    And I use no token
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003"
    Then the response status should be 401
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003"
    Then the response status should be 200

  Scenario: As a stranger with a wrong token I cannot delete an article
    Given I use seed data
    And I use a wrong token
    When I send a "DELETE" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003"
    Then the response status should be 403
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003"
    Then the response status should be 200

  Scenario: As a stranger without a token I cannot discover deletion validation rules
    Given I use no token
    When I send a "DELETE" request to "/api/v1/articles/not-a-uuid"
    Then the response status should be 401
