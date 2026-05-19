# ❓ Perguntas Frequentes - FleetFuel

## 🔐 Autenticação

### P: Esqueci minha senha. O que fazer?
**R:** Na página de login, clique em "Esqueceu a senha?" e insira seu email. Você receberá um link de recuperação para redefinir sua senha.

### P: Posso mudar meu email depois?
**R:** Atualmente, não há uma função para mudar email. Você pode criar uma nova conta com o novo email.

### P: O meu email é seguro?
**R:** Sim! Usamos Firebase Auth que é seguro e criptografado. Suas senhas nunca são armazenadas em texto plano.

---

## 🚚 Veículos

### P: Quantos veículos posso registrar?
**R:** Não há limite! Você pode registrar quantos veículos precisar na sua frota.

### P: Como editar dados de um veículo?
**R:** Vá para "Veículos", clique em "Editar" no veículo desejado e altere os dados.

### P: O que acontece se eu deletar um veículo?
**R:** O veículo é desativado (não deletado imediatamente). Você pode reativar later ou ter sua conta (contate o suporte).

### P: Posso ter dois veículos com a mesma placa?
**R:** Não, o sistema não permite duplicação de placas. Cada placa deve ser única.

---

## ⛽ Abastecimento

### P: Quais campos são obrigatórios?
**R:** KM, Litros, Data e Hora são obrigatórios. Os outros campos são opcionais.

### P: Preciso preencher na ordem?
**R:** Não! Você pode preencher os campos em qualquer ordem.

### P: Posso editar um abastecimento depois?
**R:** Sim! Vá para "Histórico", clique em "Editar" e altere os dados.

### P: Um abastecimento foi registrado por engano. Posso deletar?
**R:** Sim! Vá para "Histórico", clique em "Deletar" na linha do abastecimento.

### P: O email é enviado automaticamente?
**R:** Sim! Cada abastecimento registrado envia um email automático com os detalhes.

---

## 📊 Histórico e Relatórios

### P: Como filtrar os registros?
**R:** Use os filtros no topo da página "Histórico":
- Por veículo específico
- Por intervalo de datas
- Combinação dos dois

### P: Posso exportar os dados?
**R:** Sim! Clique em "Exportar para CSV" e os dados serão salvos em um arquivo.

### P: Como enviar um relatório por email?
**R:** Clique em "Enviar Relatório" no histórico. O relatório com todos os dados filtrados será enviado.

### P: Quantos registros posso visualizar?
**R:** A página exibe 10 registros por vez. Use a paginação para navegar.

### P: Os dados antigos são mantidos?
**R:** Sim! Todos os dados históricos são mantidos indefinidamente na nuvem.

---

## 📧 Email

### P: Aonde os emails são enviados?
**R:** Os emails são enviados para: **rannieri.mazzali@outlook.com**

### P: Posso mudar o email de destino?
**R:** Sim! Você pode configurar um novo email editando o arquivo `src/js/modules/email.js` e alterando o endereço.

### P: Os emails não estão chegando
**R:** 
- Verifique a pasta de SPAM/Lixo eletrônico
- Confira se as credenciais do EmailJS estão corretas
- Abra o console (F12) e procure por erros

### P: Posso customizar o template de email?
**R:** Sim! Edite o template no dashboard do EmailJS e configure as variáveis.

---

## 💾 Dados

### P: Os dados estão seguros?
**R:** Sim! Usamos Firebase que garante:
- Criptografia em trânsito (HTTPS)
- Backups automáticos
- Autenticação forte

### P: Posso acessar meus dados de outro dispositivo?
**R:** Sim! Basta fazer login com a mesma conta. Seus dados sincronizam automaticamente.

### P: Quanto espaço tenho disponível?
**R:** O Firebase oferece 1GB grátis de armazenamento. Isso é suficiente para milhares de registros.

### P: Os dados são perdidos se a internet cair?
**R:** Não! Os dados já foram sincronizados com a nuvem. Quando a conexão voltar, tudo funcionará normal.

---

## 📱 Interface e Uso

### P: Funciona no celular?
**R:** Sim! A interface é responsiva e funciona perfeitamente em smartphones e tablets.

### P: Posso usar em vários dispositivos?
**R:** Sim! Faça login em qualquer dispositivo e tenha acesso aos mesmos dados.

### P: Como fazer logout?
**R:** Clique no menu do perfil (canto superior direito) e selecione "Sair".

### P: A interface funciona offline?
**R:** Não. Você precisa de conexão com internet para usar todas as funcionalidades.

---

## 🆘 Problemas Técnicos

### P: A página não carrega
**R:**
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Tente em outro navegador
- Verifique a conexão com internet
- Abra o console (F12) para verificar erros

### P: Os dados não aparecem
**R:**
- Faça logout e login novamente
- Limpe o cache do navegador
- Verifique se as credenciais do Firebase estão corretas

### P: Um botão não funciona
**R:**
- Recarregue a página (F5)
- Tente em outro navegador
- Verifique o console para erros

### P: O formulário não envia
**R:**
- Verifique se todos os campos obrigatórios estão preenchidos
- Confira se há internet
- Veja se há mensagens de erro na tela

---

## 🚀 Performance e Otimização

### P: Por que a página está lenta?
**R:**
- Verifique sua conexão com internet
- Feche abas desnecessárias do navegador
- Limpe o cache
- Tente em outro navegador

### P: Muitos registros deixa lento?
**R:** Não! A paginação garante que sempre carregue apenas 10 registros por vez.

### P: Posso melhorar a performance?
**R:**
- Use um navegador moderno (Chrome, Firefox)
- Mantenha a conexão estável
- Limpe o cache regularmente

---

## 💡 Dicas e Truques

### Dica 1: Atalhos do Teclado
- `Ctrl+Shift+Del` - Limpar cache
- `F5` - Recarregar página
- `F12` - Abrir console (para debug)

### Dica 2: Organizar Dados
- Use observações para marcar informações importantes
- Filtre por data para análises periódicas
- Exporte regularmente em CSV para backup

### Dica 3: Produtividade
- Pré-preencha dados que se repetem
- Use o navegador para salvar dados (AutoFill)
- Sincronize em todos seus dispositivos

### Dica 4: Segurança
- Logout quando usar PC compartilhado
- Mantenha sua senha segura
- Não compartilhe sua conta com outros

---

## 📞 Suporte

### Precisa de Ajuda?

1. **Verificar este FAQ** - Pode ter a resposta
2. **Consultar README.md** - Documentação completa
3. **Abrir Console (F12)** - Procure por mensagens de erro
4. **Testar em outro navegador** - Pode ser compatibilidade

### Informações Úteis para Suporte
- Seu sistema operacional
- Navegador e versão
- Descrição detalhada do problema
- Passos para reproduzir o erro
- Screenshot (se possível)

---

## 🎓 Aprenda Mais

- [Firebase Documentation](https://firebase.google.com/docs)
- [EmailJS Docs](https://www.emailjs.com/docs/)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [REST API Best Practices](https://restfulapi.net/)

---

**Última atualização:** 2026-05-17
**Versão:** 1.0.0
