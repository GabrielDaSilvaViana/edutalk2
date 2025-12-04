document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS (TODOS OS COMPONENTES) ---
    // Elementos do Chat e Navegação
    const navItems = document.querySelectorAll('.nav-item');
    const contactItems = document.querySelectorAll('.contact-item');
    const chatName = document.getElementById('chat-name');
    const chatAvatar = document.getElementById('chat-avatar');
    const messageArea = document.querySelector('.message-area');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const actionButtons = document.querySelectorAll('.chat-actions .material-icons');

    // Elementos do Calendário (AGORA CORRIGIDOS PARA O PORTUGUÊS)
    const calendarioBtn = document.getElementById('calendario-btn');
    const calendarioPopup = document.getElementById('calendario-popup');
    const monthYearEl = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const calendarioDaysGrid = document.getElementById('calendario-days-grid');

    // --- LÓGICA DO CALENDÁRIO ---
    let currentDate = new Date();

    const renderCalendario = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        // Define o texto do cabeçalho
        monthYearEl.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate);

        calendarioDaysGrid.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

        // 1. Adiciona os últimos dias do mês anterior
        for (let i = firstDayOfMonth; i > 0; i--) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day', 'other-month');
            dayEl.textContent = lastDateOfPrevMonth - i + 1;
            calendarioDaysGrid.appendChild(dayEl);
        }

        // 2. Adiciona os dias do mês atual
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            dayEl.textContent = i;
            
            // Destaca o dia atual
            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('current-day');
            }

            // Adiciona a funcionalidade de clique para selecionar um dia
            dayEl.addEventListener('click', () => {
                const selected = document.querySelector('.selected-day');
                if(selected) selected.classList.remove('selected-day');
                dayEl.classList.add('selected-day');
                console.log(`Data selecionada: ${i}/${month + 1}/${year}`);
            });

            calendarioDaysGrid.appendChild(dayEl);
        }
    };
    
    // ------------------------------------------------------------------
    // EVENTOS DE NAVEGAÇÃO DO CALENDÁRIO
    // ------------------------------------------------------------------

    // Evento para mostrar/esconder o calendário ao clicar no botão da sidebar
    calendarioBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        calendarioPopup.classList.toggle('show');
        
        // Atualiza o estado "ativo" na sidebar
        navItems.forEach(nav => nav.classList.remove('active'));
        calendarioBtn.classList.add('active');
    });

    // Evento para navegar para o mês anterior
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendario();
    });

    // Evento para navegar para o próximo mês
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendario();
    });
    
    // Fecha o calendário se o usuário clicar fora dele
    document.addEventListener('click', (event) => {
        if (calendarioPopup.classList.contains('show') && 
            !calendarioPopup.contains(event.target) && 
            !calendarioBtn.contains(event.target)) {
            calendarioPopup.classList.remove('show');
            calendarioBtn.classList.remove('active'); 
            // Reativa o primeiro item da lista (Home, por exemplo)
            document.querySelector('.nav-item:first-child').classList.add('active');
        }
    });

    // Renderiza o calendário ao carregar a página
    renderCalendario();


    // --- FUNCIONALIDADES ANTERIORES (CHAT E NAVEGAÇÃO) ---

    // Lógica de Ativação dos Itens da Sidebar (exceto o Calendário)
    navItems.forEach(item => {
        if(item.id === 'calendario-btn') return; // Ignora o calendário
        
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            calendarioPopup.classList.remove('show'); // Garante que o calendário feche
        });
    });

    // Lógica de Troca de Conversa
    contactItems.forEach(item => {
        item.addEventListener('click', () => {
            contactItems.forEach(contact => contact.classList.remove('active'));
            item.classList.add('active');
            const name = item.dataset.name;
            const avatar = item.dataset.avatar;
            chatName.textContent = name;
            chatAvatar.src = avatar;
            messageArea.innerHTML = `<div class="message-date-divider"><span>Início da conversa com ${name}</span></div>`;
        });
    });

    // Lógica de Envio de Mensagem
    const sendMessage = () => {
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            const messageHTML = `
                <div class="message sent">
                    <div class="message-bubble">${messageText}</div>
                    <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
            `;
            messageArea.insertAdjacentHTML('beforeend', messageHTML);
            messageInput.value = '';
            messageArea.scrollTop = messageArea.scrollHeight;
            messageInput.focus();
        }
    };

    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Simulação dos Botões de Ação do Chat
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent.trim();
            alert(`Funcionalidade "${action}" ainda não implementada.`);
        });
    });

    // Inicia a aplicação
    if(contactItems.length > 0) {
       contactItems[0].click();
    }
});