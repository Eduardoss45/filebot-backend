const fs = require("fs");
const { definirMetodo, monitorarArquivos } = require("../services/services");

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

  const regExr = new RegExp("^[^\\W\\d_]+");

  const criteriosRecebidos = {
    extension: extension?.length > 0,
    creationDate: !!creationDate,
    modificationDate: !!modificationDate,
    pattern: !!pattern,
  };

  const criteriosAtivos = Object.keys(criteriosRecebidos).filter(
    (key) => criteriosRecebidos[key]
  );

  if (criteriosAtivos.length !== 1) {
    return res
      .status(400)
      .send(
        `Erro: Apenas um critério deve ser utilizado por vez. Critérios enviados: ${criteriosAtivos.join(
          ", "
        )}`
      );
  }

  const metodoUsado = definirMetodo({
    extension,
    creationDate,
    modificationDate,
    pattern,
  });

  if (!metodoUsado) {
    return res.status(400).send("Nenhum critério válido foi fornecido.");
  }

  const criterios = {
    extensions: Array.isArray(extension)
      ? extension.map((ext) => (ext.startsWith(".") ? ext : `.${ext}`))
      : undefined,
    creationDate,
    modificationDate,
    pattern,
  };

  const { arquivosMovidos, arquivosIgnorados } = monitorarArquivos({
    from,
    to,
    ignore,
    metodoUsado,
    criterios,
    regExr,
  });

  res
    .status(200)
    .send(
      `📂 Monitoramento iniciado com sucesso usando o método "${metodoUsado}".`
    );
};
