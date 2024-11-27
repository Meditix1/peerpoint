document.addEventListener('DOMContentLoaded', () => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const groupId = params.get('id');
    const token = sessionStorage.getItem("authToken");

   // Fetch Group Details
const fetchGroupDetails = async () => {
    try {
        const response = await fetchWithAuth(`/groups/getGroupDetails?group_id=${groupId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const res = await response.json();
        $('#grpDesc').text(res.description);
        $('#grpName').text(res.group_name);

        const createdAt = new Date(res.created_at);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        const formattedDate = createdAt.toLocaleString('en-US', options);
        $('#createdAt').text(formattedDate);

        // Populate group members list
        let grpMembersHtmlString = "";
        for (let m in res.group_members) {
            let member = res.group_members[m];

            // Static fallback profile image if no image URL is provided
            const profileImageUrl = member.profile_picture_url || 'https://storage.googleapis.com/a1aa/image/fbWk0TX86Mwf7UEFk1eWmYtXi6VyuZaA80lfM98lF62V5jPPB.jpg';

            grpMembersHtmlString += `
                <li>
                    <img alt="Profile picture of ${member.username}" height="50" width="50" src="${profileImageUrl}" />
                    <div class="member-info">
                        <span>${member.username}</span>
                        <span>Role: ${member.group_role}</span>
                    </div>
                </li>`;
        }

        // Add new member functionality
        grpMembersHtmlString += `
            <li id="addMember" style="cursor:pointer;">
                <span class="material-symbols-outlined" style="font-size: 50px; margin-right: 10px;">add_circle</span>
                <div class="member-info"><span>Add Member</span></div>
            </li>`;

        $('#groupMemberList').html(grpMembersHtmlString);

        // Add member functionality
        $("#addMember").on("click", async function () {
            const { value: newInviteEmail } = await Swal.fire({
                title: "Add new member",
                input: "text",
                showCancelButton: true,
                inputValidator: (value) => !value && "This is a required field!"
            });

            if (newInviteEmail) {
                Swal.fire({ title: 'Adding...', text: 'Please wait...', allowOutsideClick: false, didOpen: Swal.showLoading });

                await fetchWithAuth("/groups/addNewMember", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ group_id: groupId, invited_user_email: newInviteEmail })
                })
                .then(response => response.json())
                .then(json => {
                    if (json.error) Swal.fire(json.error);
                    else Swal.fire("New member added!");
                })
                .catch(() => Swal.fire("Error, please try again!"));
            }
        });
    } catch (error) {
        console.error('Error fetching group details:', error);
        alert("Error fetching group details. Check console.");
    }
};


    // Populate Tabs and Flashcards
    const populateTabsAndFlashcards = (materials) => {
        const tagsSet = new Set();
        materials.forEach(material => {
            const tags = material.tags ? material.tags.split(',').map(tag => tag.trim()) : [];
            tags.forEach(tag => tagsSet.add(tag));
        });

        // Populate tags (tabs)
        const tabsContainer = document.getElementById('tabs-container');
        tabsContainer.innerHTML = ''; // Clear previous tabs
        tagsSet.forEach(tag => {
            const tab = document.createElement('div');
            tab.classList.add('tab');
            tab.textContent = tag;
            tab.addEventListener('click', () => filterFlashcardsByTag(tag, materials));
            tabsContainer.appendChild(tab);
        });

        // Display flashcards
        displayFlashcards(materials);
    };

    // Filter Flashcards by Tag
    const filterFlashcardsByTag = (tag, materials) => {
        const filteredMaterials = materials.filter(material => {
            const tags = material.tags ? material.tags.split(',').map(tag => tag.trim()) : [];
            return tags.includes(tag);
        });
        displayFlashcards(filteredMaterials);
    };

    // Display Flashcards
    const displayFlashcards = (materials) => {
        const flashcardsContainer = document.getElementById('flashcards-container');
        flashcardsContainer.innerHTML = ''; // Clear existing flashcards

        materials.forEach(material => {
            const flashcard = document.createElement('div');
            flashcard.classList.add('flashcard');
            flashcard.innerHTML = `
                <div class="flashcard-header">
                    <h3>Material ${material.id}</h3>
                    <p><strong>Tags:</strong> ${material.tags}</p>
                </div>
                <div class="flashcard-body">
                    <p>${material.content}</p>
                </div>
            `;
            flashcardsContainer.appendChild(flashcard);
        });
    };

    // Add Material Form Logic
    const addMaterialBtn = document.getElementById('add-material-btn');
    const addMaterialPopup = document.getElementById('add-material-popup');
    const saveMaterialBtn = document.getElementById('save-material-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const materialContent = document.getElementById('material-content');
    const materialTags = document.getElementById('material-tags');

    addMaterialBtn.addEventListener('click', () => addMaterialPopup.style.display = 'flex'); // Popup should be centered
    cancelBtn.addEventListener('click', () => addMaterialPopup.style.display = 'none');

    // Add new flashcard after saving
    const addFlashcard = (material) => {
        const flashcardsContainer = document.getElementById('flashcards-container');

        const flashcard = document.createElement('div');
        flashcard.classList.add('flashcard');
        flashcard.innerHTML = `
            <div class="flashcard-header">
                <h3>Material ${material.id}</h3>
                <p><strong>Tags:</strong> ${material.tags}</p>
            </div>
            <div class="flashcard-body">
                <p>${material.content}</p>
            </div>
        `;
        flashcardsContainer.appendChild(flashcard);
    };

    saveMaterialBtn.addEventListener('click', async () => {
        const content = materialContent.value;
        const tags = materialTags.value;

        if (!content || !tags) {
            alert("Both content and tags are required.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/study/${groupId}/materials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ content, tags })
            });

            const result = await response.json();
            if (result.message === "Material added successfully!") {
                addMaterialPopup.style.display = 'none';
                fetchMaterials(); // Re-fetch materials after adding
            }
        } catch (error) {
            console.error('Error adding material:', error);
        }
    });

    // Initial fetch of group details and materials
    fetchGroupDetails();
    fetchMaterials();
});
