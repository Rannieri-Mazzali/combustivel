# FleetFuel - Sistema de Gestão de Abastecimento de Frota

## 🚀 Visão Geral

FleetFuel é um sistema moderno e otimizado para gerenciar o abastecimento de frotas de veículos. Permite registrar abastecimentos, gerenciar um depósito de combustível, visualizar históricos e estatísticas em tempo real.

## ✨ Características Principais

- ⛽ **Depósito de Combustível**: Tanque visual com indicador de nível em tempo real
- 🚛 **Gerenciar Veículos**: Cadastre e gerencie todos os seus caminhões
- 📊 **Registrar Abastecimentos**: Mantenha histórico completo de cada abastecimento
- 📈 **Estatísticas**: Acompanhe consumo, custos e tendências
- 🔐 **Autenticação Segura**: Sistema de login com Firebase
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- ⚡ **Otimizado**: Carregamento rápido e performance excepcional

## 📁 Estrutura do Projeto

```
combustivel/
├── public/              # Arquivos HTML (interface web)
│   ├── dashboard.html   # Página inicial - Registrar abastecimentos
│   ├── vehicles.html    # Gerenciar veículos
│   ├── fuel-depot.html  # Depósito de combustível
│   └── history.html     # Histórico de abastecimentos
├── src/
│   ├── js/
│   │   ├── firebase-config.js    # Configuração Firebase
│   │   ├── modules/              # Módulos reutilizáveis
│   │   │   ├── auth.js          # Autenticação
│   │   │   ├── vehicle.js       # Gestão de veículos
│   │   │   ├── refuel.js        # Registros de abastecimento
│   │   │   ├── email.js         # Envio de emails
│   │   │   ├── utils.js         # Funções auxiliares
│   │   │   └── fuel-depot.js    # Gestão do depósito
│   │   └── pages/                # Scripts das páginas
│   │       ├── dashboard.js
│   │       ├── vehicles.js
│   │       ├── fuel-depot.js
│   │       └── history.js
│   └── css/
│       └── styles.css   # Estilos customizados
├── firebase.json        # Configuração Firebase
├── vercel.json          # Configuração Vercel
└── package.json         # Dependências do projeto
```

## 🚀 Como Usar

### 1. **Acessar o Dashboard**
   - Faça login com credenciais de demo ou suas credenciais
   - Dashboard aparece como página inicial

### 2. **Registrar um Abastecimento**
   - Selecione o veículo na dropdown
   - Preencha:
     - Quilometragem (km)
     - Litros abastecidos
     - Data e hora
     - Tipo de combustível
     - Custo (opcional)
     - Local e observações
   - Clique em "Registrar Abastecimento"

### 3. **Gerenciar Veículos**
   - Acesse a página "Veículos"
   - Para adicionar:
     - Digite a placa (ABC-1234)
     - Modelo (ex: Scania R440)
     - Ano (2000-2100)
     - Capacidade do tanque em litros
     - Clique "Adicionar Veículo"
   - Editar ou deletar veículos conforme necessário

### 4. **Depósito de Combustível**
   - Acesse "⛽ Depósito"
   - Veja o tanque visual com nível em tempo real
   - Adicione combustível:
     - Selecione tipo (Diesel, Gasolina, Etanol, etc)
     - Quantidade em litros
     - Notas (opcional)
   - Monitorar capacidade e histórico

### 5. **Visualizar Histórico**
   - Página "Histórico" mostra todos os abastecimentos
   - Filtrar por veículo ou data
   - Exportar relatórios (quando disponível)

## 🔧 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, Tailwind CSS, Vanilla JavaScript
- **Backend**: Firebase (Firestore, Authentication)
- **Email**: EmailJS
- **Hospedagem**: Vercel / Firebase Hosting
- **APIs**: Google Fonts, Tailwind CDN

## ⚙️ Otimizações de Performance

- ✅ Carregamento assíncrono de dados
- ✅ Cache offline com Firestore Persistence
- ✅ Lazy loading de imagens e componentes
- ✅ Minimização de requisições ao servidor
- ✅ CSS framework otimizado (Tailwind)
- ✅ Estrutura de pasta organizada

## 🔐 Segurança

- Autenticação via Firebase Authentication
- Firestore com regras de segurança
- Dados criptografados em trânsito
- Validação de entrada no cliente e servidor

## 📞 Suporte

Para reportar bugs ou solicitar recursos:
1. Abra uma issue no repositório
2. Descreva o problema detalhadamente
3. Inclua capturas de tela ou passos para reproduzir

## 📝 Licença

MIT License - Veja LICENSE.md para detalhes

---

**Desenvolvido com ❤️ para gerenciamento eficiente de frotas**
