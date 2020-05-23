define({ "api": [
  {
    "type": "get",
    "url": "/auth/check",
    "title": "Check if a Token is valid",
    "description": "<p>Check if a Token is valid</p>",
    "name": "/auth/check",
    "group": "Auth",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Authorization Token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\"\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/google",
    "title": "Google authenticate user",
    "description": "<p>Authenticate user through google</p>",
    "name": "/auth/google",
    "group": "Auth",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "content-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Google Token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"token\": \"eyJhbGciOiJIUzI1NiIsInR5...\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Authorization Token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": {\n    \"token\": \"eyJhbGciOiJIU...\",\n    \"user\": {\n      \"email\": \"email@email.com\",\n      \"firstName\": \"First Name\",\n      \"lastName\": \"Last Name\",\n      \"photoUrl\": \"Profile Photo URL\",\n      \"dateOfBirth\": \"2014-01-01T23:28:56.782Z\",\n      \"type\": 1\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"id\": 422,\n    \"errors\": [\n      \"Google Token is required.\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\"\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/local",
    "title": "Authenticate user",
    "description": "<p>Authenticate user through received email (username) and password</p>",
    "name": "/auth/local",
    "group": "Auth",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "content-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"email\": \"email@email.com\",\n \"password\": \"1234567890\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Authorization Token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": {\n    \"token\": \"eyJhbGciOiJIU...\",\n    \"user\": {\n      \"email\": \"email@email.com\",\n      \"firstName\": \"First Name\",\n      \"lastName\": \"Last Name\",\n      \"photoUrl\": \"Profile Photo URL\",\n      \"dateOfBirth\": \"2014-01-01T23:28:56.782Z\",\n      \"type\": 0\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"E-mail already in use\",\n      \"Password requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\"\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/auth.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/circle/byUser",
    "title": "List of Circles by User",
    "description": "<p>Return the list of all Circles that the user belongs (invited or owner)</p>",
    "name": "/circle/byUser",
    "group": "Circle",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "circles",
            "description": "<p>List of Circles</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": {\n    \"circles\": [\n      {\n        \"id\": 1,\n        \"name\": \"Circle 1\",\n        \"isOwner\": 1,\n        \"isAdmin\": 1,\n        \"joinedAt\": \"2020-05-07T17:20:15.000Z\"\n      },\n      {\n        \"id\": 2,\n        \"name\": \"Circle 2\",\n        \"isOwner\": 0,\n        \"isAdmin\": 1,\n        \"joinedAt\": null\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "NOT_FOUND",
            "description": "<p>The requested resource could not be found but may be available in the future.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 404 Not Found\n{\n  \"status\": {\n    \"id\": 404,\n    \"errors\": [\n      \"Not Found\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"The name must have a minimum of 3 characters and a maximum of 56 characters\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/circle.js",
    "groupTitle": "Circle"
  },
  {
    "type": "get",
    "url": "/circle/confirmUserAsMember",
    "title": "Confirm user as a member",
    "description": "<p>Confirm user as a member of a circle</p>",
    "name": "/circle/confirmUserAsMember",
    "group": "Circle",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle id to confirm user as a member</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>There is no return</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "NOT_FOUND",
            "description": "<p>The requested resource could not be found but may be available in the future.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 404 Not Found\n{\n  \"status\": {\n    \"id\": 404,\n    \"errors\": [\n      \"Not Found\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"The name must have a minimum of 3 characters and a maximum of 56 characters\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/circle.js",
    "groupTitle": "Circle"
  },
  {
    "type": "post",
    "url": "/circle/create",
    "title": "Create a new User Circle",
    "description": "<p>Allow an authenticated user to create a new Circle providing a name</p>",
    "name": "/circle/create",
    "group": "Circle",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "Name",
            "description": "<p>Name of the Circle</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"name\": \"Soccer team\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "Id",
            "description": "<p>The Circle id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n },\n \"data\": {\n   \"id\": 1\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"The name must have a minimum of 3 characters and a maximum of 56 characters\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/circle.js",
    "groupTitle": "Circle"
  },
  {
    "type": "get",
    "url": "/circle/getCircleTypesAndPluginSuggestions",
    "title": "Circle Type and Plugin",
    "description": "<p>List of active Plugins and Type of groups (and each plugins suggestion for this group)</p>",
    "name": "/circle/getCircleTypesAndPluginSuggestions",
    "group": "Circle",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "List",
            "description": "<p>of active Plugins and Type of groups (and each plugins suggestion for this group)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": {\n    \"plugins\": [\n      {\n        \"id\": 1,\n        \"name\": \"Calendar\",\n        \"price\": 0\n      },\n      {\n        \"id\": 2,\n        \"name\": \"To-do List\",\n        \"price\": 0\n      },\n    ],\n    \"circleType\": [\n      {\n        \"id\": 1,\n        \"name\": \"Family\",\n        \"plugins\": [\n          1,\n          3,\n          4,\n          6\n        ]\n      },\n      {\n        \"id\": 2,\n        \"name\": \"Homestay\",\n        \"plugins\": [\n          1,\n          2,\n          3,\n          5,\n          6,\n          7\n        ]\n      },\n      {\n        \"id\": 3,\n        \"name\": \"Small business\",\n        \"plugins\": [\n          1,\n          2,\n          5,\n          6\n        ]\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "NOT_FOUND",
            "description": "<p>The requested resource could not be found but may be available in the future.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 404 Not Found\n{\n  \"status\": {\n    \"id\": 404,\n    \"errors\": [\n      \"Not Found\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/circle.js",
    "groupTitle": "Circle"
  },
  {
    "type": "get",
    "url": "/circle/inviteUser",
    "title": "Invite an email to join a Circle",
    "description": "<p>Invite an email to join a Circle</p>",
    "name": "/circle/inviteUser",
    "group": "Circle",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>Email to use to invite</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"email\": \"email@email.com\"\n \"circleId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>There is no return</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "NOT_FOUND",
            "description": "<p>The requested resource could not be found but may be available in the future.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 404 Not Found\n{\n  \"status\": {\n    \"id\": 404,\n    \"errors\": [\n      \"Not Found\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"The name must have a minimum of 3 characters and a maximum of 56 characters\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/circle.js",
    "groupTitle": "Circle"
  },
  {
    "type": "get",
    "url": "/circle/removeUserAsMember",
    "title": "Remove a user as member",
    "description": "<p>Remove a user as member of a circle</p>",
    "name": "/circle/removeUserAsMember",
    "group": "Circle",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle id to remove user as a member</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>There is no return</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "NOT_FOUND",
            "description": "<p>The requested resource could not be found but may be available in the future.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 404 Not Found\n{\n  \"status\": {\n    \"id\": 404,\n    \"errors\": [\n      \"Not Found\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"The name must have a minimum of 3 characters and a maximum of 56 characters\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/circle.js",
    "groupTitle": "Circle"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./doc/main.js",
    "group": "D:\\Projects\\bivt-backend\\doc\\main.js",
    "groupTitle": "D:\\Projects\\bivt-backend\\doc\\main.js",
    "name": ""
  },
  {
    "type": "post",
    "url": "/plugin/addPluginFromCircle",
    "title": "Add a Plugin to a Circle",
    "description": "<p>Add a Plugin to a Circle</p>",
    "name": "/plugin/addPluginFromCircle",
    "group": "Plugin",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "id",
            "description": "<p>Plugin Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1,\n \"circleId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "There",
            "description": "<p>is no result</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "400",
            "optional": false,
            "field": "BAD_REQUEST",
            "description": "<p>The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "NOT_FOUND",
            "description": "<p>The requested resource could not be found but may be available in the future.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "409",
            "optional": false,
            "field": "CONFLICT",
            "description": "<p>Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": {\n    \"errors\": [\n      \"Bad Request\",\n    ],\n    \"id\": 400\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 404 Not Found\n{\n  \"status\": {\n    \"id\": 404,\n    \"errors\": [\n      \"Not Found\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 409 Conflict\n{\n  \"status\": {\n    \"id\": 409,\n    \"errors\": [\n      \"Conflict\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugin.js",
    "groupTitle": "Plugin"
  },
  {
    "type": "delete",
    "url": "/plugin/deletePluginFromCircle",
    "title": "Remove a Plugin From a Circle",
    "description": "<p>Remove a Plugin From a Circle</p>",
    "name": "/plugin/deletePluginFromCircle",
    "group": "Plugin",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "id",
            "description": "<p>Plugin Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1,\n \"circleId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "There",
            "description": "<p>is no result</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "400",
            "optional": false,
            "field": "BAD_REQUEST",
            "description": "<p>The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "NOT_FOUND",
            "description": "<p>The requested resource could not be found but may be available in the future.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "409",
            "optional": false,
            "field": "CONFLICT",
            "description": "<p>Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": {\n    \"errors\": [\n      \"Bad Request\",\n    ],\n    \"id\": 400\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 404 Not Found\n{\n  \"status\": {\n    \"id\": 404,\n    \"errors\": [\n      \"Not Found\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 409 Conflict\n{\n  \"status\": {\n    \"id\": 409,\n    \"errors\": [\n      \"Conflict\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugin.js",
    "groupTitle": "Plugin"
  },
  {
    "type": "get",
    "url": "/plugin/getAll",
    "title": "All active Plguins",
    "description": "<p>Get all active Plguins</p>",
    "name": "/plugin/getAll",
    "group": "Plugin",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "List",
            "description": "<p>of all active plugins</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": [\n    {\n      \"id\": 1,\n      \"name\": \"Calendar\",\n      \"price\": 0\n    },\n    {\n      \"id\": 2,\n      \"name\": \"To-do List\",\n      \"price\": 0\n    },\n    {\n      \"id\": 3,\n      \"name\": \"Shopping list\",\n      \"price\": 0\n    },\n    {\n      \"id\": 4,\n      \"name\": \"User Tracking\",\n      \"price\": 6.66\n    },\n    {\n      \"id\": 5,\n      \"name\": \"Poll\",\n      \"price\": 0\n    },\n    {\n      \"id\": 6,\n      \"name\": \"Group Chat\",\n      \"price\": 8.25\n    },\n    {\n      \"id\": 7,\n      \"name\": \"Expenses\",\n      \"price\": 3\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "NOT_FOUND",
            "description": "<p>The requested resource could not be found but may be available in the future.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 404 Not Found\n{\n  \"status\": {\n    \"id\": 404,\n    \"errors\": [\n      \"Not Found\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugin.js",
    "groupTitle": "Plugin"
  },
  {
    "type": "get",
    "url": "/plugin/getPluginOnACircle",
    "title": "Active plugins on a Circle",
    "description": "<p>Get all active plugins on a Circle</p>",
    "name": "/plugin/getPluginOnACircle",
    "group": "Plugin",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "array",
            "optional": false,
            "field": "List",
            "description": "<p>of plugin ID's</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "400",
            "optional": false,
            "field": "BAD_REQUEST",
            "description": "<p>The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "404",
            "optional": false,
            "field": "NOT_FOUND",
            "description": "<p>The requested resource could not be found but may be available in the future.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "409",
            "optional": false,
            "field": "CONFLICT",
            "description": "<p>Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple simultaneous updates.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"status\": {\n    \"errors\": [\n      \"Bad Request\",\n    ],\n    \"id\": 400\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 404 Not Found\n{\n  \"status\": {\n    \"id\": 404,\n    \"errors\": [\n      \"Not Found\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 409 Conflict\n{\n  \"status\": {\n    \"id\": 409,\n    \"errors\": [\n      \"Conflict\"\n    ]\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugin.js",
    "groupTitle": "Plugin"
  },
  {
    "type": "post",
    "url": "/user/chagePassword",
    "title": "Change user password",
    "description": "<p>Allows an authenticated user to change their password</p>",
    "name": "/user/chagePassword",
    "group": "User",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>bearer + 'Authorization token'</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "confpassword",
            "description": "<p>Password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"password\": \"1234567890\",\n \"confpassword\": \"1234567890\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>There is no return</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "401",
            "optional": false,
            "field": "UNAUTHORIZED",
            "description": "<p>Authentication is required and has failed or has not yet been provided.</p>"
          },
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\",\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"Password requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/create",
    "title": "Create a new user",
    "description": "<p>Create a new user with the received information</p>",
    "name": "/user/create",
    "group": "User",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "content-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>Password</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "firstName",
            "description": "<p>First Name</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "lastName",
            "description": "<p>Last Name</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"email\": \"email@email.com\",\n \"password\": \"1234567890\",\n \"firstName\": \"Ozzy\",\n \"lastName\": \"Osbourne\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>There is no return</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"E-mail already in use\",\n      \"Password requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/forgotPassword",
    "title": "Forgot Password",
    "description": "<p>Send an email to the user with a hash that allows user to change their password</p>",
    "name": "/user/forgotPassword",
    "group": "User",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "content-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"email\": \"email@email.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>There is no return</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"E-mail already in use\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/resendValidationEmail",
    "title": "Resend a Validation Email",
    "description": "<p>Resend a Validation Email so the user can validate their email</p>",
    "name": "/user/resendValidationEmail",
    "group": "User",
    "version": "1.0.0",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "content-type",
            "description": "<p>application/json</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "content-type: application/json",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"email\": \"email@email.com\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "null",
            "optional": false,
            "field": "null",
            "description": "<p>There is no return</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "422",
            "optional": false,
            "field": "UNPROCESSABLE_ENTITY",
            "description": "<p>The request was well-formed but was unable to be followed due to semantic errors.</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "type": "500",
            "optional": false,
            "field": "INTERNAL_SERVER_ERROR",
            "description": "<p>A generic error message, given when an unexpected condition was encountered and no more specific message is suitable</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"E-mail already in use\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/user.js",
    "groupTitle": "User"
  }
] });
