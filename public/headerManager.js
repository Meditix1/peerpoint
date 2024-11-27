let jwtTokenHeader = sessionStorage.getItem('authToken');

function decodeJWT(token) {
    const parts = token.split('.'); // Split the token into parts
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token');
    }

    const payload = parts[1]; // Get the payload part
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))); // Decode base64url
    return decodedPayload;
}

const decoded = decodeJWT(jwtTokenHeader);

// Get user image if not already exist
async function fetchUserInfo() {
    try {
        const response = await fetch('/account/getUserInfo?user_id=' + decoded.user.id, {
            method: 'GET'
        });
        const res = await response.json();
        if(res.profile_pic == null) {
            sessionStorage.setItem("profilePic", "../img/blank_pfp.png");
            updateProfilePic("../img/blank_pfp.png"); // Update the profile picture in the header
        }
        else {
            sessionStorage.setItem("profilePic", res.profile_pic);
            updateProfilePic(res.profile_pic); // Update the profile picture in the header
        }
        
    } catch (err) {
        console.error(err)
        alert("Error fetching user info");
    }
}

// Function to update the profile picture in the header
function updateProfilePic(profilePic) {
    const profileImage = document.querySelector('.profile img');
    if (profileImage) {
        profileImage.src = profilePic; // Update the image source
    }
}

// Render the header immediately without the profile picture
class WebsiteHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="navbar mb-5">
            <div class="logo">
                <img alt="PeerPoint logo" height="40" src="../img/PeerPoint-Logo.png" width="40"/>
                PeerPoint
            </div>
            <div class="nav-links">
                <a href="/main/dashboard.html">Home</a>
                <a href="../group/groupList.html">Projects</a>
                <a href="#">Services</a>
                <a href="#">Contact</a>
            </div>
            <div class="profile">
                <img alt="Profile picture of a user with a neutral expression" height="40" src="" width="40" />
                <div class="name">${decoded.user.username}</div>
                <div class="dropdown">
                    <a href="/profile/viewProfile.html">Profile</a>
                    <a href="#">Settings</a>
                    <a href="#" id="logoutBtn">Logout</a>
                </div>
            </div>
            <div class="menu-icon">
                <i class="fas fa-bars"></i>
            </div>
        </div>
        `
    }
}

customElements.define('website-header', WebsiteHeader);

// Add event listeners after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    if(sessionStorage.getItem('profilePic') == undefined) {
        fetchUserInfo();
    } else {
        profilePic = sessionStorage.getItem("profilePic");
        updateProfilePic(profilePic)
    }

    // open the dropdown for profile
    const profile = document.querySelector('.profile');
    const dropdown = document.querySelector('.dropdown');

    profile.addEventListener('click', function () {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function (event) {
        if (!profile.contains(event.target)) {
            dropdown.style.display = 'none';
        }
    });

    // logout user
    document.getElementById('logoutBtn').addEventListener("click", function () {
        sessionStorage.clear();
        window.location.href = "/account/login.html";
    });
});