document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('authToken');
    const like = '../img/like.png';
    const unlike = '../img/liked.png';
    const bin = '../img/bin.png';

    tinymce.init({
        selector: '#myTextarea',
        height: 200,
        menubar: false,
        plugins: 'emoticons powerpaste casechange searchreplace autolink directionality advcode visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap linkchecker emoticons advtable export autosave',
        toolbar: 'undo redo formatpainter | blocks fontfamily fontsize | emoticons bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify lineheight | removeformat',
    });

    console.log(like);
    console.log(unlike);

    // Function to fetch and render all forums
    function loadForums(isMyForums = false) {
        const user_id = {
            token: token
        };

        fetch('http://localhost:3000/forum/getAllForums?' + new URLSearchParams(user_id), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(async function (response) {
            if (response.status !== 200) {
                console.error('Error: Unable to fetch forums');
                return;
            }

            const getResponse = await response.json();
            console.log(getResponse);

            // Determine which array to use
            const forums = isMyForums ? getResponse[1] : getResponse[0];

            const container = document.getElementsByClassName("forum-home")[0];
            container.innerHTML = ''; // Clear existing forums

            forums.forEach((forum) => {
                const forumElement = document.createElement('div');
                forumElement.classList.add('single');

                // Accessing forum properties directly
                console.log(forum.thread_id);
               
                    forumElement.innerHTML = `
                    <div class='single-thread'>
                        <h1>${forum.title}</h1>
                    </div>
                    <div class='single-description'>
                        <h3>${forum.description}</h3>
                    </div>
                    <div class='like-unlike'>
                        <img src="${like}" class="like-button" alt="like"/>
                          ${isMyForums ? `<img src="${bin}" data-thread-id="${forum.thread_id}" class="bin" alt="bin" />` : ''}
                          ${isMyForums ? `<button data-thread-id="${forum.thread_id}" data-thread="${forum.title}" data-thread-desc="${forum.description}" class="editButton" onclick="EditForm">Edit</button>` : ''}
                    </div>
                `;
            
                

                container.appendChild(forumElement);
            });

            document.querySelectorAll('.editButton').forEach((button) => {
                button.addEventListener('click', function () {
                    EditForm(this);  // Pass the button element to EditForm
                });
            });
            attachLikeHandlers();
            attachDeleteHandlers();
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
    }

    function EditForm(button) {
        const threadTitle = button.dataset.thread;
        const threadDesc = button.dataset.threadDesc;
    
        const Overlay = document.createElement("div");
        Overlay.classList.add("form-overlay");
        Overlay.style.width = "100%";
        Overlay.style.height = "100vh";
        Overlay.style.backgroundColor = "rgba(250,235,215,0.7)";
        Overlay.style.position = "absolute";
        Overlay.style.backdropFilter = "blur(5.5px)";
    
        const form = document.createElement("div");
        form.classList.add("form");
        form.innerHTML =
            `
            <label for="thread" id="thread-label">Thread</label><br><br>
            <input type="text" id="thread" name="thread" value="${threadTitle}"><br><br>
            <label for="textarea" id="desc">Description</label><br><br>
            <textarea rows="5" id="myTextarea" cols="33">${threadDesc}</textarea><br><br>
            <input id="submit" type="submit" value="Submit">
        `;
    
        Overlay.appendChild(form);
    
        const main = document.getElementsByClassName("main")[0];
        main.appendChild(Overlay);
    
        const submitButton = form.querySelector('#submit');
        submitButton.addEventListener('click', submitForm);
    }
    
    // Function to attach like button handlers
    function attachLikeHandlers() {
        const likeButtons = document.querySelectorAll('.like-button');
        likeButtons.forEach((button) => {
            button.addEventListener('click', function () {
                if (this.src.includes('like.png')) {
                    this.src = unlike;
                } else {
                    this.src = like;
                }
            });
        });
    }

    // Function to attach delete button handlers
    function attachDeleteHandlers() {
        const deleteForum = document.querySelectorAll('.bin');
        deleteForum.forEach((button) => {
            button.addEventListener('click', function () {
                const threadId = this.dataset.threadId; // Retrieve thread_id from data-thread-id
                console.log(threadId);

                fetch(`http://localhost:3000/forum/${threadId}/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                })
                .then(async function (response) {
                    if (response.status === 200) {
                        alert('Deleted successfully');
                        loadForums(); // Reload forums after successful deletion
                    } else {
                        console.log(response);
                    }
                })
                .catch(function (error) {
                    console.error('Error:', error);
                });
            });
        });
    }

    // Open form for creating a new forum
    const OpenForm = () => {
        console.log('openform');
        const Overlay = document.createElement("div");
        Overlay.classList.add("form-overlay");
        Overlay.style.width = "100%";
        Overlay.style.height = "100vh";
        Overlay.style.backgroundColor = "rgba(250,235,215,0.7)";
        Overlay.style.position = "absolute";
        Overlay.style.backdropFilter = "blur(5.5px)";
    
        const form = document.createElement("div");
        form.classList.add("form");
        form.innerHTML =
            `
            <label for="thread" id="thread-label">Thread</label><br><br>
            <input type="text" id="thread" name="thread"><br><br>
            <label for="textarea" id="desc">Description</label><br><br>
            <textarea rows="5" id="myTextarea" cols="33"></textarea><br><br>
            <input id="submit" type="submit" value="Submit">
        `;
    
        Overlay.appendChild(form);
    
        const main = document.getElementsByClassName("main")[0];
        main.appendChild(Overlay);
    
        const submitButton = form.querySelector('#submit');
        submitButton.addEventListener('click', submitForm);
    };

    // Submit new forum post
    const submitForm = async () => {
        const threadInput = document.getElementById('thread');
        const descInput = document.getElementById('myTextarea');
      
        if (!threadInput || !descInput) {
          console.error('Thread or description input element not found.');
          return;
        }
      
        const thread = threadInput.value.trim();
        const desc = descInput.value.trim();
        const token = sessionStorage.getItem('authToken');

        const _thread = {
            Thread: thread,
            Desc: desc,
            Token: token
        };
        
        try {
            const response = await fetch('http://localhost:3000/forum/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(_thread)
            });

            const result = await response.json();
            if (response.ok) {
                console.log('Forum created successfully');
                loadForums(); // Reload the forums after creation
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error adding material:', error);
            alert('An error occurred while adding material.');
        }

        // Close the overlay after form submission
        const Overlay = document.getElementsByClassName("form-overlay")[0];
        Overlay.remove();
    };

    // Event listeners for buttons
    const allForumsButton = document.querySelector('.all-forums-button');
    const myForumsButton = document.querySelector('.my-forums-button');

    allForumsButton.addEventListener('click', () => loadForums(false)); // Load all forums
    myForumsButton.addEventListener('click', () => loadForums(true)); // Load user's forums

    const createButton = document.querySelector('.right button');
    createButton.addEventListener('click', OpenForm);

    loadForums(); 
});
