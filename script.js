document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const usuarioInput = document.getElementById("txtUsuario");
    const senhaInput = document.getElementById("txtSenha");
    
    // Simulação de um banco de dados para os usuarios cadastrarem 
    const usuariosCadastrados = [
        { usuario: "usuario1", email: "usuario1@email.com", senha: "senha123" },
        { usuario: "usuario2", email: "usuario2@email.com", senha: "senha456" }
    ];

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 

        const usuarioDigitado = usuarioInput.value.trim();
        const senhaDigitada = senhaInput.value.trim();

        // Verifica se o usuário e senha estão na nossa lista
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

    });
