document.addEventListener('DOMContentLoaded', () => {
    const headerProfile = document.querySelector('.header-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');

    if (headerProfile && profileDropdown) {
        headerProfile.addEventListener('click', (event) => {
            event.stopPropagation();
            profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (event) => {
            if (!headerProfile.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.style.display = 'none';
            }
        });
    }

    const uploadPicInput = document.getElementById('upload-pic');
    const myPicture = document.querySelector('.profile-card-container .my-picture');
    const headerProfilePic = document.getElementById('header-profile-pic');

    if (uploadPicInput && myPicture && headerProfilePic) {
        uploadPicInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    myPicture.src = e.target.result;
                    headerProfilePic.src = e.target.result;
                    localStorage.setItem('userProfilePicture', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const savedProfilePic = localStorage.getItem('userProfilePicture');
    if (savedProfilePic) {
        if (myPicture) myPicture.src = savedProfilePic;
        if (headerProfilePic) headerProfilePic.src = savedProfilePic;
    } else {
        if (myPicture) myPicture.src = '../assets/placeholder-profile.png';
        if (headerProfilePic) headerProfilePic.src = '../assets/placeholder-profile.png';
    }

    const viewAllLink = document.querySelector('.view-all-link');

    function isUserLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    if (viewAllLink) {
        viewAllLink.addEventListener('click', (event) => {
            event.preventDefault();

            if (isUserLoggedIn()) {
                window.location.href = 'todas-as-vagas.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    let todasVagas = [];
    let vagasFiltradas = [];
    const containerVagas = document.getElementById('jobs-container');
    const formularioBusca = document.getElementById('filter-form');
    const mensagemStatus = document.getElementById('status-message');

    function mostrarCarregandoVagas() {
        if (containerVagas) {
            containerVagas.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Carregando vagas...</p>
                </div>
            `;
        }
    }

    function mostrarMensagemStatus(mensagem, tipo = 'success') {
        if (mensagemStatus) {
            mensagemStatus.innerHTML = `
                <div class="${tipo}-message">
                    <i class="fas fa-check-circle"></i> ${mensagem}
                </div>
            `;
            setTimeout(() => {
                mensagemStatus.innerHTML = '';
            }, 3000);
        }
    }

    function formatarTipoVaga(tipo) {
        const tipos = {
            'remoto': 'Remoto',
            'hibrido': 'Híbrido',
            'presencial': 'Presencial'
        };
        return tipos[tipo] || tipo;
    }

    function candidatarVaga(evento) {
        const botao = evento.currentTarget;
        const idVaga = botao.getAttribute('data-id');
        const vaga = todasVagas.find(v => v.id == idVaga);

        if (vaga) {
            mostrarMensagemStatus(`Você se candidatou para: ${vaga.titulo} na ${vaga.empresa}`, 'success');
            botao.innerHTML = '<i class="fas fa-check"></i> Candidatado';
            botao.disabled = true;
            botao.style.backgroundColor = "var(--success, #28a745)";
        }
    }

    function mostrarVagas() {
        if (!containerVagas) return;

        containerVagas.innerHTML = '';

        if (vagasFiltradas.length === 0) {
            containerVagas.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-search"></i> Nenhuma vaga encontrada com esses filtros.
                </div>
            `;
            return;
        }

        vagasFiltradas.forEach(vaga => {
            const cardVaga = document.createElement('div');
            cardVaga.className = 'job-card';
            cardVaga.innerHTML = `
                <div class="job-header">
                    <h3 class="job-title">${vaga.titulo}</h3>
                    <p class="job-company">
                        <i class="fas fa-building"></i> ${vaga.empresa}
                    </p>
                    <span class="job-type ${vaga.tipo}">${formatarTipoVaga(vaga.tipo)}</span>
                </div>

                <div class="job-body">
                    <div class="job-details">
                        <span class="job-detail">
                            <i class="fas fa-map-marker-alt"></i> ${vaga.localizacao}
                        </span>
                        <span class="job-detail">
                            <i class="fas fa-clock"></i> ${vaga.contrato}
                        </span>
                        <span class="job-detail job-salary">
                            <i class="fas fa-money-bill-wave"></i> ${vaga.salario}
                        </span>
                    </div>
                    <p>${vaga.descricao}</p>

                    <div class="job-skills" style="margin-top: 1rem;">
                        ${vaga.habilidades.map(habilidade => `<span class="skill-tag">${habilidade}</span>`).join('')}
                    </div>
                </div>

                <div class="job-footer">
                    <span class="job-posted">${vaga.postado}</span>
                    <button class="btn btn-primary apply-btn" data-id="${vaga.id}">
                        <i class="fas fa-paper-plane"></i> Candidatar
                    </button>
                </div>
            `;
            containerVagas.appendChild(cardVaga);
        });

        document.querySelectorAll('.apply-btn').forEach(button => {
            button.addEventListener('click', candidatarVaga);
        });
    }

    function carregarVagas() {
        mostrarCarregandoVagas();

        setTimeout(() => {
            todasVagas = [
                {
                    id: 1, titulo: "Desenvolvedor Front-end Pleno", empresa: "Inovatech Solutions", tipo: "remoto",
                    localizacao: "Remoto (Brasil)", contrato: "CLT", salario: "R$ 6.000 - 9.000",
                    descricao: "Desenvolvimento de interfaces web com React, Angular ou Vue.js.",
                    postado: "há 3 dias", habilidades: ["HTML", "CSS", "JavaScript", "React", "Git"]
                },
                {
                    id: 2, titulo: "Analista de Dados Júnior", empresa: "Data Insights Group", tipo: "hibrido",
                    localizacao: "São Paulo, SP", contrato: "CLT", salario: "R$ 4.500 - 6.500",
                    descricao: "Análise de grandes volumes de dados e criação de dashboards.",
                    postado: "há 5 dias", habilidades: ["SQL", "Python", "Power BI", "Excel"]
                },
                {
                    id: 3, titulo: "UX/UI Designer Sênior", empresa: "Criativa Studio", tipo: "presencial",
                    localizacao: "Curitiba, PR", contrato: "PJ", salario: "R$ 9.000 - 13.000",
                    descricao: "Criação e prototipagem de interfaces intuitivas e agradáveis.",
                    postado: "há 1 semana", habilidades: ["Figma", "Sketch", "Pesquisa de Usuário", "Design System"]
                },
                {
                    id: 4, titulo: "Engenheiro de Software Backend", empresa: "Global Tech", tipo: "remoto",
                    localizacao: "Remoto (Global)", contrato: "CLT", salario: "R$ 10.000 - 15.000",
                    descricao: "Desenvolvimento de APIs e serviços escaláveis com Node.js/Python.",
                    postado: "há 2 dias", habilidades: ["Node.js", "Python", "SQL", "APIs REST"]
                },
                {
                    id: 5, titulo: "Especialista em SEO", empresa: "Marketing Digital Pro", tipo: "hibrido",
                    localizacao: "Belo Horizonte, MG", contrato: "PJ", salario: "R$ 5.500 - 8.000",
                    descricao: "Otimização de sites para motores de busca e análise de performance.",
                    postado: "há 4 dias", habilidades: ["SEO", "Google Analytics", "Marketing de Conteúdo"]
                }
            ];

            vagasFiltradas = [...todasVagas];
            mostrarVagas();
        }, 1500);
    }

    function filtrarVagas(evento) {
        if (evento) evento.preventDefault();

        const termoInput = document.getElementById('search-term');
        const localInput = document.getElementById('search-location');

        const termo = termoInput ? termoInput.value.toLowerCase() : '';
        const local = localInput ? localInput.value.toLowerCase() : '';

        vagasFiltradas = todasVagas.filter(vaga => {
            const correspondeTermo = vaga.titulo.toLowerCase().includes(termo) ||
                                     vaga.descricao.toLowerCase().includes(termo) ||
                                     vaga.empresa.toLowerCase().includes(termo) ||
                                     vaga.habilidades.some(h => h.toLowerCase().includes(termo));

            const correspondeLocal = vaga.localizacao.toLowerCase().includes(local);

            return correspondeTermo && (local === '' || correspondeLocal);
        });

        mostrarVagas();
    }

    carregarVagas();

    if (formularioBusca) {
        formularioBusca.addEventListener('submit', filtrarVagas);
        const searchTermInput = document.getElementById('search-term');
        const searchLocationInput = document.getElementById('search-location');

        if (searchTermInput) searchTermInput.addEventListener('input', filtrarVagas);
        if (searchLocationInput) searchLocationInput.addEventListener('input', filtrarVagas);
    }

    const newsArticlesContainer = document.getElementById('news-articles');
    const loadingMessageNews = document.createElement('div');
    loadingMessageNews.classList.add('loading-message');
    loadingMessageNews.textContent = 'Carregando notícias...';
    loadingMessageNews.style.display = 'none';

    if (newsArticlesContainer) {
        newsArticlesContainer.appendChild(loadingMessageNews);
    }

    const fetchCurrentsTechNews = async () => {
        if (!newsArticlesContainer) return;

        loadingMessageNews.style.display = 'block';
        newsArticlesContainer.innerHTML = '';
        newsArticlesContainer.appendChild(loadingMessageNews);

        const CURRENTS_API_KEY = 'HlLb-xiZZ7JQNlzWgrmsPvXQI2k8ABdRjK699Pk_FYyNXVQB';
        const CURRENTS_API_URL = `https://api.currentsapi.services/v1/latest-news?language=pt&keywords=tecnologia&category=technology&apiKey=${CURRENTS_API_KEY}`;

        try {
            const response = await fetch(CURRENTS_API_URL);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro na resposta da API da Currents:', errorData);
                throw new Error(`Erro da API da Currents: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
            }

            const data = await response.json();
            const articles = data.news;

            if (articles.length === 0) {
                newsArticlesContainer.innerHTML = '<p>Nenhuma notícia de tecnologia encontrada no momento pela Currents API.</p>';
            } else {
                articles.slice(0, 5).forEach(article => {
                    const newsElement = document.createElement('div');
                    newsElement.classList.add('news-article');
                    newsElement.innerHTML = `
                        <h5><a href="${article.url}" target="_blank" rel="noopener">${article.title}</a></h5>
                        <p>${article.description || ''}</p>
                        ${article.image ? `<img src="${article.image}" alt="Imagem da notícia" style="max-width:100%; height:auto;">` : ''}
                    `;
                    newsArticlesContainer.appendChild(newsElement);
                });
            }
        } catch (error) {
            console.error('Erro ao buscar notícias da Currents API:', error);
            newsArticlesContainer.innerHTML = '<p class="error-message">Não foi possível carregar as notícias no momento. Tente novamente mais tarde.</p>';
        } finally {
            if (loadingMessageNews) loadingMessageNews.style.display = 'none';
        }
    };

    fetchCurrentsTechNews();

    function loadUserName() {
        const profileUserNameElement = document.getElementById('profile-user-name');
        const headerUserNameElement = document.getElementById('header-user-name');
        const userDataString = localStorage.getItem('userDataCandidato');

        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                const userName = userData.nome;

                if (userName) {
                    if (profileUserNameElement) {
                        profileUserNameElement.textContent = userName;
                    }
                    if (headerUserNameElement) {
                        const arrowIcon = headerUserNameElement.querySelector('.ri-arrow-down-s-fill');
                        headerUserNameElement.textContent = userName + ' ';
                        if (arrowIcon) {
                            headerUserNameElement.appendChild(arrowIcon);
                        }
                    }
                } else {
                    if (profileUserNameElement) profileUserNameElement.textContent = "Meu Perfil";
                    if (headerUserNameElement) {
                        const arrowIcon = headerUserNameElement.querySelector('.ri-arrow-down-s-fill');
                        headerUserNameElement.textContent = "Eu ";
                        if (arrowIcon) headerUserNameElement.appendChild(arrowIcon);
                    }
                }
            } catch (e) {
                console.error("Erro ao fazer parse de userDataCandidato do localStorage:", e);
                if (profileUserNameElement) profileUserNameElement.textContent = "Meu Perfil";
                if (headerUserNameElement) {
                    const arrowIcon = headerUserNameElement.querySelector('.ri-arrow-down-s-fill');
                    headerUserNameElement.textContent = "Eu ";
                    if (arrowIcon) headerUserNameElement.appendChild(arrowIcon);
                }
            }
        } else {
            if (profileUserNameElement) profileUserNameElement.textContent = "Meu Perfil";
            if (headerUserNameElement) {
                const arrowIcon = headerUserNameElement.querySelector('.ri-arrow-down-s-fill');
                headerUserNameElement.textContent = "Eu ";
                if (arrowIcon) headerUserNameElement.appendChild(arrowIcon);
            }
        }
    }

    loadUserName();

    const profileDescriptionDisplayElement = document.getElementById('profileDescriptionDisplay');
    const editProfileModal = document.getElementById('editProfileModal');
    const profileDescriptionInput = document.getElementById('profileDescriptionInput');
    const editProfileForm = document.getElementById('editProfileForm');
    const editProfileButton = document.querySelector('.edit-profile-button.edit-pic-button');

    function loadAndDisplayProfileDescription() {
        const storedDescription = localStorage.getItem('userProfileDescription');
        if (profileDescriptionDisplayElement) {
            profileDescriptionDisplayElement.textContent = storedDescription || "Adicione uma descrição ao seu perfil!";
        }
    }

    function openEditProfileModal() {
        if (editProfileModal && profileDescriptionInput) {
            editProfileModal.style.display = 'block';
            const currentDescription = localStorage.getItem('userProfileDescription');
            profileDescriptionInput.value = currentDescription || '';
        }
    }

    function closeEditProfileModal() {
        if (editProfileModal) {
            editProfileModal.style.display = 'none';
        }
    }

    if (editProfileButton) {
        editProfileButton.addEventListener('click', (e) => {
            e.preventDefault();
            openEditProfileModal();
        });
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newDescription = profileDescriptionInput.value;
            localStorage.setItem('userProfileDescription', newDescription);

            alert('Descrição do perfil salva com sucesso!');
            loadAndDisplayProfileDescription();
            closeEditProfileModal();
        });
    }

    const cancelEditButton = document.querySelector('#editProfileModal button[type="button"]');
    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', closeEditProfileModal);
    }

    loadAndDisplayProfileDescription();
});