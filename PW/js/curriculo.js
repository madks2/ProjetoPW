document.addEventListener('DOMContentLoaded', () => {

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
            `;
            educationContainer.appendChild(newEducationEntry);
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
            `;
            experienceContainer.appendChild(newExperienceEntry);
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
            `;
            languagesContainer.appendChild(newLanguageEntry);
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
                <input type="url" name="course_link[]" placeholder="Link para o certificado/curso">
            `;
            coursesContainer.appendChild(newCourseEntry);
        });
    }

    const resumeForm = document.getElementById('resume-form');
    if (resumeForm) {
        resumeForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Formulário de currículo enviado com sucesso! (Funcionalidade de envio real não implementada neste exemplo)');
            
        });
    }

    fetchCurrentsTechNews();

     function loadUserName() {
        const profileUserNameElement = document.getElementById('profile-user-name');
        const headerUserNameElement = document.getElementById('header-user-name');

        const userDataString = localStorage.getItem('userDataCandidato');

        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                const userName = userData.nome;

                if (userName) {
                    if (profileUserNameElement) {
                        profileUserNameElement.textContent = userName;
                    }
                    if (headerUserNameElement) {
                        const arrowIcon = headerUserNameElement.querySelector('.ri-arrow-down-s-fill');
                        headerUserNameElement.textContent = userName + ' ';
                        if (arrowIcon) {
                            headerUserNameElement.appendChild(arrowIcon);
                        }
                    }
                } else {
                    if (profileUserNameElement) profileUserNameElement.textContent = "Meu Perfil";
                    if (headerUserNameElement) {
                        const arrowIcon = headerUserNameElement.querySelector('.ri-arrow-down-s-fill');
                        headerUserNameElement.textContent = "Eu ";
                        if (arrowIcon) headerUserNameElement.appendChild(arrowIcon);
                    }
                }
            } catch (e) {
                console.error("Erro ao usar o userDataCandidato do localStorage:", e);
            }
        } else {
        }
    }
    loadUserName();
});