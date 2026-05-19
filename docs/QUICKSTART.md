# 🚀 Guia de Início Rápido - FleetFuel

## ⚡ Começar em 5 Minutos

### 1️⃣ Obter Credenciais Firebase (3 min)
- Vá para https://console.firebase.google.com
- Crie um novo projeto chamado "FleetFuel"
- Ative Authentication > Email/Password
- Crie Firestore Database em modo teste
- Copie suas credenciais em Project Settings

### 2️⃣ Atualizar Configuração (1 min)
- Abra `src/js/firebase-config.js`
- Cole suas credenciais do Firebase
- Salve o arquivo

### 3️⃣ Configurar Email (1 min - Opcional)
- Vá para https://www.emailjs.com e registre
- Configure seu email service
- Atualize `src/js/modules/email.js` com suas credenciais

### 4️⃣ Executar Localmente
```bash
cd public
python -m http.server 8000
# ou use Live Server no VS Code
```

### 5️⃣ Testar
- Acesse http://localhost:8000
- Crie uma conta
- Teste o formulário de abastecimento

✅ **Pronto!**

---

## 📚 Próximos Passos

| Etapa | O que fazer | Tempo |
|-------|-----------|-------|
| 📖 Leitura | Ler README.md completo | 10 min |
| 🔐 Segurança | Adicionar regras Firestore | 5 min |
| 🌐 Produção | Fazer deploy Firebase Hosting | 10 min |
| 📱 Mobile | Testar no smartphone | 5 min |

---

## ❓ Precisa de Ajuda?

| Problema | Solução |
|----------|---------|
| Firebase error | Verifique credenciais em firebase-config.js |
| Email não chega | Confira configuração EmailJS |
| Página não carrega | Limpe cache (Ctrl+Shift+Del) |
| Dados não salvam | Verifique Firestore está em modo teste |

---

## 📞 Documentação

- 📖 [README.md](README.md) - Documentação completa
- ❓ [FAQ.md](FAQ.md) - Perguntas frequentes
- 🏗️ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Estrutura
- ✅ [CHECKLIST.md](CHECKLIST.md) - Guia passo a passo
- 🔐 [FIRESTORE_RULES.md](FIRESTORE_RULES.md) - Regras de segurança
- 🎯 [SETUP.html](SETUP.html) - Guia visual HTML

---

## 🎯 Seu Primeiro Abastecimento

1. **Login/Registro** → Crie sua conta
2. **Dashboard** → Novo abastecimento
3. **Veículos** → Adicione sua frota
4. **Dashboard** → Registre um abastecimento
5. **Histórico** → Veja os registros

✨ **Pronto para gerenciar sua frota!**

---

**Tempo total de setup: ~20 minutos**

Comece com [README.md](README.md)
