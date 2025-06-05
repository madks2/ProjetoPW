document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('editProfileForm');
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const tituloProfissionalInput = document.getElementById('tituloProfissional');
    const miniResumoTextarea = document.getElementById('miniResumo');

    function loadProfileData() {
        const userDataString = localStorage.getItem('userDataCandidato');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            if (userData.profilePhoto) {
                profilePhotoPreview.src = userData.profilePhoto;
            } else {
                profilePhotoPreview.src = "../assets/default-avatar.png";
            }
            tituloProfissionalInput.value = userData.tituloProfissional || '';
            miniResumoTextarea.value = userData.miniResumo || '';
        }
    }

    if (profilePhotoInput) {
        profilePhotoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhotoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userDataString = localStorage.getItem('userDataCandidato');
            let userData = userDataString ? JSON.parse(userDataString) : {};
            userData.profilePhoto = profilePhotoPreview.src;
            userData.tituloProfissional = tituloProfissionalInput.value;
            userData.miniResumo = miniResumoTextarea.value;
            localStorage.setItem('userDataCandidato', JSON.stringify(userData));
            alert('Perfil atualizado com sucesso!');
            window.location.href = 'feed.html';
        });
    }

    loadProfileData();
});