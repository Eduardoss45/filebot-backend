** Arquivos **

# Mover

Para mover arquivos é necessario o caminho + nome do arquivo, tanto o caminho até o arquivo e para onde ele será movido.

exemplo:
{
"from": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\1\teste.txt",
"to": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\2\teste.txt"
}

# Renomear

Para renomear arquivos é necessario o caminho + nome do arquivo e o caminho + novo nome do arquivo.

exemplo:
{
"oldName": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\1\teste.txt",
"newName": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\1\newTeste.txt"
}

# Deletar

Para deletar arquivos é necessario o caminho + nome do arquivo.

exemplo:
{
"fileName": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\1\newTeste.txt"
}

# Criar

Para criar arquivos é necessario o caminho + nome + formato do arquivo.

exemplo:
{
"fileNameAndFormat": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\teste.txt"
}

** Pastas **

# Criar

Para criar pastas é necessario o caminho + nome da pasta.

exemplo:
{
"folderName": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\3"
}

# Renomear

Para renomear pastas é necessario o caminho + nome da pasta e o caminho + novo nome da pasta.

exemplo:
{
"oldName": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\3",
"newName": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\4"
}

# Mover

Para mover pastas é necessario o caminho + nome da pasta, tanto o caminho até a pasta e para onde ela será movida.

exemplo:
{
"from": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\3",
"to": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\1\3"
}

# Deletar

Para deletar pastas é necessario o caminho + nome da pasta.

exemplo:
{
"folderName": "C:\Users\gilgi\OneDrive\Documentos\testes-filebot-api\3"
}

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
