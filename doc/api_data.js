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
    "filename": "./routes/circle.js",
    "groupTitle": "Circle"
  },
  {
    "type": "get",
    "url": "/circle/getMemberOfACircle",
    "title": "Circle Members",
    "description": "<p>Get all active (didn't leave) members in a Circle</p>",
    "name": "/circle/getMemberOfACircle",
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
            "description": "<p>Circle of the Id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "List",
            "description": "<p>Members</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": [\n    {\n      \"id\": 1,\n      \"extId\": \"99999999-aaaa-99aa-aa9a-99999a99999a\",\n      \"email\": \"email@email.com\",\n      \"userFirstName\": \"First\",\n      \"userLastName\": \"Last\",\n      \"photoUrl\": null,\n      \"isOwner\": 1,\n      \"joinedOn\": \"2000-01-17T08:00:00.000Z\",\n      \"isAdmin\": 1\n    },\n    {\n      \"id\": 2,\n      \"extId\": \"99999999-aaaa-99aa-aa9a-99999a99999a\",\n      \"email\": \"email@email.com\",\n      \"userFirstName\": \"First\",\n      \"userLastName\": \"Last\",\n      \"photoUrl\": \"https://fake.url.ca/photo.jpg\",\n      \"isOwner\": 0,\n      \"joinedOn\": null,\n      \"isAdmin\": 0\n    }\n  ]\n}",
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
    "url": "/plugin/expenses/addBill",
    "title": "Adds a new Bill",
    "description": "<p>Adds a Bill</p>",
    "name": "/plugin/expenses/addBill",
    "group": "Expenses",
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
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "billName",
            "description": "<p>Name of the bill</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "billAmount",
            "description": "<p>Amount off the bill</p>"
          },
          {
            "group": "Parameter",
            "type": "id",
            "optional": false,
            "field": "billCategory",
            "description": "<p>Category of the bill</p>"
          },
          {
            "group": "Parameter",
            "type": "date",
            "optional": false,
            "field": "billDate",
            "description": "<p>date of the bill</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  circleId: 1,\n  billName: Lunch,\n  billAmount: 100,\n  billCategory: 1,\n  billDate: 2015-03-25,\n}",
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
    "filename": "./routes/plugins/expenses.js",
    "groupTitle": "Expenses"
  },
  {
    "type": "get",
    "url": "/plugin/expenses/billCategories",
    "title": "List of all the bill categories",
    "description": "<p>Return the list of all the available bill categories</p>",
    "name": "/plugin/expenses/billCategories",
    "group": "Expenses",
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
            "field": "categories",
            "description": "<p>List of Categories</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": {\n    \"categories\": [\n      {\n        \"id\": 1,\n        \"name\": \"Food\",\n      },\n      {\n        \"id\": 2,\n        \"name\": \"Other\",\n      }\n    ]\n  }\n}",
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
    "filename": "./routes/plugins/expenses.js",
    "groupTitle": "Expenses"
  },
  {
    "type": "post",
    "url": "/plugin/expenses/bills",
    "title": "List of all the bills",
    "description": "<p>Return the list of all the available bills</p>",
    "name": "/plugin/expenses/bills",
    "group": "Expenses",
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
            "type": "id",
            "optional": false,
            "field": "circleId",
            "description": "<p>circle ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  circleId: 1,\n}",
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
            "field": "bills",
            "description": "<p>List of bills</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": {\n    \"bills\": [\n      {\n        \"id\": 1,\n        \"billName\": \"Car repair\",\n        \"billAmount\": 100,\n        \"billCategory\": 5,\n        \"billDate\": \"2020-06-02T01:57:24.000Z\"\n      },\n    ]\n  }\n}",
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
    "filename": "./routes/plugins/expenses.js",
    "groupTitle": "Expenses"
  },
  {
    "type": "post",
    "url": "/plugin/expenses/removeBill",
    "title": "Removes bill",
    "description": "<p>Removes a bill based on the bill id</p>",
    "name": "/plugin/expenses/removeBill",
    "group": "Expenses",
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
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  circleId: 1,\n  billId: 1,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
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
    "filename": "./routes/plugins/expenses.js",
    "groupTitle": "Expenses"
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
    "filename": "./routes/plugin.js",
    "groupTitle": "Plugin"
  },
  {
    "type": "post",
    "url": "/plugin/poll/add",
    "title": "Add Poll",
    "description": "<p>Add a new Poll</p>",
    "name": "/plugin/poll/add",
    "group": "Poll",
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
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "question",
            "description": "<p>Question</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "startOn",
            "description": "<p>Start datetime (yyyy-MM-dd HH:MM:SS)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "endOn",
            "description": "<p>End datetime (yyyy-MM-dd HH:MM:SS)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1,\n \"question\": \"Who took the cookie from the cookie jar?\",\n \"startOn\": \"2020-06-12 00:00:00\",\n \"endOn\": \"2020-06-19 23:59:59\"\n}",
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
            "description": "<p>of the New Poll</p>"
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
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "post",
    "url": "/plugin/poll/addAnswer",
    "title": "Add Answer",
    "description": "<p>Add a new answer to an existing Poll</p>",
    "name": "/plugin/poll/addAnswer",
    "group": "Poll",
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
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "pollId",
            "description": "<p>Poll Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "answer",
            "description": "<p>Answer</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1,\n 'pollId\": 1,\n \"answer\": \"Panda\"\n}",
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
            "description": "<p>of the New Poll</p>"
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
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "post",
    "url": "/plugin/poll/addVote",
    "title": "Add Vote",
    "description": "<p>Add a new vote to an Answer</p>",
    "name": "/plugin/poll/addVote",
    "group": "Poll",
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
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "pollId",
            "description": "<p>Poll Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "answerId",
            "description": "<p>Answer Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1,\n 'pollId\": 1,\n \"answerId\": 1\n}",
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
            "description": "<p>of the New Poll</p>"
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
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "put",
    "url": "/plugin/poll/edit",
    "title": "Edit Poll",
    "description": "<p>Edit an existing question</p>",
    "name": "/plugin/poll/edit",
    "group": "Poll",
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
            "description": "<p>Poll Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "question",
            "description": "<p>Question</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "startOn",
            "description": "<p>Start datetime (yyyy-MM-dd HH:MM:SS)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "endOn",
            "description": "<p>End datetime (yyyy-MM-dd HH:MM:SS)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1,\n \"circleId\": 1,\n \"question\": \"Who took the cookie from the cookie jar?\",\n \"startOn\": \"2020-06-12 00:00:00\",\n \"endOn\": \"2020-06-19 23:59:59\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "put",
    "url": "/plugin/poll/editAnswer",
    "title": "Edit Answer",
    "description": "<p>Edit an existing Answer</p>",
    "name": "/plugin/poll/editAnswer",
    "group": "Poll",
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
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "pollId",
            "description": "<p>Poll Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "id",
            "description": "<p>Answer Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "answer",
            "description": "<p>Answer</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1,\n \"circleId\": 1,\n \"question\": \"Who took the cookie from the cookie jar?\",\n \"startOn\": \"2020-06-12 00:00:00\",\n \"endOn\": \"2020-06-19 23:59:59\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "get",
    "url": "/plugin/poll/getActiveAnswers",
    "title": "Active Answers",
    "description": "<p>Get all active answers</p>",
    "name": "/plugin/poll/getActiveAnswers",
    "group": "Poll",
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
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "id",
            "description": "<p>Poll Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1,\n \"id\": 1,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": [\n    {\n      \"id\": 1,\n      \"answer\": \"Panda\",\n      \"totalVotes\": 0\n    },\n    {\n      \"id\": 2,\n      \"answer\": \"Rabbit\",\n      \"totalVotes\": 0\n    },\n    {\n      \"id\": 3,\n      \"answer\": \"Bear\",\n      \"totalVotes\": 0\n    },\n    {\n      \"id\": 4,\n      \"answer\": \"Penguin\",\n      \"totalVotes\": 0\n    },\n    {\n      \"id\": 5,\n      \"answer\": \"Kangaroo\",\n      \"totalVotes\": 0\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "get",
    "url": "/plugin/poll/getActives",
    "title": "Active Polls",
    "description": "<p>Get all active polls</p>",
    "name": "/plugin/poll/getActives",
    "group": "Poll",
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
            "description": "<p>Circle Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": [\n    {\n      \"id\": 1,\n      \"question\": \"Who took the cookie from the cookie jar?\",\n      \"createdOn\": \"2020-06-13T04:42:13.000Z\",\n      \"createdBy\": \"First Name Last Name\",\n      \"periodStartOn\": \"2020-06-12T07:00:00.000Z\",\n      \"periodEndOn\": \"2020-06-27T06:59:59.000Z\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "get",
    "url": "/plugin/poll/getValidPolls",
    "title": "Valid Polls",
    "description": "<p>Get all valid polls in the last month</p>",
    "name": "/plugin/poll/getValidPolls",
    "group": "Poll",
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
            "description": "<p>Circle Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "get",
    "url": "/plugin/poll/getVotes",
    "title": "Get Voltes",
    "description": "<p>Get all votes in a Poll</p>",
    "name": "/plugin/poll/getVotes",
    "group": "Poll",
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
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "id",
            "description": "<p>Poll Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1,\n \"id\": 1,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": [\n    {\n      \"answerId\": 1,\n      \"createdOn\": \"2020-06-13T05:26:09.000Z\",\n      \"createdBy\": \"First Name Last Name\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "delete",
    "url": "/plugin/poll/remove",
    "title": "Remove Poll",
    "description": "<p>Remove an existing question</p>",
    "name": "/plugin/poll/remove",
    "group": "Poll",
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
            "description": "<p>Poll Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1,\n \"circleId\": 1,\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "delete",
    "url": "/plugin/poll/removeAnswer",
    "title": "Remove Answer",
    "description": "<p>Remove an existing Answer</p>",
    "name": "/plugin/poll/removeAnswer",
    "group": "Poll",
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
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "pollId",
            "description": "<p>Poll Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "id",
            "description": "<p>Answer Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "answer",
            "description": "<p>Answer</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1,\n \"circleId\": 1,\n \"question\": \"Who took the cookie from the cookie jar?\",\n \"startOn\": \"2020-06-12 00:00:00\",\n \"endOn\": \"2020-06-19 23:59:59\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/poll.js",
    "groupTitle": "Poll"
  },
  {
    "type": "post",
    "url": "/plugin/shoppingList/add",
    "title": "Add",
    "description": "<p>Create a new Shopping List item</p>",
    "name": "/plugin/shoppingList/add",
    "group": "Shopping_List",
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
            "description": "<p>Circle of the Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Shopping List Item</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1,\n \"description\": Bread\"\n}",
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
            "description": "<p>of the New Todo</p>"
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
    "filename": "./routes/plugins/shoppingList.js",
    "groupTitle": "Shopping_List"
  },
  {
    "type": "get",
    "url": "/plugin/shoppingList/list",
    "title": "List",
    "description": "<p>Get all active shopping list itens</p>",
    "name": "/plugin/shoppingList/list",
    "group": "Shopping_List",
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
            "description": "<p>Circle Id</p>"
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
      "examples": [
        {
          "title": "Example",
          "content": "{\n  \"status\": {\n    \"id\": 200,\n    \"errors\": null\n  },\n  \"data\": [\n    {\n      \"id\": 1,\n      \"description\": \"Bread\",\n      \"photoUrl\": null,\n      \"createdOn\": \"2020-06-05T05:17:25.000Z\",\n      \"createdBy\": \"User 1\",\n      \"purchasedOn\": null,\n      \"purchasedBy\": null,\n      \"purchasedPrice\": null,\n      \"removedOn\": \"2020-06-09T05:24:25.000Z\",\n      \"removedBy\": \"User 2\"\n    },\n    {\n      \"id\": 2,\n      \"description\": \"Banana\",\n      \"photoUrl\": null,\n      \"createdOn\": \"2020-06-05T05:18:18.000Z\",\n      \"createdBy\": \"User 2\",\n      \"purchasedOn\": \"2020-06-09T05:18:25.000Z\",\n      \"purchasedBy\": \"User 1\",\n      \"purchasedPrice\": 1.52,\n      \"removedOn\": null,\n      \"removedBy\": null\n    },\n    {\n      \"id\": 3,\n      \"description\": \"Cake\",\n      \"photoUrl\": \"http://fakeurl.ca/plugin/shoppingList/photo/3e6803d1-a9d9-11ea-bc5b-42010a80028b\",\n      \"createdOn\": \"2020-06-09T03:36:01.000Z\",\n      \"createdBy\": \"User 3\",\n      \"purchasedOn\": null,\n      \"purchasedBy\": null,\n      \"purchasedPrice\": null,\n      \"removedOn\": null,\n      \"removedBy\": null\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/shoppingList.js",
    "groupTitle": "Shopping_List"
  },
  {
    "type": "put",
    "url": "/plugin/shoppingList/markAsPurchased",
    "title": "Mark as purchased",
    "description": "<p>Mark an existing item as purchased</p>",
    "name": "/plugin/shoppingList/markAsPurchased",
    "group": "Shopping_List",
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
            "description": "<p>Shoppint list Item Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "decimal",
            "optional": false,
            "field": "price",
            "description": "<p>Price (0 if the user doesn't want to inform the price)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1\n \"circleId\": 1,\n \"price\": 1.51\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/shoppingList.js",
    "groupTitle": "Shopping_List"
  },
  {
    "type": "get",
    "url": "/plugin/shoppingList/photo",
    "title": "Photo",
    "description": "<p>Return a photo &quot;file&quot;</p>",
    "name": "/plugin/shoppingList/photo",
    "group": "Shopping_List",
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
            "description": "<p>Circle Id</p>"
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
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK",
          "type": "file"
        }
      ]
    },
    "filename": "./routes/plugins/shoppingList.js",
    "groupTitle": "Shopping_List"
  },
  {
    "type": "delete",
    "url": "/plugin/shoppingList/remove",
    "title": "Delete",
    "description": "<p>Delete an existing item</p>",
    "name": "/plugin/shoppingList/remove",
    "group": "Shopping_List",
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
            "description": "<p>Shoppint list Item Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle Id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1\n \"circleId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/shoppingList.js",
    "groupTitle": "Shopping_List"
  },
  {
    "type": "put",
    "url": "/plugin/shoppingList/setPhotoPath?circleId=??&id=??",
    "title": "Set Photo",
    "description": "<p>Set a photo to an existing item</p>",
    "name": "/plugin/shoppingList/setPhotoPath?circleId",
    "group": "Shopping_List",
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
            "description": "<p>multipart/form-data</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "Authorization: bearer eyJhbGc...token\ncontent-type: multipart/form-data",
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
            "description": "<p>Shoppint list Item Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "file",
            "optional": false,
            "field": "photo",
            "description": "<p>Photo (File)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/shoppingList.js",
    "groupTitle": "Shopping_List"
  },
  {
    "type": "put",
    "url": "/plugin/shoppingList/update",
    "title": "Update",
    "description": "<p>Update an existing item</p>",
    "name": "/plugin/shoppingList/update",
    "group": "Shopping_List",
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
            "description": "<p>Shoppint list Item Id</p>"
          },
          {
            "group": "Parameter",
            "type": "int",
            "optional": false,
            "field": "circleId",
            "description": "<p>Circle Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the Shopping List Item</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1\n \"circleId\": 1,\n \"description\": \"Cake\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/shoppingList.js",
    "groupTitle": "Shopping_List"
  },
  {
    "type": "post",
    "url": "/plugin/todo/add",
    "title": "Add a new To-do",
    "description": "<p>Create a new To-do item</p>",
    "name": "/plugin/todo/add",
    "group": "To-do_List",
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
            "description": "<p>Circle of the Id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the to-do</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"circleId\": 1,\n \"description\": \"Call mama\"\n}",
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
            "description": "<p>of the New Todo</p>"
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
    "filename": "./routes/plugins/todo.js",
    "groupTitle": "To-do_List"
  },
  {
    "type": "get",
    "url": "/plugin/todo/list",
    "title": "Get all to-dos",
    "description": "<p>Get a list of actives to-dos</p>",
    "name": "/plugin/todo/list",
    "group": "To-do_List",
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
            "description": "<p>Circle Id</p>"
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
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n },\n \"data\": [\n   {\n     \"id\": 1,\n     \"description\": \"Call mama\",\n     \"done\": 0,\n     \"removed\": 0\n   },\n   {\n     \"id\": 2,\n     \"description\": \"Discovery the coca-cola secret recipe\",\n     \"done\": 0,\n     \"removed\": 1\n   },\n   {\n     \"id\": 3,\n     \"description\": \"Find the cure for COVID 19\",\n     \"done\": 1,\n     \"removed\": 0\n   }\n ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/todo.js",
    "groupTitle": "To-do_List"
  },
  {
    "type": "put",
    "url": "/plugin/todo/markAsDone",
    "title": "Mark as Done",
    "description": "<p>Mark an existing to-do as done</p>",
    "name": "/plugin/todo/markAsDone",
    "group": "To-do_List",
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
            "description": "<p>To-do id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/todo.js",
    "groupTitle": "To-do_List"
  },
  {
    "type": "delete",
    "url": "/plugin/todo/remove",
    "title": "Delete",
    "description": "<p>Delete an existing to-do</p>",
    "name": "/plugin/todo/remove",
    "group": "To-do_List",
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
            "description": "<p>To-do id</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/todo.js",
    "groupTitle": "To-do_List"
  },
  {
    "type": "put",
    "url": "/plugin/todo/update",
    "title": "Update",
    "description": "<p>Update an existing to-do</p>",
    "name": "/plugin/todo/update",
    "group": "To-do_List",
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
            "description": "<p>To-do id</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "description",
            "description": "<p>Description of the to-do</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"id\": 1,\n \"description\": \"Play soccer with my son\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/todo.js",
    "groupTitle": "To-do_List"
  },
  {
    "type": "get",
    "url": "/plugin/tracking/getPositions",
    "title": "Get Positions",
    "description": "<p>Get the position of all users in a circle</p>",
    "name": "/plugin/tracking/getPositions",
    "group": "Trancking_Plugin",
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
            "description": "<p>Circle Id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n },\n \"data\": [\n   {\n    \"userId\": 1,\n    \"userExtId\": \"HSUAHDUAHU46797\",\n    \"email\": \"email@email.com\",\n    \"userFirstName\": \"First Name\",\n    \"userLastName\": \"Last Name\",\n    \"photoUrl\": null,\n    \"latitude\": 49.246292,\n    \"longitude\": -123.116226,\n    \"lastUpdatedOn\": \"2020-06-16T05:48:04.000Z\"\n   },\n   {\n    \"userId\": 2,\n    \"userExtId\": \"HSUAHDUAHU46797\",\n    \"email\": \"email2@email.com\",\n    \"userFirstName\": \"First Name 2\",\n    \"userLastName\": \"Last Name 2\",\n    \"photoUrl\": null,\n    \"latitude\": 49.246291,\n    \"longitude\": -123.116226,\n    \"lastUpdatedOn\": \"2020-06-16T05:48:04.000Z\"\n   }\n ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/trackingSystem.js",
    "groupTitle": "Trancking_Plugin"
  },
  {
    "type": "post",
    "url": "/plugin/tracking/setPosition",
    "title": "Set Position",
    "description": "<p>Set the user Position</p>",
    "name": "/plugin/tracking/setPosition",
    "group": "Trancking_Plugin",
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
            "type": "decimal",
            "optional": false,
            "field": "latitude",
            "description": "<p>Latitude - decimal(11,8)</p>"
          },
          {
            "group": "Parameter",
            "type": "decimal",
            "optional": false,
            "field": "longitude",
            "description": "<p>Longitude - decimal(11,8)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n \"latitude\": 49.246292,\n \"longitude\": -123.116226\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/plugins/trackingSystem.js",
    "groupTitle": "Trancking_Plugin"
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
    "filename": "./routes/user.js",
    "groupTitle": "User"
  }
] });
