# 📊 Estrutura de Projeto - FleetFuel

Visão completa da estrutura de pastas e arquivos do projeto.

## 🗂️ Árvore de Diretórios

```
combustivel/
│
├── public/                              # 🌐 Arquivos públicos (frontend)
│   ├── index.html                       # Página de login/registro
│   ├── dashboard.html                   # Dashboard principal
│   ├── history.html                     # Histórico de abastecimentos
│   └── vehicles.html                    # Gestão de veículos
│
├── src/                                 # 📁 Código-fonte
│   ├── js/                              # 🔧 JavaScript
│   │   ├── firebase-config.js           # Configuração do Firebase
│   │   │
│   │   ├── modules/                     # 📦 Módulos reutilizáveis
│   │   │   ├── auth.js                  # Autenticação e login
│   │   │   ├── vehicle.js               # Gestão de veículos
│   │   │   ├── refuel.js                # Gestão de abastecimentos
│   │   │   ├── email.js                 # Envio de emails
│   │   │   └── utils.js                 # Funções utilitárias
│   │   │
│   │   └── pages/                       # 📄 Scripts das páginas
│   │       ├── login.js                 # Lógica de login
│   │       ├── dashboard.js             # Lógica do dashboard
│   │       ├── history.js               # Lógica do histórico
│   │       └── vehicles.js              # Lógica de veículos
│   │
│   └── css/                             # 🎨 Estilos
│       └── styles.css                   # CSS customizado (Tailwind)
│
├── functions/                           # ☁️ Cloud Functions (opcional)
│   └── index.js                         # Funções serverless Firebase
│
├── 📄 Arquivos de Configuração
│   ├── firebase.json                    # Configuração Firebase Hosting
│   ├── .firebaserc                      # Aliases de projeto Firebase
│   ├── package.json                     # Dependências Node.js
│   └── .gitignore                       # Arquivos ignorados Git
│
├── 📚 Documentação
│   ├── README.md                        # Documentação principal
│   ├── SETUP.html                       # Guia de instalação (HTML)
│   ├── SETUP.md                         # Guia de instalação (Markdown)
│   ├── FIRESTORE_RULES.md               # Regras de segurança Firestore
│   ├── FAQ.md                           # Perguntas frequentes
│   └── PROJECT_STRUCTURE.md             # Este arquivo
```

## 📋 Descrição dos Arquivos

### 🌐 Público (Frontend)

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Página de login, registro e recuperação de senha |
| `dashboard.html` | Painel principal com formulário de abastecimento |
| `history.html` | Listagem e filtros de abastecimentos |
| `vehicles.html` | Cadastro e gestão de veículos |

### 🔧 JavaScript - Módulos

| Arquivo | Descrição |
|---------|-----------|
| `firebase-config.js` | Inicialização e configuração do Firebase |
| `modules/auth.js` | Autenticação, login, registro |
| `modules/vehicle.js` | CRUD de veículos |
| `modules/refuel.js` | CRUD de abastecimentos |
| `modules/email.js` | Envio de emails via EmailJS |
| `modules/utils.js` | Formatação, validação, utilitários |

### 📄 JavaScript - Páginas

| Arquivo | Descrição |
|---------|-----------|
| `pages/login.js` | Lógica do formulário de login |
| `pages/dashboard.js` | Lógica do dashboard e abastecimentos |
| `pages/history.js` | Lógica do histórico e filtros |
| `pages/vehicles.js` | Lógica de gestão de veículos |

### 🎨 Estilos

| Arquivo | Descrição |
|---------|-----------|
| `css/styles.css` | Estilos customizados (complementa Tailwind) |

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  (HTML + CSS + JavaScript - Navegador do Usuário)           │
└─────────────┬───────────────────────────────────────────────┘
              │
              │ HTTP/HTTPS
              ▼
┌─────────────────────────────────────────────────────────────┐
│                      FIREBASE                                │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │  Authentication  │  │    Firestore     │                 │
│  │  (Firebase Auth) │  │   (Database)     │                 │
│  └──────────────────┘  └──────────────────┘                 │
│         │                      │                             │
│   Login/Register         Read/Write Data                     │
└─────────────────────────────────────────────────────────────┘
              │
              │ HTTPS
              ▼
┌─────────────────────────────────────────────────────────────┐
│                     EMAIL SERVICE                            │
│              (EmailJS - Notificações)                        │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Arquitetura de Módulos

### Módulo de Autenticação
```javascript
AuthModule
├── register()           // Criar novo usuário
├── login()              // Fazer login
├── logout()             // Sair
├── getCurrentUser()     // Obter usuário atual
├── onAuthStateChanged() // Monitorar autenticação
└── resetPassword()      // Recuperação de senha
```

### Módulo de Veículos
```javascript
VehicleModule
├── addVehicle()         // Adicionar novo veículo
├── getUserVehicles()    // Listar veículos do usuário
├── getVehicleDetails()  // Obter detalhes
├── updateVehicle()      // Editar veículo
└── deactivateVehicle()  // Deletar (desativar)
```

### Módulo de Abastecimentos
```javascript
RefuelModule
├── recordRefuel()           // Registrar novo abastecimento
├── getVehicleRefuelHistory()// Histórico de um veículo
├── getUserRefuelHistory()   // Histórico do usuário
├── getRefuelStats()         // Estatísticas
├── deleteRefuelRecord()     // Deletar registro
└── updateRefuelRecord()     // Editar registro
```

### Módulo de Email
```javascript
EmailModule
├── init()                   // Inicializar EmailJS
├── sendRefuelEmail()        // Enviar confirmação de abastecimento
└── sendDailyReport()        // Enviar relatório diário
```

### Módulo de Utilitários
```javascript
UtilsModule
├── formatDate()             // Formatar data
├── formatDateTime()         // Formatar data e hora
├── formatCurrency()         // Formatar para Real
├── validateEmail()          // Validar email
├── validatePassword()       // Validar senha
├── showNotification()       // Exibir notificação
├── showLoading()            // Mostrar/ocultar loading
├── validateForm()           // Validar formulário
├── getUrlParam()            // Obter parâmetro da URL
├── exportToCSV()            // Exportar para CSV
└── formatLicensePlate()     // Formatar placa
```

## 💾 Estrutura de Dados (Firebase)

### Coleção: `users`
```javascript
{
  fullName: String,
  email: String,
  company: String,
  createdAt: Timestamp,
  vehicles: Array<String>,      // IDs de veículos
  refuel_records: Array<String> // IDs de registros
}
```

### Coleção: `vehicles`
```javascript
{
  licensePlate: String,
  model: String,
  year: Number,
  capacity: Number,             // litros
  userId: String,               // ID do proprietário
  createdAt: Timestamp,
  totalRefueled: Number,        // litros totais abastecidos
  lastRefuel: Timestamp,
  active: Boolean
}
```

### Coleção: `refuel_records`
```javascript
{
  vehicleId: String,
  userId: String,
  km: Number,
  liters: Number,
  date: Timestamp,
  time: String,                 // HH:MM
  cost: Number,                 // R$
  fuelType: String,             // Diesel, Gasolina, etc
  location: String,
  notes: String,
  createdAt: Timestamp,
  emailSent: Boolean
}
```

## 🔐 Segurança

### Autenticação
- Firebase Auth com Email/Password
- Senhas criptografadas
- Sessions persistentes

### Banco de Dados
- Firestore com regras de segurança
- Isolamento por usuário
- Validação de dados

### Transmissão
- HTTPS para todas as conexões
- Certificados SSL/TLS
- Proteção contra CSRF

## 📈 Escalabilidade

O projeto foi arquitetado para escalar:

- **Usuários**: Ilimitados (Firebase gerencia)
- **Veículos**: Ilimitados por usuário
- **Registros**: Ilimitados (Firestore é NoSQL)
- **Armazenamento**: Até 1GB grátis
- **Requisições**: Generoso limite gratuito

## 🔄 Dependências Externas

| Biblioteca | Versão | Propósito |
|-----------|--------|----------|
| Firebase | 9.22.0 | Backend, Database, Auth |
| EmailJS | 3.11.0 | Envio de emails |
| Tailwind CSS | via CDN | Framework CSS |

## 🛠️ Ferramentas Recomendadas

- **Editor**: VS Code
- **Extensões**: Live Server, Firebase Explorer
- **Navegador**: Chrome DevTools
- **CLI**: Firebase CLI, Node.js
- **Versionamento**: Git/GitHub

## 📞 Suporte

Para dúvidas sobre a estrutura:
1. Consulte README.md
2. Veja os comentários no código
3. Abra o console (F12) para debug
4. Verifique a documentação das bibliotecas

---

**Atualizado em:** 2026-05-17  
**Versão do Projeto:** 1.0.0
