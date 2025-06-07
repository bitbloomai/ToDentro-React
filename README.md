# 📱 ToDentro - Plataforma de Check-in Inteligente

## 🎯 Sobre a Plataforma

ToDentro é uma plataforma inovadora de check-in digital que revoluciona a forma como organizações gerenciam a presença em eventos, reuniões e atividades. Com o slogan **"Chegou, tá confirmado!"**, oferecemos uma solução simples, rápida e eficiente para confirmar presenças através de **QR Code**.

---

## 🌟 Proposta de Valor

* **Para Organizadores**: Controle total sobre eventos com dashboard em tempo real.
* **Para Participantes**: Check-in instantâneo sem filas ou complicações.
* **Para Empresas**: Dados e relatórios detalhados sobre engajamento.

---

## 🏗️ Estrutura do Projeto

### Arquitetura Simples e Escalável

todentro/
├── 📄 index.html        # Página inicial/landing page
├── 📄 login.html        # Página de login
├── 📄 signup.html       # Página de cadastro
├── 📄 dashboard.html    # Painel de controle
├── 📄 event.html        # Criação/edição de eventos
├── 📄 checkin.html      # Página de check-in
├── 📄 profile.html      # Perfil do usuário
│
├── 📁 css/
│   ├── 🎨 style.css        # Estilos globais
│   ├── 🎨 dashboard.css    # Estilos do dashboard
│   └── 🎨 responsive.css   # Responsividade
│
├── 📁 js/
│   ├── ⚡ app.js          # Lógica principal
│   ├── 🔐 auth.js          # Autenticação
│   ├── 📊 dashboard.js    # Funcionalidades do dashboard
│   ├── 📱 checkin.js      # Sistema de check-in
│   └── 🔌 supabase.js      # Configuração Supabase
│
├── 📁 assets/
│   ├── 📁 images/         # Imagens e logos
│   ├── 📁 icons/          # Ícones
│   └── 📁 fonts/          # Fontes customizadas
│
└── 📄 README.md           # Documentação


---

## 🚀 Funcionalidades Principais

1.  ### 🔐 Sistema de Autenticação
    * Cadastro de usuários com validação de dados
    * Login seguro com email e senha
    * Recuperação de senha via email
    * Perfis de usuário personalizáveis
    * Níveis de acesso (Admin, Organizador, Participante)

2.  ### 📊 Dashboard Inteligente
    * Widgets customizáveis com drag-and-drop
    * Estatísticas em tempo real:
        * Total de check-ins
        * Taxa de presença
        * Horários de pico
        * Engajamento por evento
    * Gráficos interativos (Chart.js)
    * Filtros por período e categoria
    * Exportação de relatórios (PDF/Excel)

3.  ### 📅 Gestão de Eventos
    * Criação rápida de eventos
    * Informações detalhadas:
        * Nome e descrição
        * Data, hora e duração
        * Local (presencial/online)
        * Capacidade máxima
        * Categorias e tags
    * QR Code único por evento
    * Link de compartilhamento
    * Lista de convidados com importação CSV

4.  ### 📱 Sistema de Check-in
    * QR Code Scanner via câmera
    * Check-in manual por código
    * Confirmação instantânea
    * Notificação em tempo real
    * Histórico de presenças
    * Check-in offline (sincroniza depois)

5.  ### 👥 Gestão de Participantes
    * Perfil completo do participante
    * Histórico de eventos
    * Certificados digitais
    * Pontuação/Gamificação
    * Comunicação direta via plataforma

6.  ### 📈 Relatórios e Analytics
    * Dashboard analítico completo
    * Métricas de engajamento
    * Taxa de abandono
    * Horários mais movimentados
    * Comparativo entre eventos
    * Insights automáticos com IA

7.  ### 🔔 Notificações
    * Lembretes de eventos
    * Confirmações de check-in
    * Atualizações importantes
    * Notificações push (PWA)

8.  ### 🎨 Personalização
    * Temas claro/escuro
    * Cores da marca
    * Logo personalizado
    * URLs customizadas

---

## 💻 Tecnologias Utilizadas

### Frontend (Simples e Poderoso)
* **HTML5** - Estrutura semântica
* **CSS3** - Estilos modernos com variáveis CSS
* **JavaScript Vanilla** - Lógica sem dependências
* **Alpine.js** - Reatividade leve (opcional)
* **Chart.js** - Gráficos interativos

### Backend (Supabase)
* Autenticação completa e segura
* Banco de dados PostgreSQL
* Storage para arquivos
* Realtime para atualizações instantâneas
* Edge Functions para lógica serverless

### Integrações
* **QR Code Generator** - API JavaScript
* **Email Service** - Supabase Auth
* **Analytics** - Google Analytics
* **PWA** - Funciona offline

---

## 🎯 Casos de Uso

1.  ### Eventos Corporativos
    * Conferências e workshops
    * Treinamentos internos
    * Reuniões de equipe
    * Happy hours

2.  ### Instituições de Ensino
    * Controle de presença em aulas
    * Eventos acadêmicos
    * Palestras e seminários
    * Atividades extracurriculares

3.  ### Eventos Sociais
    * Festas e celebrações
    * Meetups e networking
    * Shows e apresentações
    * Eventos esportivos

4.  ### Estabelecimentos
    * Controle de lotação
    * Fila virtual
    * Reservas de mesa
    * Programas de fidelidade

---

## 🛡️ Segurança e Privacidade

* Criptografia de dados sensíveis
* HTTPS obrigatório
* Autenticação em duas etapas (2FA)
* LGPD compliance
* Backup automático diário
* Logs de auditoria

---

## 📱 Experiência Mobile-First

* Design responsivo para todos dispositivos
* PWA - Instalável como app
* Touch-friendly interface
* Câmera integrada para QR Code
* Modo offline com sincronização

---

## 🚀 Roadmap Futuro

### Fase 1 - MVP (Atual)
* ✅ Sistema de autenticação
* ✅ Dashboard básico
* ✅ Criação de eventos
* ✅ Check-in via QR Code
* ✅ Relatórios simples

### Fase 2 - Expansão
* 📱 App mobile nativo
* 🤖 Chatbot de atendimento
* 📧 Email marketing integrado
* 💳 Sistema de pagamentos
* 🎫 Venda de ingressos

### Fase 3 - Inovação
* 🤖 IA para previsão de presença
* 📊 Analytics avançado
* 🌐 Multi-idiomas
* 🔗 Integrações (Zoom, Teams, etc)
* 🎮 Gamificação completa

---

## 💰 Modelo de Negócio

* ### Plano Gratuito
    * Até 50 participantes/mês
    * 3 eventos ativos
    * Funcionalidades básicas
    * Suporte por email

* ### Plano Pro (R$ 49/mês)
    * Até 500 participantes/mês
    * Eventos ilimitados
    * Relatórios avançados
    * Suporte prioritário
    * Personalização de marca

* ### Plano Business (R$ 149/mês)
    * Participantes ilimitados
    * API access
    * Multi-usuários
    * Treinamento incluído
    * Suporte dedicado

* ### Enterprise (Sob consulta)
    * Instalação on-premise
    * Customizações
    * SLA garantido
    * Integrações personalizadas

---

## 🎨 Identidade Visual

### Cores Principais:
* Primária: `#6366F1` (Indigo)
* Secundária: `#10B981` (Verde)
* Suporte: `#F3F4F6` (Cinza claro)

### Tipografia:
* Títulos: Inter Bold
* Corpo: Inter Regular

### Estilo:
* Moderno e minimalista
* Cantos arredondados
* Sombras suaves
* Animações sutis

---

## 📞 Suporte e Comunidade

* Documentação completa
* Tutoriais em vídeo
* FAQ detalhado
* Fórum da comunidade
* Suporte via chat/email
* Blog com dicas e novidades

---

ToDentro - Transformando a forma como confirmamos presença. Simples, rápido e inteligente.

**"Chegou, tá confirmado!"** 🚀