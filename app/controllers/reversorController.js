const fs = require("fs");
const path = require("path");
const { carregarLog } = require("../utils/loggerUtils");

const LOG_FILE_PATH = path.join(__dirname, "../json/filebot_recovery.json");

exports.reverterMovimentacao = (req, res) => {
  try {
    let { data, idMovimentacao } = req.body;
    let json = carregarLog();

    if (!Object.keys(json).length) {
      return res
        .status(404)
        .json({ error: "Nenhuma movimentação encontrada." });
    }

    if (!data) {
      data = Object.keys(json).sort().pop();
    }

    if (!json[data] || !Object.keys(json[data]).length) {
      return res.status(404).json({
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

    let algumErro = false;

    movimentacao.filesNames.forEach((arquivo) => {
      const caminhoAtual = path.join(movimentacao.toDestin, arquivo);
      const caminhoOriginal = path.join(movimentacao.fromFolder, arquivo);

      if (fs.existsSync(caminhoAtual)) {
        try {
          fs.renameSync(caminhoAtual, caminhoOriginal);
          console.log(`✅ Arquivo restaurado: ${arquivo}`);
        } catch (err) {
          console.error(`❌ Erro ao restaurar ${arquivo}: ${err.message}`);
          algumErro = true;
        }
      } else {
        console.warn(`⚠️ Arquivo não encontrado no destino: ${arquivo}`);
      }
    });

    if (!algumErro) {
      delete json[data][idMovimentacao];
      if (Object.keys(json[data]).length === 0) {
        delete json[data];
      }

      fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(json, null, 2), "utf-8");

      console.log("✅ Movimentação revertida com sucesso!");
      res.status(200).json({ message: "Movimentação revertida com sucesso!" });
    } else {
      res.status(500).json({
        error: "Reversão parcial concluída, alguns arquivos falharam.",
      });
    }
  } catch (error) {
    console.error(`❌ Erro na reversão: ${error.message}`);
    res.status(500).json({ error: "Erro ao reverter movimentação." });
  }
};
