Feature: As the author of the blog I want to create articles through the API

  Scenario: As the author I create an article and see it in the list
    Given I use seed data
    And I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "My new article",
        "text": "The text of my new article."
      }
      """
    Then the response status should be 201
    And the response body should contain:
      """
      {
        "id": "@uuid",
        "title": "My new article",
        "text": "The text of my new article.",
        "publishedAt": "@date('within 1 minute from now')"
      }
      """
    When I send a "GET" request to "/api/v1/articles"
    Then the response status should be 200

  Scenario: As the author I create an article with the shortest valid fields
    Given I use seed data
    And I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "abc",
        "text": "x"
      }
      """
    Then the response status should be 201
    And the response body should contain:
      """
      {
        "id": "@uuid",
        "title": "abc",
        "text": "x",
        "publishedAt": "@date('within 1 minute from now')"
      }
      """

  Scenario: As the author I create an article with the longest valid fields
    Given I use seed data
    And I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "@characters(120)",
        "text": "@characters(20000)"
      }
      """
    Then the response status should be 201

  Scenario: As the author I receive validation violations for a title and text that are too short
    Given I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "ab",
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
          "title": ["title must be longer than or equal to 3 characters"],
          "text": ["text must be longer than or equal to 1 characters"]
        }
      }
      """

  Scenario: As the author I receive validation violations for a title and text that are too long
    Given I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "@characters(121)",
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
          "title": ["title must be shorter than or equal to 120 characters"],
          "text": ["text must be shorter than or equal to 20000 characters"]
        }
      }
      """

  Scenario: As the author I cannot choose the ID or publication date
    Given I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "id": "5e1f0a2b-0001-4000-8000-000000000010",
        "publishedAt": "2020-01-01T00:00:00.000Z",
        "title": "My new article",
        "text": "The text of my new article."
      }
      """
    Then the response status should be 400

  Scenario: As the author I cannot create an article with an unknown field
    Given I use admin token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "My new article",
        "text": "The text of my new article.",
        "author": "me"
      }
      """
    Then the response status should be 400

  Scenario: As a stranger without a token I cannot create an article
    Given I use no token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "My new article",
        "text": "The text of my new article."
      }
      """
    Then the response status should be 401

  Scenario: As a stranger with a wrong token I cannot create an article
    Given I use a wrong token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "My new article",
        "text": "The text of my new article."
      }
      """
    Then the response status should be 403

  Scenario: As a stranger without a token I cannot discover validation rules
    Given I use no token
    When I send a "POST" request to "/api/v1/articles" with body:
      """
      {
        "title": "ab"
      }
      """
    Then the response status should be 401
