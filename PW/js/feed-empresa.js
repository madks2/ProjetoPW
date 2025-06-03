document.addEventListener('DOMContentLoaded', () => {
    const headerProfile = document.querySelector('.header-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const myProfilePic = document.getElementById('my-profile-pic');
    const uploadPicInput = document.getElementById('upload-pic');
    const headerProfilePic = document.getElementById('header-profile-pic');

    if (headerProfile && profileDropdown) {
        headerProfile.addEventListener('click', (event) => {
            event.stopPropagation();
            profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (event) => {
            if (!headerProfile.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.style.display = 'none';
            }
        });
    }

    if (uploadPicInput && myProfilePic && headerProfilePic) {
        uploadPicInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    myProfilePic.src = e.target.result;
                    headerProfilePic.src = e.target.result;
                    localStorage.setItem('companyProfilePic', e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        const savedProfilePic = localStorage.getItem('companyProfilePic');
        if (savedProfilePic) {
            myProfilePic.src = savedProfilePic;
            headerProfilePic.src = savedProfilePic;
        }
    }


    const vacancyForm = document.getElementById('vacancy-form');
    const vacancyTitleInput = document.getElementById('vacancy-title');
    const vacancyLocationInput = document.getElementById('vacancy-location');
    const vacancyTypeSelect = document.getElementById('vacancy-type');
    const vacancyDescriptionTextarea = document.getElementById('vacancy-description');
    const postVacancyButton = document.getElementById('post-vacancy-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const companyVacanciesList = document.getElementById('company-vacancies-list');
    const noVacanciesMessage = companyVacanciesList.querySelector('.no-vacancies-message');

    let editingVacancyId = null;

    const loadVacancies = () => {
        const vacancies = JSON.parse(localStorage.getItem('companyVacancies')) || [];
        displayVacancies(vacancies);
    };

    const displayVacancies = (vacancies) => {
        companyVacanciesList.innerHTML = '';

        if (vacancies.length === 0) {
            noVacanciesMessage.style.display = 'block';
        } else {
            noVacanciesMessage.style.display = 'none';
            vacancies.forEach(vacancy => {
                const vacancyElement = document.createElement('div');
                vacancyElement.classList.add('job-listing');
                vacancyElement.setAttribute('data-id', vacancy.id);

                vacancyElement.innerHTML = `
                    <h3>${vacancy.title}</h3>
                    <p><strong>Local:</strong> ${vacancy.location}</p>
                    <p><strong>Tipo:</strong> ${vacancy.type}</p>
                    <p>${vacancy.description}</p>
                    <div class="vacancy-actions">
                        <button class="btn btn-edit" data-id="${vacancy.id}"><i class="ri-pencil-line"></i> Editar</button>
                        <button class="btn btn-delete" data-id="${vacancy.id}"><i class="ri-delete-bin-line"></i> Excluir</button>
                    </div>
                `;
                companyVacanciesList.appendChild(vacancyElement);
            });
        }
    };

    vacancyForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newVacancy = {
            id: editingVacancyId || Date.now(),
            title: vacancyTitleInput.value,
            location: vacancyLocationInput.value,
            type: vacancyTypeSelect.value,
            description: vacancyDescriptionTextarea.value
        };

        let vacancies = JSON.parse(localStorage.getItem('companyVacancies')) || [];

        if (editingVacancyId) {
            vacancies = vacancies.map(v => (v.id === editingVacancyId ? newVacancy : v));
            editingVacancyId = null;
            postVacancyButton.textContent = 'Publicar Vaga';
            cancelEditButton.style.display = 'none';
        } else {
            vacancies.push(newVacancy);
        }

        localStorage.setItem('companyVacancies', JSON.stringify(vacancies));
        vacancyForm.reset();
        loadVacancies();
    });

    companyVacanciesList.addEventListener('click', (event) => {
        const target = event.target;
        const vacancyId = parseInt(target.closest('button')?.dataset.id);

        if (target.classList.contains('btn-edit')) {
            const vacancies = JSON.parse(localStorage.getItem('companyVacancies')) || [];
            const vacancyToEdit = vacancies.find(v => v.id === vacancyId);

            if (vacancyToEdit) {
                vacancyTitleInput.value = vacancyToEdit.title;
                vacancyLocationInput.value = vacancyToEdit.location;
                vacancyTypeSelect.value = vacancyToEdit.type;
                vacancyDescriptionTextarea.value = vacancyToEdit.description;

                editingVacancyId = vacancyId;
                postVacancyButton.textContent = 'Salvar Edição';
                cancelEditButton.style.display = 'inline-block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else if (target.classList.contains('btn-delete')) {
            if (confirm('Tem certeza que deseja excluir esta vaga?')) {
                let vacancies = JSON.parse(localStorage.getItem('companyVacancies')) || [];
                vacancies = vacancies.filter(v => v.id !== vacancyId);
                localStorage.setItem('companyVacancies', JSON.stringify(vacancies));
                loadVacancies();
            }
        }
    });

    cancelEditButton.addEventListener('click', () => {
        editingVacancyId = null;
        vacancyForm.reset();
        postVacancyButton.textContent = 'Publicar Vaga';
        cancelEditButton.style.display = 'none';
    });

    loadVacancies();
});