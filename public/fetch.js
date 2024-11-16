const fetchWithAuth = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (response.status === 401) {
            // If the response is 401 Unauthorized, redirect to the login page
            alert('Unauthorized, please login!')
            window.location.href = '/account/login.html'; 
            return;
        }

        return response.json(); // Otherwise, return the JSON data
    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
};