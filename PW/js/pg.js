var todasVagas = [];
var vagasFiltradas = [];
var containerVagas = document.getElementById('jobs-container');
var formularioBusca = document.getElementById('filter-form');
var mensagemStatus = document.getElementById('status-message');

const viewAllLink = document.querySelector('.view-all-link');

function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

window.addEventListener('DOMContentLoaded', function() {
    carregarVagas();
});

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

function carregarVagas() {
    mostrarCarregando();
    
    setTimeout(function() {
        todasVagas = [
            {
                id: 1,
                titulo: "Desenvolvedor Front-end",
                empresa: "Tech Solutions",
                tipo: "remoto",
                localizacao: "Remoto (Brasil)",
                contrato: "CLT",
                salario: "R$ 8.000 - 10.000",
                descricao: "Vaga para desenvolvedor com experiência em React e JavaScript.",
                postado: "há 2 dias",
                habilidades: ["HTML", "CSS", "JavaScript", "React"]
            },
            {
                id: 2,
                titulo: "Analista de Marketing",
                empresa: "Digital Growth",
                tipo: "hibrido",
                localizacao: "São Paulo",
                contrato: "PJ",
                salario: "R$ 6.000 - 8.000",
                descricao: "Vaga para analista com conhecimento em redes sociais e SEO.",
                postado: "há 1 semana",
                habilidades: ["Marketing", "Redes Sociais", "SEO"]
            },
            {
                id: 3,
                titulo: "Gerente de Projetos",
                empresa: "Consultoria Global",
                tipo: "presencial",
                localizacao: "Rio de Janeiro",
                contrato: "CLT",
                salario: "R$ 12.000 - 15.000",
                descricao: "Gerente com experiência em metodologias ágeis.",
                postado: "hoje",
                habilidades: ["Scrum", "Gestão", "Liderança"]
            }
        ];
        
        vagasFiltradas = todasVagas.slice();
        mostrarVagas();
    }, 1000);
}

function mostrarVagas() {
    containerVagas.innerHTML = '';
    
    if (vagasFiltradas.length === 0) {
        containerVagas.innerHTML = `
            <div class="error-message">
                <i class="fas fa-search"></i> Nenhuma vaga encontrada com esses filtros.
            </div>
        `;
        return;
    }
    
    vagasFiltradas.forEach(function(vaga) {
        var cardVaga = document.createElement('div');
        cardVaga.className = 'job-card';
        cardVaga.innerHTML = `
            <div class="job-header">
                <h3 class="job-title">${vaga.titulo}</h3>
                <p class="job-company">
                    <i class="fas fa-building"></i> ${vaga.empresa}
                </p>
                <span class="job-type ${vaga.tipo}">${formatarTipo(vaga.tipo)}</span>
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
                    ${vaga.habilidades.map(function(habilidade) {
                        return `<span class="skill-tag">${habilidade}</span>`;
                    }).join('')}
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
    
    document.querySelectorAll('.apply-btn').forEach(function(botao) {
        botao.addEventListener('click', candidatarVaga);
    });
}

function formatarTipo(tipo) {
    var tipos = {
        'remoto': 'Remoto',
        'hibrido': 'Híbrido',
        'presencial': 'Presencial'
    };
    return tipos[tipo] || tipo;
}

function candidatarVaga(evento) {
    var botao = evento.target;
    var idVaga = botao.getAttribute('data-id');
    var vaga = todasVagas.find(function(v) { return v.id == idVaga; });
    
    mostrarMensagemSucesso(`Você se candidatou para: ${vaga.titulo} na ${vaga.empresa}`);
    
    botao.innerHTML = '<i class="fas fa-check"></i> Candidatado';
    botao.disabled = true;
    botao.style.backgroundColor = "var(--success)";
}

function filtrarVagas(evento) {
    if (evento) evento.preventDefault();
    
    var termo = document.getElementById('search-term').value.toLowerCase();
    var local = document.getElementById('search-location').value.toLowerCase();
    
    vagasFiltradas = todasVagas.filter(function(vaga) {
        var correspondeTermo = vaga.titulo.toLowerCase().includes(termo) || 
                                vaga.descricao.toLowerCase().includes(termo) ||
                                vaga.empresa.toLowerCase().includes(termo) ||
                                vaga.habilidades.some(function(h) { 
                                    return h.toLowerCase().includes(termo); 
                                });
        
        var correspondeLocal = vaga.localizacao.toLowerCase().includes(local);
        
        return correspondeTermo && (local === '' || correspondeLocal);
    });
    
    mostrarVagas();
}

function mostrarCarregando() {
    containerVagas.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Carregando vagas...</p>
        </div>
    `;
}

function mostrarMensagemSucesso(mensagem) {
    mensagemStatus.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i> ${mensagem}
        </div>
    `;
    
    setTimeout(function() {
        mensagemStatus.innerHTML = '';
    }, 3000);
}

if (formularioBusca) {
    formularioBusca.addEventListener('submit', filtrarVagas);
    document.getElementById('search-term')?.addEventListener('input', filtrarVagas);
    document.getElementById('search-location')?.addEventListener('input', filtrarVagas);
}