const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

const formatDate = (date) => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

const definirMetodo = ({
  extension,
  creationDate,
  modificationDate,
  pattern,
}) => {
  if (Array.isArray(extension) && extension.length > 0) return "extension";
  if (creationDate) return "creationDate";
  if (modificationDate) return "modificationDate";
  if (pattern) return "pattern";
  return null;
};

const extrairPadrao = (fileName) => {
  const nomeSemExtensao = path.basename(fileName, path.extname(fileName));
  const padrao = nomeSemExtensao.match(/^[^\W\d_]+/);
  return padrao ? padrao[0] : null;
};

const verificarPadrao = (fileName, pattern, regExr) => {
  const basePattern = extrairPadrao(fileName);
  // console.log("RegExr: ", regExr);
  // console.log("Pattern: ", pattern);
  // console.log("Base Pattern: ", basePattern);
  if (basePattern !== pattern) {
    console.log("Padrão não corresponde ao prefixo do arquivo. Ignorando...");
    return false;
  }
  // console.log("Teste de Expressão regular: ", regExr.test(basePattern));
  return regExr.test(basePattern);
};

const deveMoverArquivo = (file, stats, metodoUsado, criterios, regExr) => {
  switch (metodoUsado) {
    case "extension":
      return criterios.extensions.includes(path.extname(file));
    case "creationDate":
      return formatDate(stats.birthtime) === criterios.creationDate;
    case "modificationDate":
      return formatDate(stats.mtime) === criterios.modificationDate;
    case "pattern":
      return verificarPadrao(file, criterios.pattern, regExr);
    default:
      return false;
  }
};

const moverArquivo = (filePath, to) => {
  const fileName = path.basename(filePath);
  let newPath = path.join(to, fileName);
  let count = 1;
  while (fs.existsSync(newPath)) {
    const parsed = path.parse(fileName);
    newPath = path.join(to, `${parsed.name} (${count})${parsed.ext}`);
    count++;
  }
  fs.rename(filePath, newPath, (err) => {
    if (err) {
      console.error(`🚨 Erro ao mover ${fileName}:`, err);
      return;
    }
    console.log(`✅ ${fileName} movido para ${newPath}`);
  });
};

const monitorarArquivos = ({
  from,
  to,
  ignore,
  metodoUsado,
  criterios,
  regExr,
}) => {
  const watcher = chokidar.watch(from, { persistent: true });
  watcher.on("add", (filePath) => {
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(filePath);
    if (
      ignore === "all" ||
      (Array.isArray(ignore) &&
        ignore.some((item) => fileDir.includes(item) || fileName === item))
    ) {
      console.log(`❌ Ignorado: ${filePath}`);
      return;
    }
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`🚨 Erro ao acessar ${fileName}:`, err);
        return;
      }
      if (deveMoverArquivo(filePath, stats, metodoUsado, criterios, regExr)) {
        setTimeout(() => moverArquivo(filePath, to), 100);
      }
    });
  });
  watcher.on("error", (err) => console.error("🚨 Erro no monitoramento:", err));
  console.log(`📂 Monitoramento iniciado com método "${metodoUsado}"`);
};

module.exports = { definirMetodo, monitorarArquivos };
