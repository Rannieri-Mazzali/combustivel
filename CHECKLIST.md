# ✅ Checklist de Configuração - FleetFuel

Use este arquivo para acompanhar o progresso da configuração. Marque com [x] conforme concluir.

## 📋 Fase 1: Preparação Inicial

- [ ] Ter uma conta Google
- [ ] Ter um email para receber notificações (rannieri.mazzali@outlook.com)
- [ ] Navegador web moderno instalado
- [ ] Conexão estável com internet

## 🔧 Fase 2: Configurar Firebase

### Criar Projeto
- [ ] Acessar https://console.firebase.google.com
- [ ] Clique em "Criar Projeto"
- [ ] Nome do projeto: **FleetFuel**
- [ ] Selecionar região (us-central1 recomendado)
- [ ] Ativar Google Analytics (opcional)
- [ ] Clique em "Criar Projeto"
- [ ] Aguardar conclusão

### Ativar Autenticação
- [ ] Ir para **Authentication** no menu esquerdo
- [ ] Clique em **Get Started**
- [ ] Selecionar **Email/Password**
- [ ] Ativar a opção **Email/Password**
- [ ] Clique em **Save**

### Criar Firestore Database
- [ ] Ir para **Firestore Database** no menu
- [ ] Clique em **Create Database**
- [ ] Selecionar região mais próxima
- [ ] Escolher **Start in test mode** (para desenvolvimento)
- [ ] Clique em **Create**
- [ ] Aguardar criação do banco

### Obter Credenciais
- [ ] Clique no ícone de engrenagem (⚙️) no canto superior
- [ ] Selecione **Project Settings**
- [ ] Clique na aba **Apps**
- [ ] Clique em **Add app** (ícone </> para Web)
- [ ] Nome: **FleetFuel Web App**
- [ ] Clique em **Register App**
- [ ] Copiar o código Firebase Config
- [ ] Guardar em um lugar seguro

### Adicionar Credenciais ao Projeto
- [ ] Abrir arquivo: `src/js/firebase-config.js`
- [ ] Localizar objeto `firebaseConfig` vazio
- [ ] Substituir com suas credenciais
- [ ] Salvar arquivo
- [ ] ✅ Verificar se não há erros no navegador (F12)

## 📧 Fase 3: Configurar EmailJS

### Criar Conta
- [ ] Acessar https://www.emailjs.com
- [ ] Clique em **Sign Up**
- [ ] Complete o registro (gratuito)
- [ ] Confirmar email

### Obter Public Key
- [ ] Fazer login no EmailJS
- [ ] Ir para **Account > General**
- [ ] Copiar sua **Public Key**
- [ ] Guardar em um lugar seguro

### Configurar Serviço de Email
- [ ] Ir para **Email Services**
- [ ] Clique em **Add Service**
- [ ] Escolher seu provedor (Gmail, Outlook, Yahoo, etc.)
- [ ] Clique em **Connect Account**
- [ ] Fazer login com sua conta de email
- [ ] Autorizar o acesso
- [ ] Copiar o **Service ID**
- [ ] Guardar em um lugar seguro

### Criar Email Template
- [ ] Ir para **Email Templates**
- [ ] Clique em **Create New Template**
- [ ] Nome: **refuel_notification**
- [ ] Subject: `Abastecimento Registrado - {{vehicle_plate}}`
- [ ] No corpo do email, adicionar as variáveis desejadas:
  - `{{user_name}}`
  - `{{vehicle_plate}}`
  - `{{km}}`
  - `{{liters}}`
  - `{{date}}`
  - `{{time}}`
  - `{{cost}}`
  - `{{fuel_type}}`
  - `{{location}}`
- [ ] Clique em **Save**
- [ ] Copiar o **Template ID**
- [ ] Guardar em um lugar seguro

### Adicionar Credenciais ao Projeto
- [ ] Abrir arquivo: `src/js/modules/email.js`
- [ ] Localizar linha: `emailjs.init("seu_public_key_aqui")`
- [ ] Substituir: `seu_public_key_aqui` → Sua Public Key do EmailJS
- [ ] Localizar linha: `.send("seu_service_id"`
- [ ] Substituir: `seu_service_id` → Seu Service ID
- [ ] Substituir: `seu_template_id` → Seu Template ID
- [ ] Salvar arquivo
- [ ] ✅ Verificar se não há erros no navegador

## 🌐 Fase 4: Testar Localmente

### Escolher um Servidor Web

**Opção A: Live Server (VS Code)**
- [ ] Instalar extensão Live Server
- [ ] Abrir pasta do projeto em VS Code
- [ ] Clique direito em `public/index.html`
- [ ] Selecionar "Open with Live Server"
- [ ] Navegador abrirá em `http://localhost:5500`

**Opção B: Python**
- [ ] Ter Python instalado
- [ ] Abrir terminal/cmd
- [ ] Navegar até pasta: `cd caminho/para/public`
- [ ] Executar: `python -m http.server 8000`
- [ ] Acessar: `http://localhost:8000`

**Opção C: Node.js**
- [ ] Ter Node.js instalado
- [ ] Abrir terminal/cmd
- [ ] Navegar até pasta: `cd caminho/para/public`
- [ ] Executar: `npx http-server`
- [ ] Acessar URL exibida no terminal

### Teste de Funcionalidades
- [ ] Página carrega sem erros
- [ ] Abrir console (F12) e verificar erros
- [ ] Criar nova conta com sucesso
- [ ] Fazer login com a conta
- [ ] Adicionar novo veículo
- [ ] Registrar um abastecimento
- [ ] ✅ Verificar se email foi recebido
- [ ] Acessar histórico
- [ ] Editar um registro
- [ ] Deletar um registro
- [ ] Exportar para CSV
- [ ] Fazer logout

## 🔒 Fase 5: Configurar Segurança (Produção)

### Adicionar Regras de Firestore
- [ ] No Firebase Console, ir para **Firestore Database**
- [ ] Clique na aba **Rules**
- [ ] Substituir as regras padrão pelas do arquivo `FIRESTORE_RULES.md`
- [ ] Clique em **Publish**
- [ ] ✅ Regras aplicadas

### Testar as Regras
- [ ] Tentar fazer login com conta diferente
- [ ] Verifique que outro usuário não vê seus dados
- [ ] Tentar fazer requisições diretas (DevTools)
- [ ] Verificar que são negadas

## 🚀 Fase 6: Deploy (Opcional)

### Preparar para Deploy
- [ ] Instalar Firebase CLI: `npm install -g firebase-tools`
- [ ] Fazer login: `firebase login`
- [ ] Inicializar projeto: `firebase init hosting`
- [ ] Usar pasta `public`
- [ ] Configurar para SPA (Single Page App): **Não** para rewrite
- [ ] Editar `.firebaserc` com seu Project ID

### Fazer Deploy
- [ ] Executar: `firebase deploy`
- [ ] Copiar a URL gerada
- [ ] Acessar a URL e testar
- [ ] Compartilhar link com usuários: `https://seu-projeto.web.app`

## 🔍 Fase 7: Verificação Final

### Segurança
- [ ] Senhas não são visíveis no código
- [ ] Credenciais não são commitadas no Git
- [ ] HTTPS ativado em produção
- [ ] Firebase rules estão restritivas

### Performance
- [ ] Página carrega em menos de 3 segundos
- [ ] Sem erros no console
- [ ] Responsivo em mobile
- [ ] Imagens otimizadas (não há)

### Funcionalidades
- [ ] Autenticação funciona
- [ ] Dados salvam na nuvem
- [ ] Email é enviado
- [ ] Histórico é mantido
- [ ] Exportação funciona

### Documentação
- [ ] README.md revisado
- [ ] FAQ.md disponível
- [ ] FIRESTORE_RULES.md atualizado
- [ ] Usuários têm guia de uso

## 📝 Anotações Adicionais

Espaço para suas anotações:

```
Projeto ID Firebase:
_____________________________

Service ID EmailJS:
_____________________________

Template ID EmailJS:
_____________________________

URL de Deploy:
_____________________________

Email de Notificação:
_____________________________

Data de Conclusão:
_____________________________

Observações:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

## 🎉 Fase Final

- [ ] Todos os itens da lista foram concluídos
- [ ] Projeto testado em múltiplos navegadores
- [ ] Projeto testado em múltiplos dispositivos
- [ ] Documentação revisada
- [ ] Usuários informados
- [ ] **✅ PROJETO PRONTO PARA USO!**

---

## 💡 Dicas Importantes

1. **Segurança**: Nunca compartilhe suas credenciais do Firebase
2. **Backup**: Faça backup do arquivo de configuração
3. **Monitoramento**: Verifique regularmente o uso do Firebase
4. **Atualizações**: Mantenha as bibliotecas atualizadas
5. **Suporte**: Consulte a documentação quando tiver dúvidas

---

**Última atualização:** 2026-05-17  
**Versão:** 1.0.0

**Precisa de ajuda?** Veja `README.md` ou `FAQ.md`
