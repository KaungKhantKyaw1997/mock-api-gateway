const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { setupRoutes } = require("./routes");

async function startServer(configFiles, options = {}) {
  const { default: chalk } = await import("chalk");

  const app = express();
  app.use(bodyParser.json());

  app.use(cors());

  let allRoutes = [];

  let tokenSecret =
    options.tokenSecret || "nIKz31cSWS8CogBicmQqjyYQF1ybYsmg9RYD/Jw7JbE=";
  let expiresIn = options.expiresIn || "1h";

  configFiles.forEach((file) => {
    const config = require(file);

    config.routes.forEach((route) => {
      allRoutes.push({
        method: route.method.toUpperCase(),
        path: route.path,
      });
    });

    app.use((req, res, next) => {
      const { path, method } = req;
      const route = config.routes.find(
        (r) => r.path === path && r.method.toUpperCase() === method
      );

      if (!route) return next();

      if (route.requiresAuth === false) {
        if (route.generateToken) {
          const { username, password } = req.body;
          if (username === "user" && password === "password") {
            const token = jwt.sign({}, tokenSecret, {
              expiresIn: expiresIn,
            });
            return res.status(200).json({ message: "Login successful", token });
          } else {
            return res.status(401).json({ message: "Invalid credentials" });
          }
        }
        return next();
      }

      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        jwt.verify(token, tokenSecret, (err) => {
          if (err) {
            return res.status(401).json({ message: "Unauthorized" });
          }
          next();
        });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    });

    setupRoutes(app, config.routes);
  });

  const port = options.port || 4000;
  const hostname = options.hostname || "localhost";
  const protocol = options.protocol || "http";

  const url = `${protocol}://${hostname}${port ? `:${port}` : ""}`;

  app.listen(port, hostname, () => {
    console.log(
      chalk.bgGreen.black.bold(` Server running: `) +
        ` ${chalk.green.bold(`${url}`)}`
    );
    console.log(chalk.blue.bold("\nAvailable API endpoints:\n"));
    allRoutes.forEach((route) => {
      console.log(
        `${chalk.yellow.bold(route.method.padEnd(7))} ${chalk.cyan.bold(
          `${url}${route.path}`
        )}`
      );
    });
    console.log(chalk.blue.bold("\n===========================\n"));
  });
}

module.exports = { startServer };
