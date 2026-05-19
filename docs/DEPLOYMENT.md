# 🚀 Guia de Deployment - FleetFuel no Vercel

## ✅ Pré-requisitos

1. **Conta Vercel**: Crie em https://vercel.com/signup
2. **Conta GitHub**: Crie em https://github.com/signup (para conectar o repo)
3. **Git instalado**: https://git-scm.com/downloads
4. **Node.js instalado**: https://nodejs.org/ (v18+)

---

## 📋 Passo 1: Preparar o Repositório Git

### 1.1 Inicializar Git (se não tiver)
```bash
cd c:\combustivel
git init
```

### 1.2 Adicionar arquivo `.env.local`
Crie um arquivo `.env.local` na raiz do projeto com suas credenciais:
```
VITE_FIREBASE_API_KEY=sua_chave_api_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=1:seu_app_id:web:seu_web_app_id
VITE_EMAILJS_PUBLIC_KEY=sua_chave_emailjs
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
```

**⚠️ IMPORTANTE**: Não faça commit de `.env.local` - isso é apenas para desenvolvimento local!

### 1.3 Fazer commit dos arquivos
```bash
git add .
git commit -m "Initial commit - FleetFuel App"
```

---

## 🌐 Passo 2: Criar Repositório no GitHub

### 2.1 Criar novo repositório
1. Acesse https://github.com/new
2. Nome: `combustivel` (ou seu nome preferido)
3. Descrição: "FleetFuel - Sistema de Gestão de Abastecimento"
4. Deixe como **Public** (recomendado para Vercel gratuito)
5. Clique em **Create repository**

### 2.2 Push do código para GitHub
```bash
git remote add origin https://github.com/SEU_USUARIO/combustivel.git
git branch -M main
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu usuário GitHub.

---

## 🚀 Passo 3: Deploy no Vercel

### Opção A: Via Web (Mais Fácil) ⭐ **RECOMENDADO**

1. Acesse https://vercel.com/dashboard
2. Clique em **"Add New..."** → **"Project"**
3. Selecione **"Import Git Repository"**
4. Conecte sua conta GitHub (autorize Vercel)
5. Selecione o repositório `combustivel`
6. Clique em **"Import"**

**Configure as variáveis de ambiente:**
1. Em **Environment Variables**, adicione todas as variáveis do `.env.local`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`

2. Clique em **"Deploy"**
3. Aguarde (~2-3 minutos)

**✅ Pronto! Seu app estará live em uma URL como: `https://seu-projeto.vercel.app`**

---

### Opção B: Via CLI (Para Controle Avançado)

#### 3.1 Instalar Vercel CLI
```bash
npm install -g vercel
```

#### 3.2 Fazer login
```bash
vercel login
```

#### 3.3 Deploy do projeto
```bash
cd c:\combustivel
vercel
```

#### 3.4 Responder as perguntas
- **Which scope should contain your project?** → Seu nome
- **Link to existing project?** → No
- **What's your project's name?** → combustivel
- **In which directory is your code located?** → ./
- **Want to modify vercel.json?** → No

#### 3.5 Configurar variáveis de ambiente
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_EMAILJS_PUBLIC_KEY
vercel env add VITE_EMAILJS_SERVICE_ID
vercel env add VITE_EMAILJS_TEMPLATE_ID
```

#### 3.6 Fazer deploy
```bash
vercel --prod
```

---

## 🔐 Configurar Variáveis de Ambiente no Vercel

### Via Dashboard Vercel:
1. Acesse seu projeto em https://vercel.com/dashboard
2. Clique no projeto **combustivel**
3. Vá até **Settings** → **Environment Variables**
4. Clique em **"Add New"**
5. Preencha:
   - **Name**: Nome da variável (ex: VITE_FIREBASE_API_KEY)
   - **Value**: Seu valor real
   - **Select Environments**: Production, Preview, Development
6. Clique em **"Save"**
7. Repita para todas as variáveis

### ⚠️ Obter suas credenciais:

**Firebase:**
1. Acesse https://console.firebase.google.com
2. Selecione seu projeto
3. Clique em **⚙️ Settings** → **Project Settings**
4. Copie as credenciais do seu app web

**EmailJS:**
1. Acesse https://www.emailjs.com/dashboard
2. Clique em **Integration** (ou copie sua Public Key)
3. Obtenha seu Service ID e Template ID

---

## 🧪 Testar o Deployment

1. Acesse sua URL do Vercel (ex: `https://seu-projeto.vercel.app`)
2. A aplicação deve carregar normalmente
3. Teste os seguintes fluxos:
   - ✅ Entrar no dashboard (demo automático)
   - ✅ Adicionar um veículo
   - ✅ Registrar um abastecimento
   - ✅ Verificar histórico
   - ✅ Receber email de confirmação

---

## 📝 Comandos Úteis

| Comando | O que faz |
|---------|-----------|
| `vercel logs` | Ver logs do deploy |
| `vercel logs --follow` | Logs em tempo real |
| `vercel env pull` | Baixar variáveis local |
| `vercel redeploy` | Fazer redeploy rápido |
| `vercel --prod` | Deploy em produção |

---

## 🛠️ Solução de Problemas

### ❌ Erro: "Firebase is not defined"
**Solução**: Certifique-se de que os scripts Firebase estão carregando em `public/index.html` e `public/dashboard.html`

### ❌ Erro: "EmailJS não está respondendo"
**Solução**: Verifique se as variáveis `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_SERVICE_ID` e `VITE_EMAILJS_TEMPLATE_ID` estão corretas

### ❌ "Página em branco" ou "404"
**Solução**: Isso é normal para SPAs. O `vercel.json` redireciona todas as rotas para `index.html`. Se persistir, verifique:
1. Se `public/index.html` existe
2. Se os arquivos `src/js/` estão sendo servidos corretamente

### ❌ Erro: "Build command failed"
**Solução**: No Vercel, a build já está configurada. Se tiver problema:
1. Vá para **Settings** → **Build & Development Settings**
2. Defina **Build Command**: `npm run build`
3. Defina **Output Directory**: `public`

---

## 🔄 Atualizações Futuras

Para fazer push de atualizações:

```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

Vercel fará deploy automático! 🎉

---

## 📊 Monitorar Performance

1. Acesse https://vercel.com/dashboard/project/combustivel
2. Clique em **"Analytics"** para ver:
   - Tempo de resposta
   - Uso de bandwidth
   - Erros
   - Visitas

---

## 💡 Dicas Extras

### Usar domínio personalizado
1. No dashboard Vercel → **Settings** → **Domains**
2. Adicione seu domínio
3. Configure os DNS records de acordo com instruções

### Ativar HTTPS automático
✅ Vercel faz isso automaticamente! Seu site é servido em HTTPS.

### Backups e Recuperação
Todo commit no GitHub é um backup. Se precisar reverter:
```bash
git revert <commit-hash>
git push origin main
```

---

## 📞 Suporte

- **Documentação Vercel**: https://vercel.com/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **EmailJS Docs**: https://www.emailjs.com/docs

---

## ✅ Checklist Final

- [ ] Repositório Git criado
- [ ] Arquivo `.env.local` configurado (local)
- [ ] Credenciais Firebase corretas
- [ ] Credenciais EmailJS corretas
- [ ] Projeto GitHub criado
- [ ] Vercel conectado ao GitHub
- [ ] Variáveis de ambiente adicionadas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] URL acessível em navegador
- [ ] Todos os fluxos testados

---

**🎉 Parabéns! Seu FleetFuel está na nuvem!** 🚀
