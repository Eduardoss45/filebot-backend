# Monitoramento automatico

Para ativar essa função devem ser enviados os seguintes dados:

exemplo para extenções:
{
"from": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api",
"to": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\html",
"extension": [".js"]
}

exemplo para padrões:
{
"from": "C:\Users\gilgi\OneDrive\Documentos\models\estudos\linguagens-tipadas\typescript-para-javascript\filebot\B",
"to": "C:\Users\gilgi\OneDrive\Documentos\models\estudos\linguagens-tipadas\typescript-para-javascript\filebot\A",
"pattern": "desafio"
}

exemplo para data de criação:
{
"from": "C:\Users\gilgi\OneDrive\Documentos\models\estudos\linguagens-tipadas\typescript-para-javascript\filebot\B",
"to": "C:\Users\gilgi\OneDrive\Documentos\models\estudos\linguagens-tipadas\typescript-para-javascript\filebot\A",
"creationDate": ""
}

exemplo para data de modificação:
{
"from": "C:\Users\gilgi\OneDrive\Documentos\models\estudos\linguagens-tipadas\typescript-para-javascript\filebot\B",
"to": "C:\Users\gilgi\OneDrive\Documentos\models\estudos\linguagens-tipadas\typescript-para-javascript\filebot\A",
"creationDate": ""
}

# Ignorar pastas/arquivos com base no nome

{
"from": "C:\Users\gilgi\OneDrive\Documentos\models\estudos\linguagens-tipadas\typescript-para-javascript\filebot\B",
"to": "C:\Users\gilgi\OneDrive\Documentos\models\estudos\linguagens-tipadas\typescript-para-javascript\filebot\A",
"extension": [".js"],
"ignore": [
"scripts.js",
"scripts.ts",
"typescript",
]
}
