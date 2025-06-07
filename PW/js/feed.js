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

    const headerProfilePic = document.getElementById('header-profile-pic');
    const myPicture = document.getElementById('my-profile-pic');
    const profileUserNameElement = document.getElementById('profile-user-name');
    const headerUserNameElement = document.getElementById('header-user-name');
    const profileTituloProfissionalElement = document.getElementById('profile-titulo-profissional');

    function loadAndDisplayProfileData() {
        const userDataString = localStorage.getItem('userDataCandidato');
        let userData = {};

        if (userDataString) {
            try {
                userData = JSON.parse(userDataString);
            } catch (e) {
                console.error("Erro ao fazer parse de userDataCandidato do localStorage:", e);
            }
        }

        const profilePhoto = userData.profilePhoto || '';
        if (myPicture) myPicture.src = profilePhoto;
        if (headerProfilePic) headerProfilePic.src = profilePhoto;

        const personName = userData.nomeCompleto || 'Novo Usuário';
        const professionalTitle = userData.tituloProfissional || 'Adicione seu Cargo';

        if (profileUserNameElement) {
            profileUserNameElement.textContent = personName;
        }
        if (headerUserNameElement) {
            const arrowIcon = headerUserNameElement.querySelector('.ri-arrow-down-s-fill');
            headerUserNameElement.textContent = personName + ' ';
            if (arrowIcon) {
                headerUserNameElement.appendChild(arrowIcon);
            }
        }

        if (profileTituloProfissionalElement) {
            profileTituloProfissionalElement.textContent = professionalTitle;
        }
    }

    loadAndDisplayProfileData();

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

 const fetchWeatherData = async (city) => {
        const weatherCard = document.getElementById('weather-card');
        if (!weatherCard) return;

        const WEATHER_API_KEY = 'f574f6a8d4a724d94851ed01d1a45cc3';

        const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`;

        try {
            const response = await fetch(WEATHER_API_URL);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados do clima: ${response.statusText}`);
            }
            const data = await response.json();

            const temperature = Math.round(data.main.temp);
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherCard.innerHTML = `
                <h4>Clima em ${city}</h4>
                <div class="weather-info">
                    <img src="${iconUrl}" alt="${description}" class="weather-icon">
                    <p>${temperature}°C</p>
                    <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
                </div>
            `;
        } catch (error) {
            console.error("Erro ao carregar clima:", error);
            weatherCard.innerHTML = `
                <h4>Clima</h4>
                <p class="error-message">Não foi possível carregar o clima.</p>
            `;
        }
    };

    const userDataString = localStorage.getItem('userDataCandidato');
    let userData = {};

    if (userDataString) {
        try {
            userData = JSON.parse(userDataString);
        } catch (e) {
            console.error("Erro ao fazer parse de userDataCandidato do localStorage:", e);
        }
    }

    const userCity = userData.cidade || 'Sao Paulo';

    fetchWeatherData(userCity);
});