const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const chokidar = require("chokidar");
const { registrarLog } = require("../utils/loggerUtils");

const arquivosMovidos = new Set();

const calcularHashArquivo = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);
    stream.on("data", (data) => {
      hash.update(data);
    });
    stream.on("end", () => {
      resolve(hash.digest("hex"));
    });
    stream.on("error", (err) => {
      reject(err);
    });
  });
};

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
  if (basePattern !== pattern) {
    console.log("Padrão não corresponde ao prefixo do arquivo. Ignorando...");
    return false;
  } else if (!(regExr instanceof RegExp)) {
    console.error("🚨 RegExr inválido.");
    return false;
  }
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

async function verificarEExcluirDuplicata(filePath, destinoInicial) {
  try {
    const [statsNovo, statsExistente] = await Promise.all([
      fs.promises.stat(filePath).catch(() => null),
      fs.promises.stat(destinoInicial).catch(() => null),
    ]);

    if (!statsNovo || !statsExistente) return false;

    if (statsNovo.size !== statsExistente.size) return false;

    const [hashNovo, hashExistente] = await Promise.all([
      calcularHashArquivo(filePath),
      calcularHashArquivo(destinoInicial),
    ]);

    if (hashNovo && hashNovo === hashExistente) {
      console.log(`🗑️ Arquivo duplicado encontrado! Excluindo ${filePath}...`);
      await fs.promises.unlink(filePath);
      return true;
    }
  } catch (err) {
    console.error(`🚨 Erro ao comparar arquivos:`, err);
  }
  return false;
}

const moverArquivo = async (filePath, to) => {
  const fileName = path.basename(filePath);
  const fileExt = path.extname(filePath);
  const fileBaseName = path.basename(filePath, fileExt);

  if (arquivosMovidos.has(fileName)) {
    console.log(`🔄 Ignorando ${fileName}, pois foi movido recentemente.`);
    return;
  }

  let destinoInicial = path.join(to, fileName);

  if (
    await fs.promises
      .access(destinoInicial)
      .then(() => true)
      .catch(() => false)
  ) {
    if (await verificarEExcluirDuplicata(filePath, destinoInicial)) return;
  }

  let newPath = destinoInicial;
  let count = 1;
  while (
    await fs.promises
      .access(newPath)
      .then(() => true)
      .catch(() => false)
  ) {
    newPath = path.join(to, `${fileBaseName} (${count})${fileExt}`);
    count++;
  }

  console.log(`🚀 Movendo ${fileName} para ${newPath}`);
  arquivosMovidos.add(fileName);

  fs.promises
    .rename(filePath, newPath)
    .then(() => {
      console.log(`✅ ${fileName} movido para ${newPath}`);
      setTimeout(() => arquivosMovidos.delete(fileName), 5000);
    })
    .catch((err) => {
      console.error(`🚨 Erro ao mover ${fileName}:`, err);
      arquivosMovidos.delete(fileName);
    });
};

const monitorarArquivos = async ({
  from,
  to,
  ignore,
  metodoUsado,
  criterios,
  regExr,
}) => {
  const watcher = chokidar.watch(from, { persistent: true });

  const arquivosMovidos = [];
  const arquivosIgnorados = [];

  const promessasMovimentacao = [];

  watcher.on("add", async (filePath) => {
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(filePath);

    if (
      Array.isArray(ignore) &&
      ignore.some((item) => fileName === item || fileDir.endsWith(`/${item}`))
    ) {
      arquivosIgnorados.push(fileName);
      console.log(`❌ Ignorado: ${filePath}`);
      return;
    }

    const mover = async () => {
      try {
        const stats = await fs.promises.stat(filePath);
        if (deveMoverArquivo(filePath, stats, metodoUsado, criterios, regExr)) {
          await moverArquivo(filePath, to);
          arquivosMovidos.push(fileName);
        }
      } catch (err) {
        console.error(`🚨 Erro ao acessar ${fileName}:`, err);
      }
    };

    promessasMovimentacao.push(mover());
  });

  watcher.on("error", (err) => console.error("🚨 Erro no monitoramento:", err));

  watcher.on("ready", async () => {
    console.log(
      `📂 Monitorando "${from}" e movendo para "${to}" usando método "${metodoUsado}"`
    );

    await Promise.all(promessasMovimentacao);

    console.log("Arquivos ignorados:", arquivosIgnorados);
    console.log("Metodo:", metodoUsado);

    await registrarLog({
      from,
      to,
      metodoUsado,
      criterios,
      arquivosMovidos,
      arquivosIgnorados,
    });
  });

  return { arquivosMovidos, arquivosIgnorados };
};

module.exports = { definirMetodo, monitorarArquivos };
