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
