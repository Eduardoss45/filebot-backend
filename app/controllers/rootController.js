exports.root = (req, res) => {
  const app = req.app;
  const root = [];

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      root.push({
        metodo: Object.keys(middleware.route.methods)[0].toUpperCase(),
        caminho: middleware.route.path,
      });
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((subMiddleware) => {
        if (subMiddleware.route) {
          root.push({
            metodo: Object.keys(subMiddleware.route.methods)[0].toUpperCase(),
            caminho: subMiddleware.route.path,
          });
        }
      });
    }
  });

  res.json(root);
};
