# 📂 Organizador de Arquivos Automático

## 🎯 Regras de Negócio

1. **Monitoramento em Tempo Real**: O aplicativo deve observar pastas específicas e reorganizar arquivos automaticamente conforme as regras definidas.
2. **Organização por Critérios**: Os arquivos podem ser organizados por:
   - Tipo (PDFs, imagens, vídeos, etc.).
   - Data de criação/modificação.
   - Nome ou padrões específicos.
3. **Personalização pelo Usuário**: O usuário deve poder definir regras personalizadas para cada pasta.
4. **Ações Automatizadas**: Além de mover arquivos, o app pode renomeá-los ou excluir duplicatas, conforme configuração.
5. **Registro de Ações**: Manter um histórico das movimentações para fácil recuperação.
6. **Modo Manual e Automático**: O usuário pode optar por organizar arquivos manualmente ou ativar a automação.
7. **Proteção contra Erros**: Arquivos importantes podem ser marcados como protegidos para evitar movimentações erradas.

---

## 🔧 Requisitos Funcionais

✅ Interface intuitiva para selecionar pastas e definir regras.  
✅ Suporte a múltiplas pastas monitoradas simultaneamente.  
✅ Opção para desfazer a última ação.  
✅ Execução em segundo plano para não interferir na experiência do usuário.  
✅ Logs de ações realizadas.  
✅ Configuração de exceções (arquivos que não devem ser movidos).

---

## 🖥 Requisitos Técnicos

🔹 **Stack principal:** Electron.js + Node.js  
🔹 **Bibliotecas sugeridas:**

- `fs-extra` → Para manipulação de arquivos/pastas.
- `chokidar` → Para monitoramento de arquivos em tempo real.
- `electron-store` → Para salvar configurações do usuário.
- `log4js` → Para gerar logs de ações.
- `sqlite3` ou `lowdb` → Para armazenar regras definidas pelo usuário.
