# Mock API Gateway

A simple tool to create mock API endpoints for testing and development. It supports CRUD operations, authentication, pagination, and search.

## Features

- **CRUD Operations**: Easily create, read, update, and delete resources.
- **Authentication**: Use Bearer tokens for simple token-based authentication.
- **Pagination and Search**: Search and paginate through your data.
- **Configurable**: Customize routes and authentication as needed.

## Installation

Install the `mock-api-gateway` package using npm:

```sh
npm install mock-api-gateway
```

## Usage

### Step 1: Create Configuration File

Define your API routes in a configuration file, like `usersConfig.js`:

```js
let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" },
  { id: 5, name: "Eve" },
];

let loginPath = "/auth/login";
let usersPath = "/api/users";

module.exports = {
  routes: [
    {
      method: "POST",
      path: loginPath,
      requiresAuth: false,
      generateToken: true,
      response: (req, res) => {
        const { username, password } = req.body;
        if (username === "user" && password === "password") {
          res.status(200).json({ message: "Login successful" });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      },
    },
    {
      method: "GET",
      path: usersPath,
      requiresAuth: true,
      response: (req, res) => {
        let { page = 1, limit = 10, query = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        // Search users
        let filteredUsers = users.filter((user) =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );

        // Paginate users
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        res.status(200).json({
          page,
          limit,
          totalUsers: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / limit),
          users: paginatedUsers,
        });
      },
    },
    {
      method: "GET",
      path: `${usersPath}/:id`,
      requiresAuth: true,
      response: (req, res) => {
        const user = users.find((u) => u.id === parseInt(req.params.id));
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      },
    },
    {
      method: "POST",
      path: usersPath,
      requiresAuth: true,
      response: (req, res) => {
        const newUser = {
          id: users.length + 1,
          ...req.body,
        };
        users.push(newUser);
        res
          .status(201)
          .json({ message: "User created successfully", user: newUser });
      },
    },
    {
      method: "PUT",
      path: `${usersPath}/:id`,
      requiresAuth: true,
      response: (req, res) => {
        const user = users.find((u) => u.id === parseInt(req.params.id));
        if (user) {
          Object.assign(user, req.body);
          res.status(200).json({ message: "User updated successfully", user });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      },
    },
    {
      method: "DELETE",
      path: `${usersPath}/:id`,
      requiresAuth: true,
      response: (req, res) => {
        const index = users.findIndex((u) => u.id === parseInt(req.params.id));
        if (index !== -1) {
          users.splice(index, 1);
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      },
    },
  ],
};
```

### Step 2: Create `startServer.js`

Set up and start the server in `startServer.js`:

```js
require("dotenv").config();
const { startServer } = require("mock-api-gateway");
const path = require("path");

const configFiles = [path.resolve(__dirname, "./configs/usersConfig.js")];

const options = {
  port: process.env.PORT, // Port number, default is 4000
  hostname: process.env.HOSTNAME, // Hostname, default is "localhost"
  protocol: process.env.PROTOCOL, // Protocol, default is "http"
  tokenSecret: process.env.TOKEN_SECRET, // Token secret, default is nIKz31cSWS8CogBicmQqjyYQF1ybYsmg9RYD/Jw7JbE=
  expiresIn: process.env.EXPIRES_IN, // Token expiration, default is 1 hour
};

startServer(configFiles, options);
```

### Step 3: Run the Server

Start the server using Node.js:

```sh
node startServer.js
```

Your mock server will now be running on the specified port, hostname, and protocol, using the routes you defined.

## Summary of Variables

- `method`: HTTP method (GET, POST, PUT, DELETE).
- `path`: The URL path for the route.
- `requiresAuth`: Whether the route requires authentication.
- `generateToken`: Whether a token is generated (usually for login routes).
- `response`: Function to handle the request and send a response.
