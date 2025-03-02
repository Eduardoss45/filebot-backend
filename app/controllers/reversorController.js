const fs = require("fs");
const path = require("path");
const { carregarJson } = require("../utils/recoveryUtils");

const LOG_FILE_PATH = path.join(__dirname, "../json/filebot_recovery.json");

exports.reverterMovimentacao = (req, res) => {
  try {
    let { data, idMovimentacao } = req.body;
    let json = carregarJson();

    if (!Object.keys(json).length) {
      return res
        .status(404)
        .json({ error: "Nenhuma movimentação encontrada." });
    }

    if (!data) {
      data = Object.keys(json).sort().pop();
    }

    if (!json[data] || !Object.keys(json[data]).length) {
      return res
        .status(404)
        .json({
          error: "Nenhuma movimentação encontrada para a data fornecida.",
        });
    }

    if (!idMovimentacao) {
      idMovimentacao = Object.keys(json[data]).sort().pop();
    }

    if (!json[data][idMovimentacao]) {
      return res.status(404).json({ error: "Movimentação não encontrada." });
    }

    const movimentacao = json[data][idMovimentacao];
    console.log(`🔄 Revertendo movimentação: ${idMovimentacao} do dia ${data}`);

    let error = false;

    movimentacao.filesNames.forEach((arquivo) => {
      let nomeOriginal = arquivo;
      let nomeRenomeado = arquivo; // Assume que o nome é o mesmo, a menos que esteja em `filesRenamed`

      if (movimentacao.filesRenamed && movimentacao.filesRenamed.length > 0) {
        const renomeado = movimentacao.filesRenamed.find(
          (obj) => Object.keys(obj)[0] === arquivo
        );
        if (renomeado) {
          nomeRenomeado = renomeado[arquivo];
        }
      }

      const caminhoAtual = path.join(movimentacao.toDestin, nomeRenomeado);
      const caminhoOriginal = path.join(movimentacao.fromFolder, nomeOriginal);

      if (fs.existsSync(caminhoAtual)) {
        try {
          fs.renameSync(caminhoAtual, caminhoOriginal);
          console.log(
            `✅ Arquivo restaurado: ${nomeRenomeado} → ${nomeOriginal}`
          );
        } catch (err) {
          console.error(
            `❌ Erro ao restaurar ${nomeRenomeado}: ${err.message}`
          );
          error = true;
        }
      } else {
        console.warn(`⚠️ Arquivo não encontrado no destino: ${nomeRenomeado}`);
      }
    });

    if (!error) {
      delete json[data][idMovimentacao];
      if (Object.keys(json[data]).length === 0) {
        delete json[data];
      }

      fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(json, null, 2), "utf-8");
      console.log("✅ Movimentação revertida com sucesso!");
      return res
        .status(200)
        .json({ message: "Movimentação revertida com sucesso!" });
    } else {
      return res.status(500).json({
        error: "Reversão parcial concluída, alguns arquivos falharam.",
      });
    }
  } catch (error) {
    console.error(`❌ Erro na reversão: ${error.message}`);
    return res.status(500).json({ error: "Erro ao reverter movimentação." });
  }
};
