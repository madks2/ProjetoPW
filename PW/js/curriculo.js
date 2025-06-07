document.addEventListener('DOMContentLoaded', () => {

    function collectCurriculumData() {
        const form = document.getElementById('resume-form');
        if (!form) return null;

        const data = {};

        data.fullName = document.getElementById('full-name')?.value || '';
        data.email = document.getElementById('email')?.value || '';
        data.phone = document.getElementById('phone')?.value || '';
        data.linkedin = document.getElementById('linkedin')?.value || '';
        data.portfolio = document.getElementById('portfolio')?.value || '';
        data.location = document.getElementById('location')?.value || '';
        data.summary = document.getElementById('summary')?.value || '';

        data.education = [];
        const educationEntries = form.querySelectorAll('.education-entry');
        educationEntries.forEach(entry => {
            const course = entry.querySelector('[name="course[]"]')?.value || '';
            const institution = entry.querySelector('[name="institution[]"]')?.value || '';
            const startDate = entry.querySelector('[name="education_start_date[]"]')?.value || '';
            const endDate = entry.querySelector('[name="education_end_date[]"]')?.value || '';
            const isCurrent = entry.querySelector('[name="education_current[]"]')?.checked || false;
            if (course || institution || startDate || endDate) {
                data.education.push({
                    course,
                    institution,
                    startDate,
                    endDate,
                    isCurrent
                });
            }
        });

        data.experience = [];
        const experienceEntries = form.querySelectorAll('.experience-entry');
        experienceEntries.forEach(entry => {
            const jobTitle = entry.querySelector('[name="job_title[]"]')?.value || '';
            const company = entry.querySelector('[name="company[]"]')?.value || '';
            const startDate = entry.querySelector('[name="experience_start_date[]"]')?.value || '';
            const endDate = entry.querySelector('[name="experience_end_date[]"]')?.value || '';
            const isCurrent = entry.querySelector('[name="experience_current[]"]')?.checked || false;
            const responsibilities = entry.querySelector('[name="responsibilities[]"]')?.value || '';
            if (jobTitle || company || startDate || endDate || responsibilities) {
                data.experience.push({
                    jobTitle,
                    company,
                    startDate,
                    endDate,
                    isCurrent,
                    responsibilities
                });
            }
        });

        data.languages = [];
        const languageEntries = form.querySelectorAll('.language-entry');
        languageEntries.forEach(entry => {
            const language = entry.querySelector('[name="language[]"]')?.value || '';
            const proficiency = entry.querySelector('[name="proficiency[]"]')?.value || '';
            if (language) {
                data.languages.push({
                    language,
                    proficiency
                });
            }
        });

        data.courses = [];
        const courseEntries = form.querySelectorAll('.course-entry');
        courseEntries.forEach(entry => {
            const courseName = entry.querySelector('[name="course_name[]"]')?.value || '';
            const issuingOrganization = entry.querySelector('[name="issuing_organization[]"]')?.value || '';
            const courseYear = entry.querySelector('[name="course_year[]"]')?.value || '';
            const courseLink = entry.querySelector('[name="course_link[]"]')?.value || '';
            if (courseName || issuingOrganization) {
                data.courses.push({
                    courseName,
                    issuingOrganization,
                    courseYear,
                    courseLink
                });
            }
        });

        data.skills = document.getElementById('skills')?.value || '';

        return data;
    }

    function saveCurriculumData() {
        const data = collectCurriculumData();
        if (data) {
            try {
                localStorage.setItem('userCurriculumData', JSON.stringify(data));
                alert('Seu currículo foi salvo no navegador!');
                updateCurriculumNavLinkText();
                renderCurriculumForPrint(); // Adicionado para renderizar a visualização de impressão ao salvar
            } catch (e) {
                console.error('Erro ao salvar dados do currículo no localStorage:', e);
                alert('Erro ao salvar currículo. Tente novamente.');
            }
        }
    }

    function loadCurriculumData() {
        const form = document.getElementById('resume-form');
        if (!form) return;

        try {
            const savedDataString = localStorage.getItem('userCurriculumData');
            if (savedDataString) {
                const savedData = JSON.parse(savedDataString);

                if (document.getElementById('full-name')) document.getElementById('full-name').value = savedData.fullName || '';
                if (document.getElementById('email')) document.getElementById('email').value = savedData.email || '';
                if (document.getElementById('phone')) document.getElementById('phone').value = savedData.phone || '';
                if (document.getElementById('linkedin')) document.getElementById('linkedin').value = savedData.linkedin || '';
                if (document.getElementById('portfolio')) document.getElementById('portfolio').value = savedData.portfolio || '';
                if (document.getElementById('location')) document.getElementById('location').value = savedData.location || '';
                if (document.getElementById('summary')) document.getElementById('summary').value = savedData.summary || '';

                const educationContainer = document.getElementById('education-container');
                if (educationContainer && savedData.education && savedData.education.length > 0) {
                    educationContainer.innerHTML = '';
                    savedData.education.forEach(edu => {
                        const newEducationEntry = document.createElement('div');
                        newEducationEntry.classList.add('education-entry');
                        newEducationEntry.innerHTML = `
                            <label for="course">Curso / Formação:</label>
                            <input type="text" name="course[]" placeholder="Ex: Bacharelado em Ciência da Computação" value="${edu.course || ''}" required>

                            <label for="institution">Instituição:</label>
                            <input type="text" name="institution[]" placeholder="Ex: Universidade Federal de Minas Gerais" value="${edu.institution || ''}" required>

                            <label for="education-start-date">Período de Início:</label>
                            <input type="month" name="education_start_date[]" value="${edu.startDate || ''}" required>

                            <label for="education-end-date">Período de Término (ou Atual):</label>
                            <input type="month" name="education_end_date[]" value="${edu.endDate || ''}">
                            <label class="checkbox-label"><input type="checkbox" name="education_current[]" ${edu.isCurrent ? 'checked' : ''}> Atualmente cursando</label>
                            <button type="button" class="remove-entry-btn">Remover</button>
                        `;
                        educationContainer.appendChild(newEducationEntry);
                        newEducationEntry.querySelector('.remove-entry-btn')?.addEventListener('click', (event) => {
                            event.target.closest('.education-entry').remove();
                        });
                    });
                }

                const experienceContainer = document.getElementById('experience-container');
                if (experienceContainer && savedData.experience && savedData.experience.length > 0) {
                    experienceContainer.innerHTML = '';
                    savedData.experience.forEach(exp => {
                        const newExperienceEntry = document.createElement('div');
                        newExperienceEntry.classList.add('experience-entry');
                        newExperienceEntry.innerHTML = `
                            <label for="job-title">Cargo:</label>
                            <input type="text" name="job_title[]" placeholder="Ex: Desenvolvedor Front-end Sênior" value="${exp.jobTitle || ''}" required>

                            <label for="company">Empresa:</label>
                            <input type="text" name="company[]" placeholder="Ex: Google Inc." value="${exp.company || ''}" required>

                            <label for="experience-start-date">Período de Início:</label>
                            <input type="month" name="experience_start_date[]" value="${exp.startDate || ''}" required>

                            <label for="experience-end-date">Período de Término (ou Atual):</label>
                            <input type="month" name="experience_end_date[]" value="${exp.endDate || ''}">
                            <label class="checkbox-label"><input type="checkbox" name="experience_current[]" ${exp.isCurrent ? 'checked' : ''}> Atualmente trabalhando</label>

                            <label for="responsibilities">Principais Responsabilidades e Conquistas:</label>
                            <textarea name="responsibilities[]" rows="4" placeholder="Descreva suas responsabilidades e conquistas.">${exp.responsibilities || ''}</textarea>
                            <button type="button" class="remove-entry-btn">Remover</button>
                        `;
                        experienceContainer.appendChild(newExperienceEntry);
                        newExperienceEntry.querySelector('.remove-entry-btn')?.addEventListener('click', (event) => {
                            event.target.closest('.experience-entry').remove();
                        });
                    });
                }

                const languagesContainer = document.getElementById('languages-container');
                if (languagesContainer && savedData.languages && savedData.languages.length > 0) {
                    languagesContainer.innerHTML = '';
                    savedData.languages.forEach(lang => {
                        const newLanguageEntry = document.createElement('div');
                        newLanguageEntry.classList.add('language-entry');
                        newLanguageEntry.innerHTML = `
                            <label for="language">Idioma:</label>
                            <input type="text" name="language[]" placeholder="Ex: Inglês" value="${lang.language || ''}" required>

                            <label for="proficiency">Proficiência:</label>
                            <select name="proficiency[]" required>
                                <option value="">Selecione</option>
                                <option value="Basico" ${lang.proficiency === 'Basico' ? 'selected' : ''}>Básico</option>
                                <option value="Intermediario" ${lang.proficiency === 'Intermediario' ? 'selected' : ''}>Intermediário</option>
                                <option value="Avancado" ${lang.proficiency === 'Avancado' ? 'selected' : ''}>Avançado</option>
                                <option value="Fluente" ${lang.proficiency === 'Fluente' ? 'selected' : ''}>Fluente</option>
                                <option value="Nativo" ${lang.proficiency === 'Nativo' ? 'selected' : ''}>Nativo</option>
                            </select>
                            <button type="button" class="remove-entry-btn">Remover</button>
                        `;
                        languagesContainer.appendChild(newLanguageEntry);
                        newLanguageEntry.querySelector('.remove-entry-btn')?.addEventListener('click', (event) => {
                            event.target.closest('.language-entry').remove();
                        });
                    });
                }

                const coursesContainer = document.getElementById('courses-container');
                if (coursesContainer && savedData.courses && savedData.courses.length > 0) {
                    coursesContainer.innerHTML = '';
                    savedData.courses.forEach(course => {
                        const newCourseEntry = document.createElement('div');
                        newCourseEntry.classList.add('course-entry');
                        newCourseEntry.innerHTML = `
                            <label for="course-name">Nome do Curso/Certificação:</label>
                            <input type="text" name="course_name[]" placeholder="Ex: Certificação Scrum Master" value="${course.courseName || ''}" required>

                            <label for="issuing-organization">Organização Emissora:</label>
                            <input type="text" name="issuing_organization[]" placeholder="Ex: Scrum.org" value="${course.issuingOrganization || ''}" required>

                            <label for="course-year">Ano de Conclusão:</label>
                            <input type="number" name="course_year[]" placeholder="AAAA" min="1900" max="2100" value="${course.courseYear || ''}">

                            <label for="course-link">Link (opcional):</label>
                            <input type="url" name="course_link[]" placeholder="Link para o certificado/curso" value="${course.courseLink || ''}">
                            <button type="button" class="remove-entry-btn">Remover</button>
                        `;
                        coursesContainer.appendChild(newCourseEntry);
                        newCourseEntry.querySelector('.remove-entry-btn')?.addEventListener('click', (event) => {
                            event.target.closest('.course-entry').remove();
                        });
                    });
                }

                if (document.getElementById('skills')) document.getElementById('skills').value = savedData.skills || '';

                renderCurriculumForPrint(); 
            }
        } catch (e) {
            console.error('Erro ao carregar dados do currículo do localStorage:', e);
        }
    }

    function renderCurriculumForPrint() {
        const savedDataString = localStorage.getItem('userCurriculumData');
        if (!savedDataString) {
            document.querySelector('.print-content').innerHTML = '';
            return;
        }

        const savedData = JSON.parse(savedDataString);
        const printContentContainer = document.querySelector('.print-content');
        if (!printContentContainer) return;

        let htmlForPrint = `
            <div class="dados-pessoais-print">
                <h1 id="full-name-print">${savedData.fullName || ''}</h1>
                <div class="contact-info">
                    ${savedData.phone ? `<span class="phone">${savedData.phone}</span>` : ''}
                    ${savedData.email ? `<span class="email">${savedData.email}</span>` : ''}
                    ${savedData.linkedin ? `<span class="linkedin">${savedData.linkedin.replace('https://linkedin.com/in/', 'LinkedIn: ')}</span>` : ''}
                    ${savedData.portfolio ? `<span class="portfolio">${savedData.portfolio.replace(/^(https?:\/\/)?(www\.)?/, 'Portfolio: ')}</span>` : ''}
                    ${savedData.location ? `<span class="location">${savedData.location}</span>` : ''}
                </div>
                ${savedData.summary ? `<h2>Resumo</h2><p id="summary-print">${savedData.summary}</p>` : ''}
            </div>
        `;

        if (savedData.education && savedData.education.length > 0) {
            htmlForPrint += `<h2>Educação</h2>`;
            savedData.education.forEach(edu => {
                htmlForPrint += `
                    <div class="education-entry">
                        <div class="entry-header">
                            <h3>${edu.course || ''}</h3>
                            <span class="date">${edu.startDate || ''} - ${edu.endDate || (edu.isCurrent ? 'Atual' : '')}</span>
                        </div>
                        <p class="institution">${edu.institution || ''}</p>
                    </div>
                `;
            });
        }

        if (savedData.experience && savedData.experience.length > 0) {
            htmlForPrint += `<h2>Experiência</h2>`;
            savedData.experience.forEach(exp => {
                htmlForPrint += `
                    <div class="experience-entry">
                        <div class="entry-header">
                            <h3 class="job-title">${exp.jobTitle || ''} - ${exp.company || ''}</h3>
                            <span class="date">${exp.startDate || ''} - ${exp.endDate || (exp.isCurrent ? 'Atual' : '')}</span>
                        </div>
                        ${exp.responsibilities ? `<ul class="responsibilities-list"><li>${exp.responsibilities.split('\n').join('</li><li>')}</li></ul>` : ''}
                    </div>
                `;
            });
        }

        if (savedData.skills) {
            htmlForPrint += `<h2>Habilidades</h2><p id="skills-print">${savedData.skills}</p>`;
        }

        if (savedData.languages && savedData.languages.length > 0) {
            htmlForPrint += `<h2>Idiomas</h2>`;
            savedData.languages.forEach(lang => {
                htmlForPrint += `
                    <div class="language-entry">
                        <div>
                            <span class="language">${lang.language || ''}</span>
                            <span class="proficiency">(${lang.proficiency || ''})</span>
                        </div>
                    </div>
                `;
            });
        }

        if (savedData.courses && savedData.courses.length > 0) {
            htmlForPrint += `<h2>Cursos e Certificações</h2>`;
            savedData.courses.forEach(course => {
                htmlForPrint += `
                    <div class="course-entry">
                        <div>
                            <span class="course-name">${course.courseName || ''}</span>
                            ${course.issuingOrganization ? `<span class="issuing-organization">(${course.issuingOrganization}${course.courseYear ? ', ' + course.courseYear : ''})</span>` : ''}
                        </div>
                        ${course.courseLink ? `<p><a href="${course.courseLink}">${course.courseLink}</a></p>` : ''}
                    </div>
                `;
            });
        }

        printContentContainer.innerHTML = htmlForPrint;
    }

    const addEducationBtn = document.getElementById('add-education');
    const educationContainer = document.getElementById('education-container');

    if (addEducationBtn && educationContainer) {
        addEducationBtn.addEventListener('click', () => {
            const newEducationEntry = document.createElement('div');
            newEducationEntry.classList.add('education-entry');
            newEducationEntry.innerHTML = `
                <label for="course">Curso / Formação:</label>
                <input type="text" name="course[]" placeholder="Ex: Bacharelado em Ciência da Computação" required>

                <label for="institution">Instituição:</label>
                <input type="text" name="institution[]" placeholder="Ex: Universidade Federal de Minas Gerais" required>

                <label for="education-start-date">Período de Início:</label>
                <input type="month" name="education_start_date[]" required>

                <label for="education-end-date">Período de Término (ou Atual):</label>
                <input type="month" name="education_end_date[]">
                <label class="checkbox-label"><input type="checkbox" name="education_current[]"> Atualmente cursando</label>
                <button type="button" class="remove-entry-btn">Remover</button>
            `;
            educationContainer.appendChild(newEducationEntry);
            newEducationEntry.querySelector('.remove-entry-btn')?.addEventListener('click', (event) => {
                event.target.closest('.education-entry').remove();
            });
        });
    }

    const addExperienceBtn = document.getElementById('add-experience');
    const experienceContainer = document.getElementById('experience-container');

    if (addExperienceBtn && experienceContainer) {
        addExperienceBtn.addEventListener('click', () => {
            const newExperienceEntry = document.createElement('div');
            newExperienceEntry.classList.add('experience-entry');
            newExperienceEntry.innerHTML = `
                <label for="job-title">Cargo:</label>
                <input type="text" name="job_title[]" placeholder="Ex: Desenvolvedor Front-end Sênior" required>

                <label for="company">Empresa:</label>
                <input type="text" name="company[]" placeholder="Ex: Google Inc." required>

                <label for="experience-start-date">Período de Início:</label>
                <input type="month" name="experience_start_date[]" required>

                <label for="experience-end-date">Período de Término (ou Atual):</label>
                <input type="month" name="experience_end_date[]">
                <label class="checkbox-label"><input type="checkbox" name="experience_current[]"> Atualmente trabalhando</label>

                <label for="responsibilities">Principais Responsabilidades e Conquistas:</label>
                <textarea name="responsibilities[]" rows="4" placeholder="Descreva suas responsabilidades e conquistas."></textarea>
                <button type="button" class="remove-entry-btn">Remover</button>
            `;
            experienceContainer.appendChild(newExperienceEntry);
            newExperienceEntry.querySelector('.remove-entry-btn')?.addEventListener('click', (event) => {
                event.target.closest('.experience-entry').remove();
            });
        });
    }

    const addLanguageBtn = document.getElementById('add-language');
    const languagesContainer = document.getElementById('languages-container');

    if (addLanguageBtn && languagesContainer) {
        addLanguageBtn.addEventListener('click', () => {
            const newLanguageEntry = document.createElement('div');
            newLanguageEntry.classList.add('language-entry');
            newLanguageEntry.innerHTML = `
                <label for="language">Idioma:</label>
                <input type="text" name="language[]" placeholder="Ex: Inglês" required>

                <label for="proficiency">Proficiência:</label>
                <select name="proficiency[]" required>
                    <option value="">Selecione</option>
                    <option value="Basico">Básico</option>
                    <option value="Intermediario">Intermediário</option>
                    <option value="Avancado">Avançado</option>
                    <option value="Fluente">Fluente</option>
                    <option value="Nativo">Nativo</option>
                </select>
                <button type="button" class="remove-entry-btn">Remover</button>
            `;
            languagesContainer.appendChild(newLanguageEntry);
            newLanguageEntry.querySelector('.remove-entry-btn')?.addEventListener('click', (event) => {
                event.target.closest('.language-entry').remove();
            });
        });
    }

    const addCourseBtn = document.getElementById('add-course');
    const coursesContainer = document.getElementById('courses-container');

    if (addCourseBtn && coursesContainer) {
        addCourseBtn.addEventListener('click', () => {
            const newCourseEntry = document.createElement('div');
            newCourseEntry.classList.add('course-entry');
            newCourseEntry.innerHTML = `
                <label for="course-name">Nome do Curso/Certificação:</label>
                <input type="text" name="course_name[]" placeholder="Ex: Certificação Scrum Master" required>

                <label for="issuing-organization">Organização Emissora:</label>
                <input type="text" name="issuing_organization[]" placeholder="Ex: Scrum.org" required>

                <label for="course-year">Ano de Conclusão:</label>
                <input type="number" name="course_year[]" placeholder="AAAA" min="1900" max="2100">

                <label for="course-link">Link (opcional):</label>
                <input type="url" name="course_link[]" placeholder="Link para o certificado/curso" value="${course.courseLink || ''}">
                <button type="button" class="remove-entry-btn">Remover</button>
            `;
            coursesContainer.appendChild(newCourseEntry);
            newCourseEntry.querySelector('.remove-entry-btn')?.addEventListener('click', (event) => {
                event.target.closest('.course-entry').remove();
            });
        });
    }

    const resumeForm = document.getElementById('resume-form');
    if (resumeForm) {
        loadCurriculumData();
        resumeForm.addEventListener('submit', (event) => {
            event.preventDefault();
            saveCurriculumData();
        });
    }

    function updateCurriculumNavLinkText() {
        const curriculumNavLink = document.getElementById('view-resume-link');
        if (curriculumNavLink) {
            const savedDataString = localStorage.getItem('userCurriculumData');
            if (savedDataString && savedDataString !== '{}' && JSON.parse(savedDataString) && Object.keys(JSON.parse(savedDataString)).length > 0) {
                curriculumNavLink.innerHTML = '<i class="ri-file-text-line"></i> Visualizar Currículo';
            } else {
                curriculumNavLink.innerHTML = '<i class="ri-file-text-line"></i> Criar meu Currículo';
            }
        }
    }

    updateCurriculumNavLinkText();

    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            window.print();
        });
    }

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

    const headerProfilePic = document.getElementById('header-profile-pic');
    const myPicture = document.getElementById('my-profile-pic');
    const profileUserNameElement = document.getElementById('profile-user-name');
    const headerUserNameElement = document.getElementById('header-user-name');
    const profileTituloProfissionalElement = document.getElementById('profile-titulo-profissional');

    function loadAndDisplayProfileData() {
        const userDataString = localStorage.getItem('userDataCandidato');
        let userData = {};

        if (userDataString) {
            try {
                userData = JSON.parse(userDataString);
            } catch (e) {
                console.error("Erro ao fazer parse de userDataCandidato do localStorage:", e);
            }
        }

        const profilePhoto = userData.profilePhoto || '';
        if (myPicture) myPicture.src = profilePhoto;
        if (headerProfilePic) headerProfilePic.src = profilePhoto;

        const personName = userData.nomeCompleto || userData.nome || 'Novo Usuário';
        const curriculumData = JSON.parse(localStorage.getItem('userCurriculumData') || '{}');
        const professionalTitle = curriculumData.currentJobTitle || (curriculumData.summary ? curriculumData.summary.split('.')[0] : 'Adicione seu Cargo');


        if (profileUserNameElement) {
            profileUserNameElement.textContent = personName;
        }
        if (headerUserNameElement) {
            headerUserNameElement.textContent = personName + ' ';
            const arrowIcon = headerUserNameElement.querySelector('.ri-arrow-down-s-fill');
            if (arrowIcon) {
                headerUserNameElement.appendChild(arrowIcon);
            }
        }

        if (profileTituloProfissionalElement) {
            profileTituloProfissionalElement.textContent = professionalTitle;
        }
    }

    loadAndDisplayProfileData();

    function loadUserName() {
        loadAndDisplayProfileData();
    }
    loadUserName();
});