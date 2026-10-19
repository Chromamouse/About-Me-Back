Feature: As a visitor, I can read an individual blog article

  Scenario: As a visitor, I can read an existing article in full
    Given I use seed data
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003"
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "5e1f0a2b-0001-4000-8000-000000000003",
        "title": "Learning Prisma",
        "text": "An introduction to database models, migrations, and queries.",
        "publishedAt": "2026-03-20T10:00:00.000Z"
      }
      """

  Scenario: As a visitor, I receive a not-found response for an unknown article
    Given I use seed data
    When I send a "GET" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000099"
    Then the response status should be 404
    And the response message should say the article was not found

  Scenario: As a visitor, I receive a bad-request response for an invalid article ID
    When I send a "GET" request to "/api/v1/articles/not-a-uuid"
    Then the response status should be 400
