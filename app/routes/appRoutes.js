const router = require("express").Router();
const controllers = require("../controllers/controllers");

module.exports = () => {
  router.post("/pasta/mover", controllers.moverPasta); // Testado
  router.post("/pasta/renomear", controllers.renomearPasta); // Testado
  router.post("/pasta/deletar", controllers.deletarPasta); // Testado
  router.post("/pasta/criar", controllers.criarPasta); // Testado
  router.post("/arquivo/mover", controllers.moverArquivo); // Testado
  router.post("/arquivo/renomear", controllers.renomearArquivo); // Testado
  router.post("/arquivo/deletar", controllers.deletarArquivo); // Testado
  router.post("/arquivo/criar", controllers.criarArquivo); // Testado
  router.get("/", controllers.root); // Testado
  return router;
};
