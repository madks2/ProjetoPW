document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const cidadeInput = document.getElementById('cidade');
    const complementoInput = document.getElementById('complemento');
    const numeroInput = document.getElementById('numero');
    const cepError = document.getElementById('cepError');

    const termosCheckbox = document.getElementById('termos');
    const registerButton = document.getElementById('registerButton');

    if (registerButton) {
        registerButton.disabled = true;
    }

    if (termosCheckbox && registerButton) {
        termosCheckbox.addEventListener('change', function() {
            registerButton.disabled = !this.checked;
        });
    }

    function applyMasks() {
        const cnpjInput = document.getElementById('cnpj');
        if (cnpjInput) {
            cnpjInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 14) {
                    value = value.substring(0, 14);
                }
                if (value.length > 0) {
                    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                }
                if (value.length > 3) {
                    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                }
                if (value.length > 7) {
                    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                }
                if (value.length > 11) {
                    value = value.replace(/\/(\d{4})(\d)/, '/$1-$2');
                }
                e.target.value = value;
            });
        }

        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) {
                    value = value.substring(0, 11);
                }
                if (value.length > 0) {
                    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                }
                if (value.length > 10) {
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
                e.target.value = value;
            });
        }

        if (cepInput) {
            cepInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 8) {
                    value = value.substring(0, 8);
                }
                if (value.length > 5) {
                    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                }
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
    }

    function setupPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const input = this.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('ri-eye-line');
                this.classList.toggle('ri-eye-off-line');
            });
        });
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

    function setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                if (!termosCheckbox.checked) {
                    alert('Você deve aceitar os Termos Comerciais para cadastrar a empresa.');
                    return;
                }

                const senha = document.getElementById('senha').value;
                const confirmSenha = document.getElementById('confirmSenha').value;

                if (senha !== confirmSenha) {
                    alert('As senhas não coincidem!');
                    return;
                }

                const cepLimpo = cepInput.value.replace(/\D/g, '');
                let enderecoCompletoAPI = {};
                if (cepLimpo.length === 8) {
                    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                    const data = await response.json();
                    if (!data.erro) {
                        enderecoCompletoAPI = data;
                    }
                }

                const empresaData = {
                    razaoSocial: document.getElementById('razaoSocial').value,
                    cnpj: document.getElementById('cnpj').value,
                    telefone: document.getElementById('telefone').value,
                    cep: cepInput ? cepInput.value.replace(/\D/g, '') : '',
                    rua: ruaInput ? ruaInput.value : '',
                    complemento: complementoInput ? complementoInput.value : '',
                    numero: numeroInput ? numeroInput.value : '',
                    bairro: enderecoCompletoAPI.bairro || '',
                    cidade: enderecoCompletoAPI.localidade || '',
                    estado: enderecoCompletoAPI.uf || '',
                    email: document.getElementById('email').value,
                    responsavel: document.getElementById('responsavel') ? document.getElementById('responsavel').value : '',
                    cargo: document.getElementById('cargo') ? document.getElementById('cargo').value : '',
                    senha: senha
                };

                localStorage.setItem('empresaData', JSON.stringify(empresaData));
                localStorage.setItem('companyName', empresaData.razaoSocial);
                localStorage.setItem('companyLocation', (empresaData.cidade || '') + ' - ' + (empresaData.estado || '')); 
                localStorage.setItem('companyAuthToken', 'simulated_token_for_company_' + empresaData.email);

                alert('Cadastro realizado com sucesso! Faça login para continuar.');
                window.location.href = '../html/login-empresa.html';
            });
        }
    }

    function setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            const savedEmail = localStorage.getItem('lastEmpresaEmail');
            if (savedEmail) {
                document.getElementById('email').value = savedEmail;
            }

            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const senha = document.getElementById('senha').value;
                const empresaData = JSON.parse(localStorage.getItem('empresaData'));

                if (empresaData && empresaData.email === email && empresaData.senha === senha) {
                    localStorage.setItem('companyName', empresaData.razaoSocial);
                    localStorage.setItem('companyAuthToken', 'simulated_token_for_company_' + empresaData.email);
                    
                    if (empresaData.cidade && empresaData.estado) {
                        localStorage.setItem('companyLocation', empresaData.cidade + ' - ' + empresaData.estado);
                    }
                    
                    alert('Login realizado com sucesso!');
                    window.location.href = '../html/feed-empresa.html';
                } else {
                    alert('E-mail ou senha incorretos!');
                }
            });
        }
    }

    applyMasks();
    setupPasswordToggles();
    setupRegisterForm();
    setupLoginForm();
});