const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

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
exports.organizacaoAutomatica = (req, res) => {
  const { extension, from, to, ignore } = req.body;
  console.log("Dados recebidos:", { extension, from, to, ignore });
  if (!Array.isArray(extension) || extension.length === 0) {
    return res
      .status(400)
      .send("Extensões inválidas. Deve ser uma lista de formatos.");
  }
  if (typeof from !== "string" || from.trim() === "") {
    return res.status(400).send("Caminho de origem (from) inválido.");
  }
  const normalizedExtensions = extension.map((ext) =>
    ext.startsWith(".") ? ext : `.${ext}`
  );
  const watcher = chokidar.watch(from, { persistent: true });
  watcher.on("add", (arquivo) => {
    console.log(`Novo arquivo detectado: ${arquivo}`);
    const fileExtension = path.extname(arquivo);
    const fileName = path.basename(arquivo);
    const fileDir = path.dirname(arquivo);
    console.log(`Extensão do arquivo detectado: ${fileExtension}`);
    console.log(`Nome do arquivo detectado: ${fileName}`);
    console.log(`Pasta do arquivo: ${fileDir}`);
    if (
      ignore === "all" ||
      (Array.isArray(ignore) &&
        ignore.some((item) => fileDir.includes(item) || fileName === item))
    ) {
      console.log(`Ignorado: ${arquivo}`);
      return;
    }
    if (normalizedExtensions.includes(fileExtension)) {
      const caminhoNovo = path.join(to, fileName);
      fs.rename(arquivo, caminhoNovo, (err) => {
        if (err) {
          console.error("Erro ao mover arquivo:", err);
          return;
        }
        console.log(`Arquivo ${fileName} movido de ${from} para ${to}`);
      });
    }
  });
  watcher.on("error", (err) => {
    console.error("Erro no monitoramento:", err);
  });
  res.status(200).send("Monitoramento iniciado com sucesso.");
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
