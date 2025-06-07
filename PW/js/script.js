var todasVagas = [];
var vagasFiltradas = [];
var containerVagas = document.getElementById('jobs-container');
var formularioBusca = document.getElementById('filter-form');
var mensagemStatus = document.getElementById('status-message');
const viewAllLink = document.querySelector('.view-all-link');

const cepInput = document.getElementById('cepCandidato');
const ruaInput = document.getElementById('ruaCandidato');
const cidadeInput = document.getElementById('cidadeCandidato');
const complementoInput = document.getElementById('complementoCandidato');
const numeroInput = document.getElementById('numeroCandidato');
const cepError = document.getElementById('cepErrorCandidato');


function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    icon.classList.toggle('ri-eye-line');
    icon.classList.toggle('ri-eye-off-line');
}

function isUserLoggedIn(userType) {
    return localStorage.getItem('isLoggedIn' + userType) === 'true';
}

function setupPhoneMask(inputId) {
    const telefoneInput = document.getElementById(inputId);
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            if (value.length > 0) value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            if (value.length > 10) value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }
}

function validateAge(dateInputId, buttonId, errorMsgId) {
    const dataNascimento = document.getElementById(dateInputId);
    const registerButton = document.getElementById(buttonId);
    const idadeError = document.getElementById(errorMsgId);

    if (dataNascimento && registerButton && idadeError) {
        dataNascimento.addEventListener('change', function () {
            const hoje = new Date();
            const nascimento = new Date(this.value);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const mes = hoje.getMonth() - nascimento.getMonth();

            if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;

            if (idade >= 18) {
                const termosCheckbox = document.getElementById('termos');
                if (termosCheckbox && termosCheckbox.checked) {
                    registerButton.disabled = false;
                }
                idadeError.textContent = '';
            } else {
                registerButton.disabled = true;
                idadeError.textContent = 'Você deve ter 18 anos ou mais para se cadastrar';
            }
        });
    }
}

async function fetchAddressByCep(cep) {
    if (cepError) cepError.style.display = 'none';
    clearAddressFields();

    if (!cep || cep.length !== 8) {
        if (cepError) {
            cepError.textContent = 'CEP inválido. Deve ter 8 dígitos.';
            cepError.style.display = 'block';
        }
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            if (cepError) {
                cepError.textContent = 'CEP não encontrado.';
                cepError.style.display = 'block';
            }
            clearAddressFields();
            return;
        }

        if (ruaInput) ruaInput.value = data.logradouro || '';
        if (cidadeInput) cidadeInput.value = data.localidade || '';

    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        if (cepError) {
            cepError.textContent = 'Erro ao buscar CEP. Verifique sua conexão ou tente novamente.';
        }
        clearAddressFields();
    }
}

function clearAddressFields() {
    if (ruaInput) ruaInput.value = '';
    if (cidadeInput) cidadeInput.value = '';
}


function setupLoginCandidato() {
  const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const savedEmail = localStorage.getItem('lastRegisteredEmailCandidato');
        if (savedEmail) document.getElementById('email').value = savedEmail;

        const toggleIcon = loginForm.querySelector('.toggle-password');
        if (toggleIcon) {
            toggleIcon.id = 'togglePasswordLogin';
            toggleIcon.addEventListener('click', function () {
                togglePasswordVisibility('senha', 'togglePasswordLogin');
            });
        }

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const userData = JSON.parse(localStorage.getItem('userDataCandidato'));

            if (userData && userData.email === email && userData.senha === senha) {
                alert('Login de Candidato realizado com sucesso!');
                localStorage.setItem('isLoggedInCandidato', 'true');
                localStorage.setItem('candidatoEmail', userData.email);
                localStorage.setItem('candidatoNomeCompleto', userData.nome);
                localStorage.setItem('candidatoCep', userData.cep);
                localStorage.setItem('candidatoRua', userData.rua);
                localStorage.setItem('candidatoNumero', userData.numero);
                localStorage.setItem('candidatoComplemento', userData.complemento);
                localStorage.setItem('candidatoBairro', userData.bairro);
                localStorage.setItem('candidatoCidade', userData.cidade);
                localStorage.setItem('candidatoEstado', userData.estado);

                window.location.href = '../html/feed.html';
            } else {
                alert('E-mail ou senha de Candidato incorretos!');
            }
        });
    }
}


function setupRegisterCandidato() {
    const registerForm = document.getElementById('registerFormCandidato');
    if (registerForm) {
        document.getElementById('toggleCadPasswordCandidato')?.addEventListener('click', function () {
            togglePasswordVisibility('cadSenhaCandidato', 'toggleCadPasswordCandidato');
        });
        document.getElementById('toggleConfirmaPasswordCandidato')?.addEventListener('click', function () {
            togglePasswordVisibility('confirmSenhaCandidato', 'toggleConfirmaPasswordCandidato');
        });

        if (cepInput) {
            cepInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 8) value = value.substring(0, 8);
                if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
            });

            cepInput.addEventListener('blur', async function(e) {
                const cep = e.target.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    await fetchAddressByCep(cep);
                } else {
                    clearAddressFields();
                    if (cepError) {
                        cepError.textContent = 'CEP inválido ou incompleto (8 dígitos são necessários).';
                        cepError.style.display = 'block';
                    }
                }
            });
        }


        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const senha = document.getElementById('cadSenhaCandidato').value;
            const confirmSenha = document.getElementById('confirmSenhaCandidato').value;
            const termosCheckbox = document.getElementById('termos');
            const dataNascimento = document.getElementById('dataNascimentoCandidato');
            const idadeError = document.getElementById('idadeErrorCandidato');


            if (senha !== confirmSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            if (!termosCheckbox || !termosCheckbox.checked) {
                alert('Você deve aceitar os Termos de Serviço e Política de Privacidade.');
                return;
            }

            const hoje = new Date();
            const nascimento = new Date(dataNascimento.value);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const mes = hoje.getMonth() - nascimento.getMonth();

            if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;

            if (idade < 18) {
                alert('Você deve ter 18 anos ou mais para se cadastrar.');
                return;
            }
            
            const cepLimpo = cepInput.value.replace(/\D/g, '');
            let enderecoCompletoAPI = {};
            if (cepLimpo.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                    const data = await response.json();
                    if (!data.erro) {
                        enderecoCompletoAPI = data;
                    } else {
                        alert('CEP não encontrado ou inválido. Por favor, verifique.');
                        return;
                    }
                } catch (error) {
                    console.error('Erro ao buscar CEP durante o cadastro:', error);
                    alert('Erro ao buscar CEP. Verifique sua conexão ou tente novamente.');
                    return;
                }
            } else {
                 alert('Por favor, insira um CEP válido com 8 dígitos.');
                 return;
            }


            const userData = {
                nome: document.getElementById('nomeCandidato').value,
                dataNascimento: dataNascimento.value,
                telefone: document.getElementById('telefoneCandidato').value,
                email: document.getElementById('emailCandidatoRegister').value,
                senha: senha,
                cep: cepInput.value.replace(/\D/g, ''),
                rua: ruaInput.value,
                numero: numeroInput.value,
                complemento: complementoInput.value,
                bairro: enderecoCompletoAPI.bairro || '',
                cidade: enderecoCompletoAPI.localidade || '',
                estado: enderecoCompletoAPI.uf || '',
            };

            localStorage.setItem('userDataCandidato', JSON.stringify(userData));
            localStorage.setItem('lastRegisteredEmailCandidato', userData.email);

            alert('Cadastro de Candidato realizado com sucesso!');
            window.location.href = '../html/login.html';
        });
    }
}


function carregarVagas() {
    mostrarCarregando();

    setTimeout(function () {
        todasVagas = [
            { id: 1, titulo: "Desenvolvedor Front-end", empresa: "Tech Solutions", tipo: "remoto", localizacao: "Remoto (Brasil)", contrato: "CLT", salario: "R$ 8.000 - 10.000", descricao: "Vaga para desenvolvedor com experiência em React e JavaScript.", postado: "há 2 dias", habilidades: ["HTML", "CSS", "JavaScript", "React"] },
            { id: 2, titulo: "Analista de Marketing", empresa: "Digital Growth", tipo: "hibrido", localizacao: "São Paulo", contrato: "PJ", salario: "R$ 6.000 - 8.000", descricao: "Vaga para analista com conhecimento em redes sociais e SEO.", postado: "há 1 semana", habilidades: ["Marketing", "Redes Sociais", "SEO"] },
            { id: 3, titulo: "Gerente de Projetos", empresa: "Consultoria Global", tipo: "presencial", localizacao: "Rio de Janeiro", contrato: "CLT", salario: "R$ 12.000 - 15.000", descricao: "Gerente com experiência em metodologias ágeis.", postado: "hoje", habilidades: ["Scrum", "Gestão", "Liderança"] }
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

    vagasFiltradas.forEach(function (vaga) {
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
                    ${vaga.habilidades.map(function (habilidade) {
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

    document.querySelectorAll('.apply-btn').forEach(function (botao) {
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
    var vaga = todasVagas.find(function (v) { return v.id == idVaga; });

    mostrarMensagemSucesso(`Você se candidatou para: ${vaga.titulo} na ${vaga.empresa}`);

    botao.innerHTML = '<i class="fas fa-check"></i> Candidatado';
    botao.disabled = true;
    botao.style.backgroundColor = "var(--success)";
}

function filtrarVagas(evento) {
    if (evento) evento.preventDefault();

    var termo = document.getElementById('search-term').value.toLowerCase();
    var local = document.getElementById('search-location').value.toLowerCase();

    vagasFiltradas = todasVagas.filter(function (vaga) {
        var correspondeTermo = vaga.titulo.toLowerCase().includes(termo) ||
            vaga.descricao.toLowerCase().includes(termo) ||
            vaga.empresa.toLowerCase().includes(termo) ||
            vaga.habilidades.some(function (h) {
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

    setTimeout(function () {
        mensagemStatus.innerHTML = '';
    }, 3000);
}

if (formularioBusca) {
    formularioBusca.addEventListener('submit', filtrarVagas);
    document.getElementById('search-term')?.addEventListener('input', filtrarVagas);
    document.getElementById('search-location')?.addEventListener('input', filtrarVagas);
}

document.addEventListener('DOMContentLoaded', function () {
    if (viewAllLink) {
        viewAllLink.addEventListener('click', (event) => {
            event.preventDefault();
            if (isUserLoggedIn('Candidato')) {
                window.location.href = '../html/index.html';
            } else {
                window.location.href = '../html/login.html';
            }
        });
    }

    if (containerVagas) {
        carregarVagas();
    }

    setupLoginCandidato();
    setupPhoneMask('telefoneCandidato');
    validateAge('dataNascimentoCandidato', 'registerButtonCandidato', 'idadeErrorCandidato');
    setupRegisterCandidato();
});