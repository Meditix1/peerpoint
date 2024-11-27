// addMaterial.js

// Select DOM elements
const addMaterialBtn = document.getElementById('addMaterialBtn');
const addMaterialPopup = document.getElementById('addMaterialPopup');
const closePopup = document.getElementById('closePopup');
const addMaterialForm = document.getElementById('addMaterialForm');
const contentInput = document.getElementById('content');
const tagsInput = document.getElementById('tags');

// Show the popup form when the "Add New Material" button is clicked
addMaterialBtn.addEventListener('click', () => {
    addMaterialPopup.style.display = 'block';
});

// Close the popup form when the close button is clicked
closePopup.addEventListener('click', () => {
    addMaterialPopup.style.display = 'none';
});

// Close the popup when the user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === addMaterialPopup) {
        addMaterialPopup.style.display = 'none';
    }
});

// Handle form submission
addMaterialForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get values from form inputs
    const content = contentInput.value.trim();
    const tags = tagsInput.value.trim();

    // Prepare the data to send to the backend
    const newMaterial = {
        content: content,
        tags: tags
    };

    try {
        // Make a POST request to add the new material
        const response = await fetch('http://localhost:3000/study/7/materials', { // Update with your group ID
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMaterial)
        });

        const result = await response.json();
        if (response.ok) {
            // Add the new material to the list of flashcards
            const flashcard = createFlashcard(result.material);
            document.getElementById('materialsList').appendChild(flashcard);
            // Close the popup
            addMaterialPopup.style.display = 'none';
            // Clear the form fields
            addMaterialForm.reset();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error adding material:', error);
        alert('An error occurred while adding material.');
    }
});

// Create a flashcard element to display the material
function createFlashcard(material) {
    const flashcard = document.createElement('div');
    flashcard.classList.add('flashcard');

    flashcard.innerHTML = `
        <h3>Content:</h3>
        <p>${material.content}</p>
        <h4>Tags:</h4>
        <p>${material.tags}</p>
    `;

    return flashcard;
}
