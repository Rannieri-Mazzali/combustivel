# 🚀 Guia de Deploy - FleetFuel no Vercel

## ✅ Status de Correção

Todos os problemas foram corrigidos:

- ✅ Firebase config atualizada (remova as credenciais DEMO)
- ✅ EmailJS removido (funções simplificadas)
- ✅ Função PDF removida (código limpo)
- ✅ Auto-login do usuário demo removido
- ✅ Todos os eventos de formulário funcionando
- ✅ Caminhos de arquivos corrigidos
- ✅ Estrutura otimizada para Vercel

## 📋 Pré-requisitos

1. ✅ Conta no Firebase (https://console.firebase.google.com)
2. ✅ Conta no Vercel (https://vercel.com)
3. ✅ Conta no GitHub
4. ✅ Projeto enviado para GitHub

## 🔧 Passo 1: Configurar Firebase

### 1.1 Criar Projeto Firebase
```
1. Acesse Firebase Console
2. Novo Projeto > "fleetfuel-app"
3. Desabilite Google Analytics
4. Criar
```

### 1.2 Ativar Autenticação
```
Firebase > Autenticação > Configurar Método de Login
✓ Email/Senha > Ativar
```

### 1.3 Criar Firestore Database
```
Firebase > Firestore Database > Novo Banco de Dados
Modo: Produção
Região: us-central1 (ou sua região)
Criar
```

### 1.4 Copiar Credenciais
```
Projeto > ⚙️ Configurações do Projeto > Seu App (web)
Copie:
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "..."
}
```

### 1.5 Editar `public/src/js/firebase-config.js`
Substitua os valores de firebaseConfig com suas credenciais reais

## 🚀 Passo 2: Deploy no Vercel

### Opção A: Deploy via CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel

# Siga as instruções interativas
```

### Opção B: Deploy via GitHub

```bash
# 1. Fazer push para GitHub
git add .
git commit -m "FleetFuel - Versão corrigida"
git push origin main

# 2. Ir para vercel.com
# 3. New Project
# 4. Selecionar repositório
# 5. Deploy
```

## 🔐 Configurar Regras de Segurança do Firestore

1. Firebase Console > Firestore Database > Regras
2. Substitua todo conteúdo por:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários: apenas podem acessar seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Veículos: apenas o dono pode acessar
    match /vehicles/{vehicleId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    // Abastecimentos: apenas o dono pode acessar
    match /refuel_records/{recordId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Publicar

## ✅ Teste de Funcionalidades

Após o deploy, teste:

- [ ] **Login/Registro**: Criar nova conta
- [ ] **Dashboard**: Visualizar estatísticas
- [ ] **Adicionar Veículo**: Cadastrar novo caminhão
- [ ] **Registrar Abastecimento**: Registrar novo abastecimento
- [ ] **Ver Histórico**: Visualizar registros
- [ ] **Logout**: Fazer logout

## 📊 Estrutura do App

```
FleetFuel/
├── 📄 index.html (Login/Registro)
├── 📄 dashboard.html (Registrar abastecimento)
├── 📄 vehicles.html (Gerenciar veículos)
├── 📄 history.html (Ver histórico)
├── 📄 fuel-depot.html (Depósito)
└── 📂 public/src/
    ├── css/styles.css
    └── js/
        ├── firebase-config.js
        ├── modules/
        │   ├── auth.js
        │   ├── vehicle.js
        │   ├── refuel.js
        │   ├── email.js
        │   └── utils.js
        └── pages/
            ├── login.js
            ├── dashboard.js
            ├── vehicles.js
            └── history.js
```

## 🔗 URLs Após Deploy

- Página de Login: `https://seu-app.vercel.app/`
- Dashboard: `https://seu-app.vercel.app/dashboard.html`
- Veículos: `https://seu-app.vercel.app/vehicles.html`
- Histórico: `https://seu-app.vercel.app/history.html`

## 🐛 Troubleshooting

### Erro: "Firebase SDK não carregou"
- Verificar conexão com internet
- Limpar cache (Ctrl+F5)

### Erro: "Permissão negada"
- Verificar regras do Firestore
- Usar as regras fornecidas acima

### Erro: "Autenticação falhou"
- Verificar `firebaseConfig` está correto
- Confirmar que a autenticação está ativada no Firebase

### App não carrega após login
- Verificar console do navegador (F12)
- Verificar Firestore Database está criado

## 📱 Responsive

O app é totalmente responsivo:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## ⚡ Performance

- Carregamento rápido (< 2s)
- Cache offline
- Otimizado para mobile
- Sem dependências pesadas

## 📞 Suporte

Documentação: `/SETUP.md`
Código-fonte: `/src/`

---

**FleetFuel está pronto para usar! 🚀**
