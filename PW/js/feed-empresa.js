document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000';
    const API_COMPANY_PROFILE_ENDPOINT = '/api/company/profile';
    const API_COMPANY_UPLOAD_LOGO_ENDPOINT = '/api/company/upload-logo';
    const WEATHER_API_KEY = 'f574f6a8d4a724d94851ed01d1a45cc3';

    const headerProfile = document.querySelector('.header-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const myProfilePic = document.getElementById('my-profile-pic');
    const uploadPicInput = document.getElementById('upload-pic');
    const headerProfilePic = document.getElementById('header-profile-pic');
    const headerCompanyName = document.getElementById('header-company-name');
    const companyNameDisplay = document.getElementById('company-name-display');
    const companyTagline = document.getElementById('company-tagline');
    const vacancyViewsCount = document.getElementById('vacancy-views-count');
    const applicationsReceivedCount = document.getElementById('applications-received-count');
    const editCompanyProfileBtn = document.getElementById('edit-company-profile-btn');
    const editCompanyModal = document.getElementById('edit-company-modal');
    const closeCompanyModalButton = editCompanyModal ? editCompanyModal.querySelector('.close-button') : null;
    const editCompanyForm = document.getElementById('edit-company-form');
    const modalCompanyNameInput = document.getElementById('modal-company-name-input');
    const modalCompanyTaglineInput = document.getElementById('modal-company-tagline-input');
    const modalCompanyLocationInput = document.getElementById('modal-company-location-input');
    const weatherCityDisplay = document.getElementById('weatherCity');
    const weatherDisplayContainer = document.getElementById('weatherDisplay');

    const vacancyForm = document.getElementById('vacancy-form');
    const vacancyTitleInput = document.getElementById('vacancy-title');
    const vacancyLocationInput = document.getElementById('vacancy-location');
    const vacancyScheduleInput = document.getElementById('vacancy-schedule');
    const vacancySalaryInput = document.getElementById('vacancy-salary');
    const vacancyBenefitsTextarea = document.getElementById('vacancy-benefits');
    const vacancyTypeSelect = document.getElementById('vacancy-type');
    const vacancySummaryTextarea = document.getElementById('vacancy-summary');
    const vacancyRequirementsTextarea = document.getElementById('vacancy-requirements');
    const postVacancyButton = document.getElementById('post-vacancy-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const companyVacanciesList = document.getElementById('company-vacancies-list');
    const noVacanciesMessage = companyVacanciesList ? companyVacanciesList.querySelector('.no-vacancies-message') : null;
    const logoutLink = document.getElementById('logout-link');

    let editingVacancyId = null;

    function getAuthToken() {
        return localStorage.getItem('companyAuthToken');
    }

    async function loadCompanyProfileData() {
        const storedCompanyName = localStorage.getItem('companyName') || 'Nome da Empresa';
        const storedCompanyTagline = localStorage.getItem('companyTagline') || 'Slogan da Empresa aqui';
        const storedCompanyLogoUrl = localStorage.getItem('companyLogoUrl') || 'https://via.placeholder.com/90';
        const storedVacancyViews = localStorage.getItem('companyVacancyViews') || '0';
        const storedApplicationsReceived = localStorage.getItem('companyApplicationsReceived') || '0';
        const storedCompanyLocation = localStorage.getItem('companyLocation') || 'São Paulo - SP';

        if (companyNameDisplay) companyNameDisplay.textContent = storedCompanyName;
        if (companyTagline) companyTagline.textContent = storedCompanyTagline;
        if (myProfilePic) myProfilePic.src = storedCompanyLogoUrl;
        if (headerProfilePic) headerProfilePic.src = storedCompanyLogoUrl;
        if (headerCompanyName) headerCompanyName.textContent = storedCompanyName;
        if (vacancyViewsCount) vacancyViewsCount.textContent = storedVacancyViews;
        if (applicationsReceivedCount) applicationsReceivedCount.textContent = storedApplicationsReceived;

        const token = getAuthToken();
        if (!token) {
            console.warn('Nenhum token de autenticação da empresa encontrado. Não será possível buscar dados da API.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${API_COMPANY_PROFILE_ENDPOINT}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error('Falha ao carregar perfil da empresa da API:', response.status, response.statusText);
                return;
            }

            const data = await response.json();
            console.log('Dados do perfil da empresa da API:', data);

            if (companyNameDisplay) companyNameDisplay.textContent = data.name || storedCompanyName;
            if (companyTagline) companyTagline.textContent = data.tagline || storedCompanyTagline;
            if (myProfilePic) myProfilePic.src = data.logoUrl || storedCompanyLogoUrl;
            if (headerProfilePic) headerProfilePic.src = data.logoUrl || storedCompanyLogoUrl;
            if (headerCompanyName) headerCompanyName.textContent = data.name || storedCompanyName;
            if (vacancyViewsCount) vacancyViewsCount.textContent = data.vacancyViews || storedVacancyViews;
            if (applicationsReceivedCount) applicationsReceivedCount.textContent = data.applicationsReceived || storedApplicationsReceived;

            localStorage.setItem('companyName', data.name || storedCompanyName);
            localStorage.setItem('companyTagline', data.tagline || storedCompanyTagline);
            localStorage.setItem('companyLogoUrl', data.logoUrl || storedCompanyLogoUrl);
            localStorage.setItem('companyVacancyViews', data.vacancyViews || storedVacancyViews);
            localStorage.setItem('companyApplicationsReceived', data.applicationsReceived || storedApplicationsReceived);
            localStorage.setItem('companyLocation', data.location || storedCompanyLocation);

        } catch (error) {
            console.error('Erro ao buscar dados do perfil da empresa:', error);
        }
    }

    async function fetchWeather(city) {
        if (!weatherDisplayContainer) return;

        weatherDisplayContainer.innerHTML = '<p>Carregando dados do tempo...</p>';

        if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
            weatherDisplayContainer.innerHTML = '<p style="color: red;">Erro: Chave da API de tempo não configurada ou inválida.</p>';
            console.error("ERRO: Chave da API do OpenWeatherMap não configurada ou é a chave placeholder.");
            return;
        }

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`);
            const data = await response.json();

            if (data.cod !== 200) {
                weatherDisplayContainer.innerHTML = `<p>Erro ao buscar tempo para ${city}: ${data.message || 'Cidade não encontrada.'}</p>`;
                return;
            }

            const temp = data.main.temp;
            const description = data.weather[0].description;
            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

            weatherDisplayContainer.innerHTML = `
                <p><img src="${iconUrl}" alt="${description}" class="weather-icon">${temp.toFixed(0)}°C</p>
                <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
                <p>Umidade: ${data.main.humidity}%</p>
                <p>Vento: ${data.wind.speed} m/s</p>
            `;

        } catch (error) {
            console.error('Erro ao buscar dados do tempo:', error);
            weatherDisplayContainer.innerHTML = '<p>Não foi possível carregar os dados do tempo.</p>';
        }
    }

    function loadWeatherForCompanyLocation() {
        const companyLocation = localStorage.getItem('companyLocation');
        if (companyLocation) {
            const city = companyLocation.split(' - ')[0].trim();
            if (city) {
                if (weatherCityDisplay) weatherCityDisplay.textContent = city;
                fetchWeather(city);
            } else {
                if (weatherDisplayContainer) weatherDisplayContainer.innerHTML = '<p>Cidade não encontrada na localização da empresa.</p>';
            }
        } else {
            if (weatherDisplayContainer) weatherDisplayContainer.innerHTML = '<p>Localização da empresa não disponível.</p>';
        }
    }

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
        uploadPicInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('companyLogo', file);

            const token = getAuthToken();
            if (!token) {
                alert('Você precisa estar logado para fazer upload do logo.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}${API_COMPANY_UPLOAD_LOGO_ENDPOINT}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Falha ao fazer upload do logo.');
                }

                const result = await response.json();
                const newLogoUrl = result.logoUrl;

                myProfilePic.src = newLogoUrl;
                headerProfilePic.src = newLogoUrl;
                localStorage.setItem('companyLogoUrl', newLogoUrl);
                alert('Logo da empresa atualizado com sucesso!');

            } catch (error) {
                console.error('Erro ao fazer upload do logo:', error);
                alert('Erro ao fazer upload do logo: ' + error.message);
            }
        });

        const savedCompanyLogo = localStorage.getItem('companyLogoUrl');
        if (savedCompanyLogo) {
            myProfilePic.src = savedCompanyLogo;
            headerProfilePic.src = savedCompanyLogo;
        }
    }

    if (editCompanyProfileBtn && editCompanyModal && closeCompanyModalButton && editCompanyForm) {
        editCompanyProfileBtn.addEventListener('click', (event) => {
            event.preventDefault();

            modalCompanyNameInput.value = companyNameDisplay.textContent;
            modalCompanyTaglineInput.value = companyTagline.textContent;
            modalCompanyLocationInput.value = localStorage.getItem('companyLocation') || '';

            editCompanyModal.style.display = 'flex';
        });

        closeCompanyModalButton.addEventListener('click', () => {
            editCompanyModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === editCompanyModal) {
                editCompanyModal.style.display = 'none';
            }
        });

        editCompanyForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const updatedCompanyData = {
                name: modalCompanyNameInput.value,
                tagline: modalCompanyTaglineInput.value,
                location: modalCompanyLocationInput.value
            };

            const token = getAuthToken();
            if (!token) {
                alert('Você precisa estar logado para atualizar o perfil da empresa.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}${API_COMPANY_PROFILE_ENDPOINT}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedCompanyData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Falha ao atualizar perfil da empresa na API.');
                }

                companyNameDisplay.textContent = updatedCompanyData.name;
                companyTagline.textContent = updatedCompanyData.tagline;
                headerCompanyName.textContent = updatedCompanyData.name;

                localStorage.setItem('companyName', updatedCompanyData.name);
                localStorage.setItem('companyTagline', updatedCompanyData.tagline);
                localStorage.setItem('companyLocation', updatedCompanyData.location);

                editCompanyModal.style.display = 'none';
                alert('Perfil da empresa atualizado com sucesso!');
                loadWeatherForCompanyLocation();

            } catch (error) {
                console.error('Erro ao atualizar perfil da empresa:', error);
                alert('Erro ao atualizar perfil da empresa: ' + error.message);
            }
        });
    }

    const loadVacancies = () => {
        if (!companyVacanciesList) return;

        const vacancies = JSON.parse(localStorage.getItem('companyVacancies')) || [];
        displayVacancies(vacancies);
    };

    const displayVacancies = (vacancies) => {
        if (!companyVacanciesList) return;

        companyVacanciesList.innerHTML = '';

        if (vacancies.length === 0) {
            if (noVacanciesMessage) noVacanciesMessage.style.display = 'block';
        } else {
            if (noVacanciesMessage) noVacanciesMessage.style.display = 'none';
            vacancies.forEach(vacancy => {
                const vacancyElement = document.createElement('div');
                vacancyElement.classList.add('job-listing');
                vacancyElement.setAttribute('data-id', vacancy.id);

                vacancyElement.innerHTML = `
                    <h3>${vacancy.title}</h3>
                    <p><strong>Local:</strong> ${vacancy.location}</p>
                    <p><strong>Tipo:</strong> ${vacancy.type}</p>
                    <p>${vacancy.summary}</p>
                    <div class="vacancy-actions">
                        <button class="btn btn-edit" data-id="${vacancy.id}"><i class="ri-pencil-line"></i> Editar</button>
                        <button class="btn btn-delete" data-id="${vacancy.id}"><i class="ri-delete-bin-line"></i> Excluir</button>
                    </div>
                `;
                companyVacanciesList.appendChild(vacancyElement);
            });
        }
    };

    if (vacancyForm && vacancyTitleInput && vacancyLocationInput && vacancyTypeSelect && postVacancyButton) {
        vacancyForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const newVacancy = {
                id: editingVacancyId || Date.now(),
                title: vacancyTitleInput.value,
                location: vacancyLocationInput.value,
                schedule: vacancyScheduleInput.value,
                salary: vacancySalaryInput.value,
                benefits: vacancyBenefitsTextarea.value,
                type: vacancyTypeSelect.value,
                summary: vacancySummaryTextarea.value,
                requirements: vacancyRequirementsTextarea.value
            };

            let vacancies = JSON.parse(localStorage.getItem('companyVacancies')) || [];

            if (editingVacancyId) {
                vacancies = vacancies.map(v => (v.id === editingVacancyId ? newVacancy : v));
                editingVacancyId = null;
                postVacancyButton.textContent = 'Publicar Vaga';
                if (cancelEditButton) cancelEditButton.style.display = 'none';
            } else {
                vacancies.push(newVacancy);
            }

            localStorage.setItem('companyVacancies', JSON.stringify(vacancies));
            vacancyForm.reset();
            loadVacancies();
            alert(editingVacancyId ? 'Vaga atualizada com sucesso!' : 'Vaga publicada com sucesso!');
        });
    }

    if (companyVacanciesList) {
        companyVacanciesList.addEventListener('click', (event) => {
            const target = event.target;
            const buttonElement = target.closest('button');
            if (!buttonElement) return;

            const vacancyId = parseInt(buttonElement.dataset.id);

            if (buttonElement.classList.contains('btn-edit') || buttonElement.closest('.btn-edit')) {
                const vacancies = JSON.parse(localStorage.getItem('companyVacancies')) || [];
                const vacancyToEdit = vacancies.find(v => v.id === vacancyId);

                if (vacancyToEdit) {
                    vacancyTitleInput.value = vacancyToEdit.title;
                    vacancyLocationInput.value = vacancyToEdit.location;
                    vacancyScheduleInput.value = vacancyToEdit.schedule;
                    vacancySalaryInput.value = vacancyToEdit.salary;
                    vacancyBenefitsTextarea.value = vacancyToEdit.benefits;
                    vacancyTypeSelect.value = vacancyToEdit.type;
                    vacancySummaryTextarea.value = vacancyToEdit.summary;
                    vacancyRequirementsTextarea.value = vacancyToEdit.requirements;

                    editingVacancyId = vacancyId;
                    postVacancyButton.textContent = 'Salvar Edição';
                    if (cancelEditButton) cancelEditButton.style.display = 'inline-block';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else if (buttonElement.classList.contains('btn-delete') || buttonElement.closest('.btn-delete')) {
                if (confirm('Tem certeza que deseja excluir esta vaga?')) {
                    let vacancies = JSON.parse(localStorage.getItem('companyVacancies')) || [];
                    vacancies = vacancies.filter(v => v.id !== vacancyId);
                    localStorage.setItem('companyVacancies', JSON.stringify(vacancies));
                    loadVacancies();
                    alert('Vaga excluída com sucesso!');
                }
            }
        });
    }

    if (cancelEditButton && vacancyForm && postVacancyButton) {
        cancelEditButton.addEventListener('click', () => {
            editingVacancyId = null;
            vacancyForm.reset();
            postVacancyButton.textContent = 'Publicar Vaga';
            cancelEditButton.style.display = 'none';
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('companyAuthToken');
            localStorage.removeItem('companyName');
            localStorage.removeItem('companyTagline');
            localStorage.removeItem('companyLogoUrl');
            localStorage.removeItem('companyVacancyViews');
            localStorage.removeItem('companyApplicationsReceived');
            localStorage.removeItem('companyLocation');
            window.location.href = '../html/index.html';
        });
    }

    loadCompanyProfileData();
    loadWeatherForCompanyLocation();
    loadVacancies();
});