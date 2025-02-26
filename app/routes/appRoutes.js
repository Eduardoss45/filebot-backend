const router = require("express").Router();
const rotas = require("../controllers/rootController");
const automatico = require("../controllers/organizacaoController");
const reverter = require("../controllers/reversorController");

module.exports = () => {
  router.get("/", rotas.root);
  router.post("/automatico", automatico.organizacaoAutomatica);
  router.post("/reverter", reverter.reverterMovimentacao);
  return router;
};
