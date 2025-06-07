document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('editProfileForm');
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const companyTaglineEdit = document.getElementById('companyTaglineEdit');

    let newProfilePhotoDataURL = null;

    function loadCompanyProfileData() {
        const companyDataString = localStorage.getItem('companyProfileData');
        if (companyDataString) {
            try {
                const companyData = JSON.parse(companyDataString);
                if (companyData.profilePhoto && companyData.profilePhoto !== "null" && companyData.profilePhoto !== "") {
                    profilePhotoPreview.src = companyData.profilePhoto;
                    newProfilePhotoDataURL = companyData.profilePhoto;
                } else {
                    profilePhotoPreview.src = "";
                    newProfilePhotoDataURL = "";
                }
                companyTaglineEdit.value = companyData.tagline || '';
            } catch (e) {
                console.error('Error parsing companyProfileData from localStorage:', e);
                profilePhotoPreview.src = "";
                newProfilePhotoDataURL = "";
                companyTaglineEdit.value = '';
            }
        } else {
            profilePhotoPreview.src = "";
            newProfilePhotoDataURL = "";
            companyTaglineEdit.value = '';
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
                    console.error('FileReader error:', e);
                    alert('Erro ao carregar a imagem. Tente novamente.');
                };
                reader.readAsDataURL(file);
            } else {
                const currentData = localStorage.getItem('companyProfileData');
                if (currentData) {
                    const parsedData = JSON.parse(currentData);
                    newProfilePhotoDataURL = parsedData.profilePhoto || "";
                    profilePhotoPreview.src = newProfilePhotoDataURL || "";
                } else {
                    newProfilePhotoDataURL = "";
                    profilePhotoPreview.src = "";
                }
            }
        });
    }

    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            try {
                const companyDataString = localStorage.getItem('companyProfileData');
                let companyData = companyDataString ? JSON.parse(companyDataString) : {};

                companyData.profilePhoto = newProfilePhotoDataURL;
                companyData.tagline = companyTaglineEdit.value;

                localStorage.setItem('companyProfileData', JSON.stringify(companyData));

                alert('Perfil atualizado com sucesso!');
                window.location.href = '../html/feed-empresa.html';
            } catch (error) {
                console.error('Erro ao salvar perfil no localStorage:', error);
                alert('Erro ao salvar o perfil. Tente novamente.');
            }
        });
    }

    loadCompanyProfileData();
});