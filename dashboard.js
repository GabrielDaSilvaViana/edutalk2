document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DE ELEMENTOS ---
    const navItems = document.querySelectorAll('.nav-item');
    const contactItems = document.querySelectorAll('.contact-item');
    const chatName = document.getElementById('chat-name');
    const chatAvatar = document.getElementById('chat-avatar');
    const messageArea = document.querySelector('.message-area');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Elementos do Calendário
    const calendarioBtn = document.getElementById('calendario-btn');
    const calendarioPopup = document.getElementById('calendario-popup');
    const monthYearEl = document.getElementById('month-year');
    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const calendarioDaysGrid = document.getElementById('calendario-days-grid');
    
    // Elementos do Pop-up Active
    const activeBtn = document.getElementById('active-btn');
    const activePopup = document.getElementById('active-popup');

    // ------------------------------------------------------------------
    // LÓGICA DE MENSAGENS TEMPORÁRIAS (TOAST) - 🟢 NOVIDADE
    // ------------------------------------------------------------------

    const showTemporaryMessage = (message) => {
        const tempDiv = document.createElement('div');
        tempDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 2000;
            opacity: 0.9;
            font-size: 0.9rem;
            transition: opacity 0.5s ease-in-out;
        `;
        tempDiv.textContent = message;
        document.body.appendChild(tempDiv);

        setTimeout(() => {
            tempDiv.style.opacity = '0';
            setTimeout(() => tempDiv.remove(), 500);
        }, 2000);
    };

    // Seleciona todos os elementos que devem disparar a mensagem temporária
    const elementsToToast = [
        // Sidebar: New Meeting, Notes, More
        document.querySelector('.nav-menu .nav-item:nth-child(3)'), // New Meeting
        document.querySelector('.nav-menu .nav-item:nth-child(5)'), // Notes
        document.querySelector('.nav-more'),
        // Profile: chevron_right
        document.querySelector('.user-profile .material-icons'),
        // Chat Header: Search, Call, Video, More
        ...document.querySelectorAll('.chat-actions .material-icons'),
        // Chat Input: All icons
        ...document.querySelectorAll('.input-area .material-icons')
    ];

    elementsToToast.forEach(el => {
        if (el) {
            el.addEventListener('click', (event) => {
                event.stopPropagation();
                
                let name = el.textContent.trim();
                
                // Trata nomes dos ícones
                if (name === 'videocam' && el.closest('.chat-actions')) name = 'Video Chamada';
                else if (name === 'call') name = 'Chamada de Voz';
                else if (name === 'search' && el.closest('.chat-actions')) name = 'Busca no Chat';
                else if (name === 'more_vert') name = 'Mais Opções do Chat';
                else if (el.closest('.nav-more')) name = 'Mais Opções de Navegação';
                else if (el.closest('.user-profile')) name = 'Configurações de Perfil';
                else if (name === 'add_circle_outline') name = 'Anexo';
                else if (name === 'sentiment_satisfied_alt') name = 'Emojis';
                else if (name === 'alternate_email') name = 'Menção (@)';
                else if (name === 'mic' && el.closest('.input-area')) name = 'Áudio';
                else if (name === 'gif_box') name = 'GIFs';
                else if (name === 'sticky_note_2') name = 'Adesivos';

                showTemporaryMessage(`Funcionalidade de "${name || 'este item'}" ainda não implementada.`);
            });
        }
    });

    // ------------------------------------------------------------------
    // LÓGICA DO CALENDÁRIO
    // ------------------------------------------------------------------
    let currentDate = new Date();

    const renderCalendario = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        monthYearEl.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate);
        calendarioDaysGrid.innerHTML = '';

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

        // 1. Dias do mês anterior
        for (let i = firstDayOfMonth; i > 0; i--) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day', 'other-month');
            dayEl.textContent = lastDateOfPrevMonth - i + 1;
            calendarioDaysGrid.appendChild(dayEl);
        }

        // 2. Dias do mês atual
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            dayEl.textContent = i;
            
            const today = new Date();
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('current-day');
            }

            dayEl.addEventListener('click', () => {
                const selected = document.querySelector('.selected-day');
                if(selected) selected.classList.remove('selected-day');
                dayEl.classList.add('selected-day');
            });

            calendarioDaysGrid.appendChild(dayEl);
        }
    };
    
    // ------------------------------------------------------------------
    // EVENTOS DE NAVEGAÇÃO DOS POP-UPS E SIDEBAR
    // ------------------------------------------------------------------

    const closeAllPopups = () => {
        if (calendarioPopup) calendarioPopup.classList.remove('show');
        if (activePopup) activePopup.classList.remove('show');
    };

    // Evento para mostrar/esconder o CALENDÁRIO
    if (calendarioBtn) {
        calendarioBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (activePopup) activePopup.classList.remove('show'); 
            
            if (calendarioPopup) calendarioPopup.classList.toggle('show');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            calendarioBtn.classList.add('active');
            
            if(calendarioPopup && !calendarioPopup.classList.contains('show')) {
                 document.querySelector('.nav-item:first-child').classList.add('active');
            }
        });
    }

    // Evento para mostrar/esconder o ACTIVE POP-UP
    if (activeBtn) {
        activeBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (calendarioPopup) calendarioPopup.classList.remove('show'); 
            
            if (activePopup) activePopup.classList.toggle('show');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            activeBtn.classList.add('active');
            
            if(activePopup && !activePopup.classList.contains('show')) {
                 document.querySelector('.nav-item:first-child').classList.add('active');
            }
        });
    }

    // Navegação do Calendário
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendario();
        });
    }
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendario();
        });
    }
    
    // Fecha pop-ups se clicar fora
    document.addEventListener('click', (event) => {
        const isClickedOutsideCalendario = !(calendarioPopup && (calendarioPopup.contains(event.target) || calendarioBtn.contains(event.target)));
        const isClickedOutsideActive = !(activePopup && (activePopup.contains(event.target) || activeBtn.contains(event.target)));

        if (isClickedOutsideCalendario && calendarioPopup && calendarioPopup.classList.contains('show')) {
            closeAllPopups();
            calendarioBtn.classList.remove('active');
            document.querySelector('.nav-item:first-child').classList.add('active');
        }

        if (isClickedOutsideActive && activePopup && activePopup.classList.contains('show')) {
            closeAllPopups();
            activeBtn.classList.remove('active');
            document.querySelector('.nav-item:first-child').classList.add('active');
        }
    });

    // Lógica de Ativação dos Itens da Sidebar (exceto os pop-ups)
    navItems.forEach(item => {
        // Ignora itens com funcionalidade de pop-up
        if(item.id === 'calendario-btn' || item.id === 'active-btn') return; 
        
        item.addEventListener('click', () => {
            closeAllPopups(); // Garante que os pop-ups fechem
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // O código do toast já lida com New Meeting e Notes, mas mantemos o foco aqui.
        });
    });

    // Renderiza o calendário ao carregar a página
    if (calendarioDaysGrid) {
        renderCalendario();
    }

    // ------------------------------------------------------------------
    // LÓGICA DO CHAT
    // ------------------------------------------------------------------

    // Lógica de Troca de Conversa
    contactItems.forEach(item => {
        item.addEventListener('click', () => {
            contactItems.forEach(contact => contact.classList.remove('active'));
            item.classList.add('active');
            const name = item.dataset.name;
            const avatar = item.dataset.avatar;
            chatName.textContent = name;
            chatAvatar.src = avatar;
            
            // Recria o conteúdo da janela de chat (pode ser substituído por dados dinâmicos)
            messageArea.innerHTML = `
                <div class="message-date-divider"><span>Início da conversa com ${name}</span></div>
            `;
            // Adiciona as mensagens estáticas de volta na conversa de Sunita (primeira conversa real)
            if (name === "Sunita Kumari") {
                messageArea.insertAdjacentHTML('beforeend', `
                    <div class="message-date-divider"><span>Monday, 3rd Nov</span></div>
                    <div class="message received">
                        <div class="message-bubble">Hi,</div>
                        <div class="message-time">12:45 PM</div>
                    </div>
                    <div class="message received">
                        <div class="message-bubble">Did you sell the products of the batch 3rd</div>
                        <div class="message-time">12:45 PM</div>
                    </div>
                    <div class="message received">
                        <div class="message-bubble">Contact me soon if you have batch</div>
                        <div class="message-time">12:45 PM</div>
                    </div>
                    <div class="message sent">
                            <div class="message-bubble">I've Sold some Products <br> can you help me with selling the products by leading me some customers that you have in your list</div>
                            <div class="message-time">01:45 PM</div>
                    </div>
                    <div class="message received">
                        <div class="message-bubble">Yes, Sure! I</div>
                        <div class="message-time">...</div>
                    </div>
                `);
            }
            
            messageArea.scrollTop = messageArea.scrollHeight;
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
    
    // Inicia a aplicação e carrega a primeira conversa
    if(contactItems.length > 0) {
        // Encontra Sunita Kumari (A primeira conversa real no HTML original)
        const sunita = Array.from(contactItems).find(item => item.dataset.name === "Sunita Kumari");
        
        // Ativa o primeiro item na lista de contatos (Group 1)
        contactItems[0].classList.add('active');
        
        // Inicializa o chat com a conversa de Sunita Kumari
        if (sunita) {
            sunita.click();
            // Desativa a Sunita (o click ativa) e reativa o Group 1 (o desejado para a lista lateral)
            sunita.classList.remove('active');
            contactItems[0].classList.add('active');
        } else {
            // Caso Sunita não exista, carrega o primeiro item da lista de contatos
            contactItems[0].click();
        }
    }

    // ------------------------------------------------------------------
    // LÓGICA DO POP-UP DE PERFIL
    // ------------------------------------------------------------------

    // Abrir e fechar o pop-up de Perfil
    document.querySelector('.user-profile').addEventListener('click', () => {
        document.getElementById('profile-popup').style.display = 'block';
    });

    document.getElementById('close-profile-btn').addEventListener('click', () => {
        document.getElementById('profile-popup').style.display = 'none';
    });

    // Abrir e fechar o pop-up de Editar Perfil
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        document.getElementById('edit-profile-popup').style.display = 'block';
    });

    document.getElementById('close-edit-profile-btn').addEventListener('click', () => {
        document.getElementById('edit-profile-popup').style.display = 'none';
    });

    // Salvar alterações do perfil
    document.getElementById('save-edit-profile-btn').addEventListener('click', () => {
        const newName = document.getElementById('edit-name').value.trim();
        const newAvatar = document.getElementById('edit-avatar').value.trim();

        if (newName && newAvatar) {
            // Atualiza o nome e avatar no pop-up de perfil
            document.querySelector('.profile-info h3').textContent = newName;
            document.querySelector('.profile-avatar img').src = newAvatar;

            // Atualiza o avatar na barra lateral e na janela de chat
            const chatAvatar = document.getElementById('chat-avatar');
            const userProfileAvatar = document.querySelector('.user-profile .avatar');

            if (chatAvatar) chatAvatar.src = newAvatar;
            if (userProfileAvatar) userProfileAvatar.src = newAvatar;

            document.getElementById('edit-profile-popup').style.display = 'none';
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });

    // Abrir e fechar o pop-up de Configurações
    document.getElementById('settings-btn').addEventListener('click', () => {
        document.getElementById('settings-popup').style.display = 'block';
    });

    document.getElementById('close-settings-btn').addEventListener('click', () => {
        document.getElementById('settings-popup').style.display = 'none';
    });

    // Salvar configurações
    document.getElementById('save-settings-btn').addEventListener('click', () => {
        const selectedTheme = document.getElementById('theme-select').value;
        const selectedLanguage = document.getElementById('language-select').value;

        if (selectedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }

        alert(`Configurações salvas:\nTema: ${selectedTheme}\nIdioma: ${selectedLanguage}`);
        document.getElementById('settings-popup').style.display = 'none';
    });
});