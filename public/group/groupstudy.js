document.addEventListener('DOMContentLoaded', () => {
    const tabsContainer = document.getElementById('tabs-container');
    const flashcardsContainer = document.getElementById('flashcards-container');
    const addMaterialBtn = document.getElementById('add-material-btn');
    const addMaterialPopup = document.getElementById('add-material-popup');
    const materialContent = document.getElementById('material-content');
    const materialTags = document.getElementById('material-tags');
    const saveMaterialBtn = document.getElementById('save-material-btn');
    const cancelBtn = document.getElementById('cancel-btn');
  
    // Get groupId from URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const groupId = params.get('id');
  
    // Populate tags (tabs) and flashcards
    const populateTabsAndFlashcards = (materials) => {
      tabsContainer.innerHTML = '';  // Clear previous tabs
      flashcardsContainer.innerHTML = '';  // Clear previous flashcards
  
      const tagsSet = new Set();  // To store unique tags
  
      // Extract tags from the materials and store them in a set
      materials.forEach(material => {
        const tags = material.tags ? material.tags.split(',').map(tag => tag.trim()) : [];
        tags.forEach(tag => {
          tagsSet.add(tag); // Add each tag to the set (avoids duplicates)
        });
      });
  
      // Create tabs for each tag
      tagsSet.forEach(tag => {
        const tab = document.createElement('div');
        tab.classList.add('tab');
        tab.textContent = tag;
        tab.addEventListener('click', () => filterFlashcardsByTag(tag, materials));
        tabsContainer.appendChild(tab);
      });
  
      // Display flashcards for all materials initially
      displayFlashcards(materials);
    };
  
    // Filter flashcards based on the selected tag
    const filterFlashcardsByTag = (tag, materials) => {
      const filteredMaterials = materials.filter(material => {
        const tags = material.tags ? material.tags.split(',').map(tag => tag.trim()) : [];
        return tags.includes(tag);
      });
      displayFlashcards(filteredMaterials);
    };
  
    // Display flashcards
    const displayFlashcards = (materials) => {
      flashcardsContainer.innerHTML = '';  // Clear previous flashcards
  
      materials.forEach(material => {
        const flashcard = document.createElement('div');
        flashcard.classList.add('flashcard');
  
        // Add content to the flashcard
        flashcard.innerHTML = `
          <h3>Material ${material.id}</h3>
          <p>${material.content}</p>
          <small><strong>Tags:</strong> ${material.tags}</small>
        `;
  
        flashcardsContainer.appendChild(flashcard);
      });
    };
  
    // Handle Add Material Popup
    addMaterialBtn.addEventListener('click', () => {
      addMaterialPopup.style.display = 'block';  // Show the popup
    });
  
    cancelBtn.addEventListener('click', () => {
      addMaterialPopup.style.display = 'none';  // Hide the popup
    });
  });
  