function setupRoutes(app, routes) {
  routes.forEach((route) => {
    const { method, path, response, requiresAuth = true } = route;

    app[method.toLowerCase()](path, (req, res) => {
      if (!requiresAuth) {
        return response(req, res);
      }

      if (typeof response === "function") {
        response(req, res);
      } else {
        res.status(response.status).json(response.body);
      }
    });
  });
}

module.exports = { setupRoutes };
