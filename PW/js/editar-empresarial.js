document.addEventListener('DOMContentLoaded', function () {
    const editProfileForm = document.getElementById('editProfileForm');
    const profilePhotoPreview = document.getElementById('profilePhotoPreview');
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const companyTaglineEdit = document.getElementById('companyTaglineEdit');
    const uploadPhotoButton = document.getElementById('uploadPhotoButton');

    let newProfilePhotoDataURL = null;

    uploadPhotoButton.addEventListener('click', () => {
        profilePhotoInput.click();
    });

    profilePhotoInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePhotoPreview.src = e.target.result;
                newProfilePhotoDataURL = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    function loadCompanyProfileData() {
        const storedCompanyLogoUrl = localStorage.getItem('companyLogoUrl');
        if (storedCompanyLogoUrl) {
            profilePhotoPreview.src = storedCompanyLogoUrl;
            newProfilePhotoDataURL = storedCompanyLogoUrl;
        } else {
            profilePhotoPreview.src = 'https://via.placeholder.com/90';
        }

        const storedCompanyTagline = localStorage.getItem('companyTagline');
        if (storedCompanyTagline) {
            companyTaglineEdit.value = storedCompanyTagline;
        }
    }

    editProfileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        localStorage.setItem('companyLogoUrl', newProfilePhotoDataURL);
        localStorage.setItem('companyTagline', companyTaglineEdit.value.trim());

        alert('Perfil atualizado com sucesso!');
        window.location.href = '../html/feed-empresa.html';
    });

    loadCompanyProfileData();
});