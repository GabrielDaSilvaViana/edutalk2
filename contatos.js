document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os botões que têm o atributo data-target
    const navButtons = document.querySelectorAll('.nav-button[data-target]');
    // Seleciona todas as listas de contatos
    const allContactLists = document.querySelectorAll('.contact-list');

    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Remove a classe 'active' de todos os botões
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Remove a classe 'show' de todas as listas
            allContactLists.forEach(list => list.classList.remove('show'));
            
            // Adiciona a classe 'active' ao botão clicado
            event.target.classList.add('active');
            
            // Pega o ID da lista alvo do botão clicado
            const targetId = event.target.getAttribute('data-target');
            // Encontra a lista de contatos correspondente e adiciona a classe 'show'
            const targetList = document.getElementById(targetId);
            
            if (targetList) {
                targetList.classList.add('show');
            }
        });
    });
});