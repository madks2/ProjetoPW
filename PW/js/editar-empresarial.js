document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000'; 
    const API_COMPANY_PROFILE_ENDPOINT = '/api/company/profile'; 

    function getAuthToken() {
        return localStorage.getItem('companyAuthToken');
    }

    const companyTaglineEdit = document.getElementById('companyTaglineEdit');
    const editTaglineForm = document.getElementById('editTaglineForm'); 

    async function loadCurrentTagline() {
        const storedTagline = localStorage.getItem('companyTagline') || '';
        if (companyTaglineEdit) {
            companyTaglineEdit.value = storedTagline;
        }

        const token = getAuthToken();
        if (!token) {
            console.warn('Nenhum token de autenticação encontrado. Não foi possível buscar o slogan da API.');
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

            if (response.ok) {
                const data = await response.json();
                if (companyTaglineEdit) {
                    companyTaglineEdit.value = data.tagline || storedTagline; 
                    localStorage.setItem('companyTagline', data.tagline || storedTagline); 
                }
            } else {
                console.error('Falha ao carregar slogan da API:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar slogan:', error);
        }
    }

    if (editTaglineForm) {
        editTaglineForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const newTagline = companyTaglineEdit.value; 
            const token = getAuthToken();

            if (!token) {
                alert('Você precisa estar logado para atualizar o slogan.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}${API_COMPANY_PROFILE_ENDPOINT}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ tagline: newTagline })
                });

                if (response.ok) {
                    localStorage.setItem('companyTagline', newTagline);
                    alert('Slogan atualizado com sucesso!');
                    window.location.href = '../html/feed-empresa.html';
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Falha ao atualizar slogan.');
                }
            } catch (error) {
                console.error('Erro ao salvar slogan:', error);
                alert('Erro ao salvar slogan: ' + error.message);
            }
        });
    }

    loadCurrentTagline();
});