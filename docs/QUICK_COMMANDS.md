# 🚀 COMANDOS RÁPIDOS - Deploy Vercel

## ⚡ Executar em PowerShell ou CMD (Windows)

### Passo 1: Setup Inicial
```powershell
# Abra PowerShell ou CMD na pasta do projeto
cd c:\combustivel

# Execute o script de setup (Windows)
.\setup-vercel.bat

# Ou em PowerShell, execute manualmente:
git init
npm install
git add .
git commit -m "Initial commit - FleetFuel App"
```

### Passo 2: Criar Repositório no GitHub
```
1. Acesse: https://github.com/new
2. Nome: combustivel
3. Descrição: FleetFuel - Sistema de Gestão de Abastecimento
4. Deixe como Public
5. Clique: Create repository
```

### Passo 3: Push para GitHub
```powershell
# Substitua SEU_USUARIO pelo seu usuário GitHub
git remote add origin https://github.com/SEU_USUARIO/combustivel.git
git branch -M main
git push -u origin main

# Será pedido seu usuário/senha ou token do GitHub
```

### Passo 4: Deploy no Vercel

**Opção A: Via Web (Mais Fácil)**
```
1. Acesse: https://vercel.com/dashboard
2. Clique: Add New → Project
3. Clique: Import Git Repository
4. Autorize GitHub e selecione: combustivel
5. Clique: Import
6. Adicione variáveis de ambiente (veja abaixo)
7. Clique: Deploy
```

**Opção B: Via CLI**
```powershell
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Seguir o assistente interativo

# Configurar variáveis
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_EMAILJS_PUBLIC_KEY
vercel env add VITE_EMAILJS_SERVICE_ID
vercel env add VITE_EMAILJS_TEMPLATE_ID

# Deploy em produção
vercel --prod
```

---

## 📋 Variáveis de Ambiente

### Criando .env.local (para desenvolvimento)
```
VITE_FIREBASE_API_KEY=AIza...sua_chave_completa
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_EMAILJS_PUBLIC_KEY=sua_public_key_emailjs
VITE_EMAILJS_SERVICE_ID=service_xyz
VITE_EMAILJS_TEMPLATE_ID=template_xyz
```

### Onde obter as credenciais:

**Firebase:**
```
1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Clique: ⚙️ Settings → Project Settings
4. Vá para: Your apps → Web (</> ícone)
5. Copie o firebaseConfig
```

**EmailJS:**
```
1. Acesse: https://www.emailjs.com/dashboard
2. Clique: Integration
3. Copie: Your Public Key
4. Vá para: Email Services
5. Copie: Service ID e Template ID
```

---

## 🔍 Comandos Úteis Pós-Deploy

```powershell
# Ver logs do deploy
vercel logs

# Ver logs em tempo real
vercel logs --follow

# Listar deploys anteriores
vercel list

# Redeploy rápido
vercel redeploy

# Baixar variáveis de ambiente localmente
vercel env pull

# Remover uma variável
vercel env rm VITE_FIREBASE_API_KEY

# Ver status do projeto
vercel status
```

---

## 🧪 Testar Após Deploy

```
1. Acesse a URL do Vercel (ex: https://seu-projeto.vercel.app)
2. Teste fluxos:
   ✅ Dashboard carrega
   ✅ Adicione um veículo
   ✅ Registre um abastecimento
   ✅ Verifique histórico
   ✅ Receba email de confirmação
```

---

## 🔄 Atualizar Código

```powershell
# Fazer alterações nos arquivos...

# Adicionar mudanças
git add .

# Commitar
git commit -m "Descrição da mudança"

# Push (Vercel fará deploy automático!)
git push origin main
```

---

## ❌ Solução de Problemas

### Erro: "fatal: 'origin' does not appear to be a 'git' repository"
```powershell
# Solução: Adicione origin de novo
git remote add origin https://github.com/SEU_USUARIO/combustivel.git
```

### Erro: "firebase is not defined"
```
Solução: Verifique se os scripts do Firebase estão carregando
         em public/index.html e public/dashboard.html
```

### Erro: "Module not found"
```powershell
# Solução: Reinstale dependências
rm -r node_modules package-lock.json
npm install
```

### "Página em branco" após deploy
```
Solução 1: Limpe cache (Ctrl+Shift+Del) e recarregue
Solução 2: Verifique console do navegador (F12)
Solução 3: Verifique logs do Vercel: vercel logs
```

---

## 📊 Monitorar Performance

```
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto: combustivel
3. Vá para: Analytics
4. Veja:
   - Tempo de resposta
   - Bandwidth usado
   - Erros
   - Visitas
```

---

## 💾 Dicas Finais

✅ **Sempre faça commit antes de push**
```powershell
git status              # Ver arquivos modificados
git add .               # Adicionar tudo
git commit -m "msg"     # Commitar
git push origin main    # Push
```

✅ **Use .gitignore para proteger dados sensíveis**
```
.env.local
.env.production.local
node_modules/
.vercel/
```

✅ **Teste localmente antes de fazer push**
```powershell
# Rodar servidor local
npm start
# Acesse http://localhost:8000
```

---

## 📞 Links Úteis

- Vercel: https://vercel.com/docs
- Firebase: https://firebase.google.com/docs
- EmailJS: https://www.emailjs.com/docs
- GitHub: https://docs.github.com

---

## 🎯 Resumo Rápido (Copie e Cole)

```powershell
# 1. Setup
cd c:\combustivel
git init
npm install
git add .
git commit -m "Initial commit"

# 2. GitHub
# Vá para https://github.com/new e crie repo

# 3. Push
git remote add origin https://github.com/SEU_USUARIO/combustivel.git
git branch -M main
git push -u origin main

# 4. Vercel
# Vá para https://vercel.com/new
# Autorize GitHub
# Selecione combustivel
# Adicione variáveis de ambiente
# Deploy!

# ✅ Pronto! 🎉
```

---

**Para mais informações detalhadas, veja: DEPLOYMENT.md**
