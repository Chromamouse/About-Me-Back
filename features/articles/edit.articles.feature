Feature: As the author of the blog I want to edit articles through the API

  Scenario: As the author I update an article title while preserving its other fields
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "title": "Updated Prisma article"
      }
      """
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "5e1f0a2b-0001-4000-8000-000000000003",
        "title": "Updated Prisma article",
        "text": "An introduction to database models, migrations, and queries.",
        "publishedAt": "2026-03-20T10:00:00.000Z"
      }
      """

  Scenario: As the author I update an article text while preserving its other fields
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "text": "The updated article text."
      }
      """
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "5e1f0a2b-0001-4000-8000-000000000003",
        "title": "Learning Prisma",
        "text": "The updated article text.",
        "publishedAt": "2026-03-20T10:00:00.000Z"
      }
      """

  Scenario: As the author I update both editable fields
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "title": "Updated title",
        "text": "Updated text."
      }
      """
    Then the response status should be 200
    And the response body should contain:
      """
      {
        "id": "5e1f0a2b-0001-4000-8000-000000000003",
        "title": "Updated title",
        "text": "Updated text.",
        "publishedAt": "2026-03-20T10:00:00.000Z"
      }
      """

  Scenario: As the author I cannot update an article with a title that is too short
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "title": "ab"
      }
      """
    Then the response status should be 400
    And the response body should contain:
      """
      {
        "statusCode": 400,
        "message": "Request validation failed.",
        "error": "Bad Request",
        "violations": {
          "title": ["title must be longer than or equal to 3 characters"]
        }
      }
      """

  Scenario: As the author I cannot update an article with a title that is too long
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "title": "@characters(121)"
      }
      """
    Then the response status should be 400
    And the response body should contain:
      """
      {
        "statusCode": 400,
        "message": "Request validation failed.",
        "error": "Bad Request",
        "violations": {
          "title": ["title must be shorter than or equal to 120 characters"]
        }
      }
      """

  Scenario: As the author I cannot update an article with empty text
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "text": ""
      }
      """
    Then the response status should be 400
    And the response body should contain:
      """
      {
        "statusCode": 400,
        "message": "Request validation failed.",
        "error": "Bad Request",
        "violations": {
          "text": ["text must be longer than or equal to 1 characters"]
        }
      }
      """

  Scenario: As the author I cannot update an article with text that is too long
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "text": "@characters(20001)"
      }
      """
    Then the response status should be 400
    And the response body should contain:
      """
      {
        "statusCode": 400,
        "message": "Request validation failed.",
        "error": "Bad Request",
        "violations": {
          "text": ["text must be shorter than or equal to 20000 characters"]
        }
      }
      """

  Scenario: As the author I cannot update an article with an empty body
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {}
      """
    Then the response status should be 400

  Scenario: As the author I cannot change an article ID
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "id": "5e1f0a2b-0001-4000-8000-000000000099"
      }
      """
    Then the response status should be 400

  Scenario: As the author I cannot change an article publication date
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "publishedAt": "2020-01-01T00:00:00.000Z"
      }
      """
    Then the response status should be 400

  Scenario: As the author I cannot update an article with an unknown field
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "author": "me"
      }
      """
    Then the response status should be 400

  Scenario: As the author I receive not found when updating an article that does not exist
    Given I use seed data
    And I use admin token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000099" with body:
      """
      {
        "title": "Updated title"
      }
      """
    Then the response status should be 404
    And the response message should say the article was not found

  Scenario: As the author I receive bad request when updating an article with an invalid ID
    Given I use admin token
    When I send a "PATCH" request to "/api/v1/articles/not-a-uuid" with body:
      """
      {
        "title": "Updated title"
      }
      """
    Then the response status should be 400

  Scenario: As a stranger without a token I cannot update an article
    Given I use seed data
    And I use no token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "title": "Updated title"
      }
      """
    Then the response status should be 401

  Scenario: As a stranger with a wrong token I cannot update an article
    Given I use seed data
    And I use a wrong token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "title": "Updated title"
      }
      """
    Then the response status should be 403

  Scenario: As a stranger without a token I cannot discover update validation rules
    Given I use no token
    When I send a "PATCH" request to "/api/v1/articles/5e1f0a2b-0001-4000-8000-000000000003" with body:
      """
      {
        "title": "ab"
      }
      """
    Then the response status should be 401
