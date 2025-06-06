document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('editProfileForm');
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const tituloProfissionalInput = document.getElementById('tituloProfissional');
    const nomeCompletoInput = document.getElementById('nomeCompleto');

    let newProfilePhotoDataURL = null;

    function loadProfileData() {
        const userDataString = localStorage.getItem('userDataCandidato');
        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                if (userData.profilePhoto && userData.profilePhoto !== "null" && userData.profilePhoto !== "") {
                    profilePhotoPreview.src = userData.profilePhoto;
                    newProfilePhotoDataURL = userData.profilePhoto;
                } else {
                    profilePhotoPreview.src = "";
                    newProfilePhotoDataURL = "";
                }
                nomeCompletoInput.value = userData.nomeCompleto || '';
                tituloProfissionalInput.value = userData.tituloProfissional || '';
            } catch (e) {
                profilePhotoPreview.src = "";
                newProfilePhotoDataURL = "";
            }
        } else {
            profilePhotoPreview.src = "";
            newProfilePhotoDataURL = "";
        }
    }

    if (profilePhotoInput) {
        profilePhotoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhotoPreview.src = e.target.result;
                    newProfilePhotoDataURL = e.target.result;
                };
                reader.onerror = function(e) {
                    alert('Erro ao carregar a imagem. Tente novamente.');
                };
                reader.readAsDataURL(file);
            } else {
                newProfilePhotoDataURL = localStorage.getItem('userDataCandidato') ? (JSON.parse(localStorage.getItem('userDataCandidato')).profilePhoto || "") : "";
                profilePhotoPreview.src = newProfilePhotoDataURL;
            }
        });
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const userDataString = localStorage.getItem('userDataCandidato');
            let userData = userDataString ? JSON.parse(userDataString) : {};

            userData.profilePhoto = newProfilePhotoDataURL;
            userData.nomeCompleto = nomeCompletoInput.value;
            userData.tituloProfissional = tituloProfissionalInput.value;

            localStorage.setItem('userDataCandidato', JSON.stringify(userData));
            alert('Perfil atualizado com sucesso!');
            window.location.href = 'feed.html';
        });
    }

    loadProfileData();
});