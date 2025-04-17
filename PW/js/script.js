document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.querySelector("#login");
    const formCadastro = document.querySelector("#cadastro");

    if (formLogin) {
        const usuarioInput = document.getElementById("txtUsuario");
        const senhaInput = document.getElementById("txtSenha");

        const usuariosCadastrados = [
            { usuario: "usuario1", email: "usuario1@email.com", senha: "senha123" },
            { usuario: "usuario2", email: "usuario2@email.com", senha: "senha456" }
        ];

        formLogin.addEventListener("submit", function (event) {
            event.preventDefault(); 

            const usuarioDigitado = usuarioInput.value.trim();
            const senhaDigitada = senhaInput.value.trim();

            const usuarioEncontrado = usuariosCadastrados.find(
                (user) => (user.usuario === usuarioDigitado || user.email === usuarioDigitado) && user.senha === senhaDigitada
            );

            if (usuarioEncontrado) {
                alert("Login bem-sucedido! Redirecionando...");
                window.location.href = "dashboard.html";  
            } else {
                alert("Usuário ou senha incorretos! Verifique e tente novamente.");
            }
        });
    }

    if (formCadastro) {
        const formCadastro = document.querySelector("#cadastro");
        
        formCadastro.addEventListener("submit", function (event) {
            event.preventDefault();
            alert("Cadastro bem-sucedido!");
            window.location.href = "login.html"; 
        });
    }

    document.getElementById("loginButton").addEventListener("click", function() {
        window.location.href = "login.html";
    });

    document.getElementById("cadastroButton").addEventListener("click", function() {
        window.location.href = "cadastro.html";
    });

    const togglePassword = document.getElementById("togglePassword");
    const senhaInput = document.getElementById("txtSenha");

    if (togglePassword && senhaInput) {
        togglePassword.addEventListener("click", function () {
            const isPassword = senhaInput.getAttribute('type') === 'password';
            senhaInput.setAttribute('type', isPassword ? 'text' : 'password');

            togglePassword.classList.toggle('ri-eye-line', isPassword);
            togglePassword.classList.toggle('ri-eye-off-line', !isPassword);
        });
    }
});
