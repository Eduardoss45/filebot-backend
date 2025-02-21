const fs = require("fs");
const { definirMetodo, monitorarArquivos } = require("../services/services");

// Testado (Não é necessário)
exports.criarPasta = (req, res) => {
  const { folderName } = req.body;
  fs.mkdir(folderName, { recursive: true }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pasta criada com sucesso!" });
  });
};

// Testado (Não é necessário)
exports.renomearPasta = (req, res) => {
  const { oldName, newName } = req.body;
  fs.rename(oldName, newName, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pasta renomeada com sucesso!" });
  });
};

// Testado (Não é necessário)
exports.moverPasta = (req, res) => {
  const { from, to } = req.body;
  fs.rename(from, to, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pasta movida com sucesso!" });
  });
};

// Testado (Não é necessário)
exports.deletarPasta = (req, res) => {
  const { folderName } = req.body;
  fs.rm(folderName, { recursive: true, force: true }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Pasta excluída com sucesso!" });
  });
};

// Testado (É necessário)
exports.moverArquivo = (req, res) => {
  const { from, to } = req.body;
  fs.rename(from, to, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Arquivo movido com sucesso!" });
  });
};

// Testado (É necessário)
exports.renomearArquivo = (req, res) => {
  const { oldName, newName } = req.body;
  fs.rename(oldName, newName, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Arquivo renomeado com sucesso!" });
  });
};

// Testado (É necessário)
exports.deletarArquivo = (req, res) => {
  const { fileName } = req.body;
  fs.unlink(fileName, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Arquivo deletado com sucesso!" });
  });
};

// Testado (Não é necessário)
exports.criarArquivo = (req, res) => {
  const { fileNameAndFormat } = req.body;
  fs.writeFile(fileNameAndFormat, "", (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Arquivo criado com sucesso!" });
  });
};

// (Monitoramento em Tempo Real)
exports.organizacaoAutomatica = (req, res) => {
  const {
    extension,
    from,
    to,
    ignore,
    pattern,
    creationDate,
    modificationDate,
  } = req.body;
  if (!from || !to) return res.status(400).send("Caminhos inválidos.");
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  const metodoUsado = definirMetodo({
    extension,
    creationDate,
    modificationDate,
    pattern,
  });
  if (!metodoUsado)
    return res.status(400).send("Nenhum critério válido foi fornecido.");

  const criterios = {
    extensions:
      extension && Array.isArray(extension)
        ? extension.map((ext) => (ext.startsWith(".") ? ext : `.${ext}`))
        : undefined,
    creationDate,
    modificationDate,
    pattern: pattern,
  };
  const regExr = new RegExp("^[^\\W\\d_]+");
  monitorarArquivos({ from, to, ignore, metodoUsado, criterios, regExr });
  res
    .status(200)
    .send(
      `📂 Monitoramento iniciado com sucesso usando o método "${metodoUsado}".`
    );
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
