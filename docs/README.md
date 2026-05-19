# FleetFuel - Sistema de Gestão de Abastecimento de Frota

![FleetFuel](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Visão Geral

**FleetFuel** é uma aplicação web responsiva moderna para gerenciar o abastecimento de uma frota de caminhões. Com uma interface profissional e intuitiva, permite registrar, monitorar e analisar dados de abastecimento em tempo real, com sincronização automática na nuvem e envio de notificações por email.

## ✨ Recursos Principais

- ✅ **Autenticação Segura**: Registro e login com Firebase Auth
- ✅ **Gestão de Frota**: Cadastre e gerencie múltiplos veículos
- ✅ **Registro de Abastecimento**: Interface intuitiva para registrar abastecimentos
- ✅ **Histórico Completo**: Visualize e analise todo o histórico de abastecimentos
- ✅ **Sincronização em Nuvem**: Dados salvos automaticamente no Firebase
- ✅ **Notificações por Email**: Confirmação e relatórios enviados automaticamente
- ✅ **Exportação de Dados**: Exporte histórico em CSV
- ✅ **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ✅ **Interface Moderna**: Design profissional com Tailwind CSS
- ✅ **Estatísticas**: Dashboard com gráficos e métricas em tempo real

## 🚀 Começando Rapidamente

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet
- Conta Firebase (grátis em [firebase.google.com](https://firebase.google.com))

### 1️⃣ Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Nome do projeto: `FleetFuel`
4. Siga as instruções até criar o projeto
5. Ative as seguintes funcionalidades:
   - **Authentication**: Email/Password
   - **Firestore Database**: Em modo de teste
   - **Cloud Functions** (opcional, para envio de email automático)

### 2️⃣ Obter Credenciais Firebase

1. No Firebase Console, vá para **Project Settings** (⚙️)
2. Clique em "Seu Aplicativo da Web" (</> ícone)
3. Copie o objeto `firebaseConfig`
4. Abra `src/js/firebase-config.js`
5. Substitua as credenciais:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "1:YOUR_APP_ID:web:YOUR_WEB_APP_ID"
};
```

### 3️⃣ Configurar Email (EmailJS)

1. Acesse [EmailJS](https://www.emailjs.com)
2. Crie uma conta (gratuita)
3. Vá para **Dashboard > Integration**
4. Copie seu **Public Key**
5. Vá para **Email Services**
6. Configure seu serviço de email (Gmail, Outlook, etc.)
7. Crie um **Email Template** com as variáveis:
   - `to_email`
   - `user_name`
   - `user_email`
   - `company`
   - `vehicle_plate`
   - `km`
   - `liters`
   - `date`
   - `time`
   - `cost`
   - `fuel_type`
   - `location`

8. Abra `src/js/modules/email.js`
9. Substitua:
   - `seu_public_key_aqui` pela sua Public Key do EmailJS
   - `seu_service_id` pelo ID do seu serviço
   - `seu_template_id` pelo ID do seu template

### 4️⃣ Executar Localmente

#### Opção 1: Com Live Server (Recomendado)

1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code
2. Clique com botão direito em `public/index.html`
3. Selecione "Open with Live Server"
4. A aplicação abrirá em `http://localhost:5500`

#### Opção 2: Com Python

```bash
cd public
python -m http.server 8000
# Acesse http://localhost:8000
```

#### Opção 3: Com Node.js

```bash
cd public
npx http-server
# Acesse a URL exibida no terminal
```

### 5️⃣ Fazer Deploy no Firebase Hosting

1. Instale Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Autentique:
```bash
firebase login
```

3. Inicialize o projeto:
```bash
firebase init hosting
```

4. Configure para usar a pasta `public`

5. Deploy:
```bash
firebase deploy
```

Sua aplicação estará disponível em: `https://seu-projeto.web.app`

## 📁 Estrutura de Pastas

```
combustivel/
├── public/                    # Arquivos públicos
│   ├── index.html            # Página de login
│   ├── dashboard.html        # Dashboard principal
│   ├── history.html          # Histórico de abastecimentos
│   └── vehicles.html         # Gerenciamento de veículos
├── src/
│   ├── js/
│   │   ├── firebase-config.js # Configuração do Firebase
│   │   ├── modules/
│   │   │   ├── auth.js        # Módulo de autenticação
│   │   │   ├── vehicle.js     # Módulo de veículos
│   │   │   ├── refuel.js      # Módulo de abastecimentos
│   │   │   ├── email.js       # Módulo de email
│   │   │   └── utils.js       # Funções utilitárias
│   │   └── pages/
│   │       ├── login.js       # Script da página de login
│   │       ├── dashboard.js   # Script do dashboard
│   │       ├── history.js     # Script do histórico
│   │       └── vehicles.js    # Script de veículos
│   └── css/
│       └── styles.css         # Estilos customizados
├── functions/                 # Cloud Functions (opcional)
│   └── index.js              # Funções serverless
├── README.md                  # Este arquivo
└── .gitignore               # Arquivos ignorados pelo Git
```

## 🔑 Funcionalidades Detalhadas

### 🔐 Autenticação
- Registro de novo usuário com validação
- Login seguro com Firebase Auth
- Recuperação de senha por email
- Logout seguro

### 🚚 Gestão de Veículos
- Cadastro de novos veículos (placa, modelo, ano, capacidade)
- Visualização da frota completa
- Edição de informações do veículo
- Exclusão de veículos
- Estatísticas por veículo

### ⛽ Registro de Abastecimento
- Formulário intuitivo com campos: km, litros, hora, dia
- Seleção de tipo de combustível
- Registro de localização e observações
- Custo automaticamente calculado
- Sincronização automática na nuvem

### 📊 Histórico e Análises
- Visualização de todo o histórico de abastecimentos
- Filtros por veículo, data
- Paginação de resultados
- Exportação em CSV
- Estatísticas: total de litros, custos, médias
- Edição e exclusão de registros

### 📧 Notificações por Email
- Confirmação automática ao registrar abastecimento
- Email enviado para: `rannieri.mazzali@outlook.com`
- Relatório mensal/customizado
- Detalhes completos: placa, km, litros, custo, etc.

### 📈 Dashboard
- Estatísticas em tempo real
- Total de veículos
- Último abastecimento
- Litros no mês
- Custos do mês
- Últimos abastecimentos registrados

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Backend/Database**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Email**: EmailJS (API gratuita)
- **Hosting**: Firebase Hosting (opcional)

## 📱 Responsividade

A aplicação é totalmente responsiva:
- ✅ Desktop: 1920px+
- ✅ Laptop: 1024px - 1919px
- ✅ Tablet: 768px - 1023px
- ✅ Mobile: até 767px

## 🔒 Segurança

- Autenticação com Firebase (padrão de indústria)
- Dados encriptados no Firestore
- Senhas não são armazenadas em plain text
- HTTPS em deployment
- Validação de entrada no frontend
- Regras de segurança no Firestore

## 🐛 Troubleshooting

### "Firebase is not defined"
- Certifique-se de que os scripts do Firebase estão carregando corretamente
- Verificar a ordem dos scripts no HTML

### "EmailJS is not defined"
- Verifique se o script do EmailJS está incluído
- Confira a Public Key no `email.js`

### Dados não salvam
- Verificar credenciais do Firebase
- Conferir se Firestore está em modo "Teste"
- Ver console do navegador para erros

### Email não chega
- Verificar configuração do EmailJS
- Testar no [EmailJS Dashboard](https://dashboard.emailjs.com)
- Conferir spam/lixo eletrônico

## 📞 Suporte

Para problemas e dúvidas:

1. Verificar [Firebase Documentation](https://firebase.google.com/docs)
2. Verificar [EmailJS Documentation](https://www.emailjs.com/docs/)
3. Abrir um ticket com detalhes do erro
4. Verificar console do navegador (F12)

## 📄 Licença

Este projeto está sob licença MIT. Veja LICENSE para detalhes.

## 👨‍💻 Autor

**FleetFuel** - Sistema de Gestão de Frota

---

## ✅ Checklist de Configuração

- [ ] Criar projeto no Firebase
- [ ] Configurar Firebase Config nas credenciais
- [ ] Ativar Firebase Auth (Email/Password)
- [ ] Criar Firestore Database
- [ ] Configurar EmailJS
- [ ] Obter Public Key do EmailJS
- [ ] Criar Email Template no EmailJS
- [ ] Atualizar Service ID e Template ID
- [ ] Testar login e registro
- [ ] Testar abastecimento
- [ ] Testar email
- [ ] Deploy no Firebase (opcional)

---

🚀 **Pronto para começar?** Siga os passos acima e comece a gerenciar sua frota!
