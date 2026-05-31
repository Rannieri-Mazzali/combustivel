# 🚀 FleetFuel - Guia de Setup e Deploy

## ⚙️ Configuração Inicial

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar Projeto"
3. Nome do projeto: `fleetfuel-app`
4. Selecione sua região
5. Clique em "Criar Projeto"

### 2. Configurar Autenticação Firebase

1. No painel do Firebase, vá para **Autenticação**
2. Clique em **Configurar método de login**
3. Selecione **Email/Senha**
4. Ative e salve

### 3. Configurar Firestore

1. Vá para **Firestore Database**
2. Clique em **Criar Banco de Dados**
3. Modo: **Iniciar no modo produção**
4. Localização: Selecione sua região mais próxima
5. Clique em **Criar**

### 4. Configurar Regras de Segurança Firestore

Na seção **Firestore**, vá para a aba **Regras** e substitua o conteúdo por:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      match /vehicles/{vehicleId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    match /vehicles/{vehicleId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    match /refuel_records/{recordId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### 5. Obter Credenciais Firebase

1. Clique na engrenagem (⚙️) > **Configurações do Projeto**
2. Vá para **Aplicativos**
3. Selecione/Crie um app da web
4. Copie o objeto `firebaseConfig`

### 6. Atualizar Credenciais no App

Edite o arquivo `src/js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "Seu_API_Key_aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## 🌐 Deploy no Vercel

### 1. Preparar Repositório Git

```bash
git add .
git commit -m "Initial commit - FleetFuel app"
git push origin main
```

### 2. Deploy no Vercel

#### Opção A: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

Siga as instruções interativas.

#### Opção B: Via GitHub

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **New Project**
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente (se necessário)
5. Clique em **Deploy**

### 3. Variáveis de Ambiente (opcional)

Se quiser usar variáveis de ambiente, crie um arquivo `.env.local`:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
```

## ✅ Testar a Aplicação

1. Acesse seu domínio Vercel
2. Crie uma conta nova
3. Teste as funcionalidades:
   - ✅ Adicionar veículo
   - ✅ Registrar abastecimento
   - ✅ Ver histórico
   - ✅ Logout

## 🐛 Troubleshooting

### Erro: "Firebase SDK não carregou"
- Verifique se está com internet
- Limpe o cache do navegador (Ctrl+F5)

### Erro: "Projeto não encontrado"
- Verifique a configuração do `firebaseConfig`
- Confirme que o projeto existe no Firebase Console

### Erro: "Permissão negada ao acessar Firestore"
- Verifique as regras de segurança do Firestore
- Use as regras fornecidas acima

## 📝 Usuários de Teste

Para testar rápido, crie usuários no Firebase Console:

1. Autenticação > Usuários
2. Clique em "Adicionar usuário"
3. Email: `teste@example.com`
4. Senha: `Teste123456`

## 🎯 Funcionalidades Disponíveis

✅ **Autenticação**
- Criar conta
- Login
- Logout
- Recuperar senha

✅ **Gestão de Veículos**
- Adicionar veículos
- Editar dados
- Deletar veículos
- Ver lista de veículos

✅ **Registros de Abastecimento**
- Registrar novo abastecimento
- Visualizar histórico
- Estatísticas de consumo
- Filtrar por período

✅ **Interface**
- Design responsivo
- Dark mode
- Notificações em tempo real
- Carregamento otimizado

## 📞 Suporte

Para suporte técnico, verifique:
- Console do navegador (F12)
- Firestore Database no Firebase Console
- Logs de autenticação no Firebase

---

**Pronto para usar!** 🚀
