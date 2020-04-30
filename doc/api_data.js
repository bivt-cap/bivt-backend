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
    "url": "/user/create",
    "title": "Create a new User",
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
            "description": "<p>Email (User Name)</p>"
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
          "content": "HTTP/1.1 200 OK\n{\n \"status\": {\n   \"id\": 200,\n   \"errors\": null\n },\n \"data\": null\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error": [
          {
            "group": "Error",
            "type": "422",
            "optional": false,
            "field": "Unprocessable",
            "description": "<p>Entity</p>"
          },
          {
            "group": "Error",
            "type": "500",
            "optional": false,
            "field": "Internal",
            "description": "<p>Server Error</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{\n  \"status\": {\n    \"errors\": [\n      \"E-mail already in use\",\n      \"Password requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces\",\n    ],\n    \"id\": 422\n  },\n  \"data\": null\n}\n\n-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n\nHTTP/1.1 500 Internal Server Error\n{\n  \"status\": {\n    \"errors\": [\n      \"Internal Server Error\"\n    ],\n    \"id\": 500\n  },\n  \"data\": null\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./routes/user.js",
    "groupTitle": "User"
  }
] });
