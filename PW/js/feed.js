document.addEventListener('DOMContentLoaded', () => {

    const headerProfile = document.querySelector('.header-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');

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

    const uploadPicInput = document.getElementById('upload-pic');
    const myPicture = document.querySelector('.profile-card-container .my-picture');
    const headerProfilePic = document.getElementById('header-profile-pic');

    if (uploadPicInput && myPicture && headerProfilePic) {
        uploadPicInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    myPicture.src = e.target.result;
                    headerProfilePic.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const jobListingsContainer = document.getElementById('job-listings-container');
    const loadingMessage = document.querySelector('.loading-message');

    const fetchJobs = async () => {
        if (loadingMessage) loadingMessage.style.display = 'flex';
        jobListingsContainer.innerHTML = '';

        try {
            const response = await new Promise(resolve => setTimeout(() => {
                resolve([
                    {
                        title: 'Desenvolvedor Front-end Júnior',
                        company: 'Tech Solutions Inc.',
                        location: 'Remoto',
                        type: 'Full-time',
                        salary: 'R$ 3.000 - R$ 5.000'
                    },
                    {
                        title: 'Analista de Dados',
                        company: 'Data Insights Ltda.',
                        location: 'São Paulo, SP',
                        type: 'Full-time',
                        salary: 'R$ 5.000 - R$ 7.000'
                    },
                    {
                        title: 'UX/UI Designer',
                        company: 'Creative Minds Agency',
                        location: 'Remoto',
                        type: 'Freelance',
                        salary: 'R$ 4.000 - R$ 6.000'
                    },
                    {
                        title: 'Gerente de Projetos de TI',
                        company: 'Global Innovations',
                        location: 'Rio de Janeiro, RJ',
                        type: 'Full-time',
                        salary: 'R$ 8.000 - R$ 12.000'
                    },
                    {
                        title: 'Especialista em Marketing Digital',
                        company: 'Growth Strategies SA',
                        location: 'Belo Horizonte, MG',
                        type: 'Full-time',
                        salary: 'R$ 4.500 - R$ 7.500'
                    }
                ]);
            }, 1500));

            response.forEach(job => {
                const jobElement = document.createElement('div');
                jobElement.classList.add('job-listing');
                jobElement.innerHTML = `
                    <h3>${job.title}</h3>
                    <p>${job.company}</p>
                    <div class="details">
                        <span><i class="ri-map-pin-line"></i> ${job.location}</span>
                        <span><i class="ri-time-line"></i> ${job.type}</span>
                        <span><i class="ri-money-dollar-circle-line"></i> ${job.salary}</span>
                    </div>
                    <button class="apply-button">Candidatar-se</button>
                `;
                jobListingsContainer.appendChild(jobElement);
            });

        } catch (error) {
            console.error('Erro ao buscar vagas:', error);
            jobListingsContainer.innerHTML = '<p class="error-message">Não foi possível carregar as vagas no momento. Tente novamente mais tarde.</p>';
        } finally {
            if (loadingMessage) loadingMessage.style.display = 'none';
        }
    };

    if (jobListingsContainer) {
        fetchJobs();
    }
});