document.addEventListener('DOMContentLoaded', function() {
    // Máscaras de campos
    function applyMasks() {
        // Máscara de CNPJ
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
        
        // Máscara de telefone
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
    }
    
    // Toggle de senha
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
    
    // Validação de formulário de cadastro
    function setupRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const senha = document.getElementById('senha').value;
                const confirmSenha = document.getElementById('confirmSenha').value;
                
                if (senha !== confirmSenha) {
                    alert('As senhas não coincidem!');
                    return;
                }
                
                // Coletar todos os dados
                const empresaData = {
                    razaoSocial: document.getElementById('razaoSocial').value,
                    cnpj: document.getElementById('cnpj').value,
                    telefone: document.getElementById('telefone').value,
                    email: document.getElementById('email').value,
                    responsavel: document.getElementById('responsavel').value,
                    cargo: document.getElementById('cargo').value,
                    senha: senha
                };
                
                // Salvar no localStorage
                localStorage.setItem('empresaData', JSON.stringify(empresaData));
                localStorage.setItem('lastEmpresaEmail', empresaData.email);
                
                alert('Cadastro realizado com sucesso!');
                window.location.href = 'login-empresa.html';
            });
        }
    }
    
    // Validação de formulário de login
    function setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            // Preencher e-mail automaticamente se existir
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
                    alert('Login realizado com sucesso!');
                    // Redirecionar para dashboard ou área logada
                } else {
                    alert('E-mail ou senha incorretos!');
                }
            });
        }
    }
    
    // Inicialização
    applyMasks();
    setupPasswordToggles();
    setupRegisterForm();
    setupLoginForm();
});