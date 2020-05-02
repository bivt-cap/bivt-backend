define({ "api": [
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
    "url": "/user/auth",
    "title": "Authenticate user",
    "name": "/user/auth",
    "group": "User",
    "version": "1.0.0",
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
      }
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
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": {\n    \"errors\": null,\n    \"id\": 200\n  },\n  \"data\": {\n    \"token\": \"eyJhbGciOiJIUzI1NiIsInR5...\"\n  }\n}",
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
          },
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
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"E-mail already in use\",\n      \"Password requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces\",\n    ],\n    \"id\": 422\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 401 Unauthorized\n{\n  \"status\": {\n    \"errors\": [\n      \"Unauthorized\"\n    ],\n    \"id\": 401\n  }\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  }\n}",
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
    "name": "/user/create",
    "group": "User",
    "version": "1.0.0",
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
      }
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
    "name": "/user/forgotPassword",
    "group": "User",
    "version": "1.0.0",
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
      }
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
    "name": "/user/resendValidationEmail",
    "group": "User",
    "version": "1.0.0",
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
      }
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
