Feature: As a visitor, I can browse blog articles

  Scenario: As a visitor, I see every article newest first
    Given I use seed data
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the articles should be ordered newest first

  Scenario: As a visitor, I see a stable order for equally dated articles
    Given two articles share a publication timestamp
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the articles should have a deterministic order

  Scenario: As a visitor, I see an empty list when no articles exist
    Given there are no articles
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200
    And the response should contain an empty list

  Scenario: As a visitor, I can safely repeat the seed operation
    Given I use seed data
    When I run the seed again
    Then the database should contain exactly 3 articles
