const fs = require("fs");

// Testado
exports.criarPasta = (req, res) => {
  const { folderName } = req.body;
  fs.mkdir(folderName, { recursive: true }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pasta criada com sucesso!" });
  });
};

// Testado
exports.renomearPasta = (req, res) => {
  const { oldName, newName } = req.body;
  fs.rename(oldName, newName, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pasta renomeada com sucesso!" });
  });
};

// Testado
exports.moverPasta = (req, res) => {
  const { from, to } = req.body;
  fs.rename(from, to, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pasta movida com sucesso!" });
  });
};

// Testado
exports.deletarPasta = (req, res) => {
  const { folderName } = req.body;
  fs.rm(folderName, { recursive: true, force: true }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pasta excluída com sucesso!" });
  });
};

// Testado
exports.moverArquivo = (req, res) => {
  const { from, to } = req.body;
  fs.rename(from, to, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Arquivo movido com sucesso!" });
  });
};

// Testado
exports.renomearArquivo = (req, res) => {
  const { oldName, newName } = req.body;
  fs.rename(oldName, newName, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Arquivo renomeado com sucesso!" });
  });
};

// Testado
exports.deletarArquivo = (req, res) => {
  const { fileName } = req.body;
  fs.unlink(fileName, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Arquivo deletado com sucesso!" });
  });
};

// Testado
exports.criarArquivo = (req, res) => {
  const { fileNameAndFormat } = req.body;
  fs.writeFile(fileNameAndFormat, "", (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Arquivo criado com sucesso!" });
  });
};

// Testado
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
