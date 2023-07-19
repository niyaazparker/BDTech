 // Fetch user profiles from the API
 async function fetchUserProfiles() {
    try {
      const response = await fetch('https://fa.bdtechnologies.ch/api/v1/profiles');
      if (!response.ok) {
        throw new Error('Failed to fetch user profiles');
      }
      const data = await response.json();
      console.log(data)
      if (!Array.isArray(data.profiles)) {
        throw new Error('Invalid response format: profiles is not an array');
      }
      const favorites = await fetchFavorites();
      displayUserProfiles(data.profiles, favorites);
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch favorites from the API
  async function fetchFavorites() {
    try {
      const response = await fetch('https://fa.bdtechnologies.ch/api/v1/favorites/');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      console.log(data);
      if (!data.favorites["123456"] || !data.favorites["123456"]) {
        throw new Error('Invalid response format: favorites not found');
      }
      return data.favorites["123456"];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Display user profiles in card form
  function displayUserProfiles(profiles, favorites) {
    const userProfilesContainer = document.getElementById('userProfiles');
    userProfilesContainer.innerHTML = ''; // Clear existing profiles

    profiles.forEach(profile => {
      const { name, id, avatar } = profile;
      const isFavorite = favorites.includes(id);
      const favoriteIconClass = isFavorite ? 'fas' : 'far';
      const card = `
        <div class="col-md-4 mb-4 ">
          <div class="card">
              <div class="img-body">
              <a class="btn-action">
                  <i class="fa fa-bars"></i>
              </a>
            <img src="${avatar}" class="card-img-top" alt="Profile Image">
            </div>
            <div class="card-body">
              <h2 class="card-title">${name}</h2>
              <i class="${favoriteIconClass} fa-star favorite-icon" data-profile-id="${id}"></i>
            </div>
          </div>
        </div>
      `;

      userProfilesContainer.innerHTML += card;
    });

    // Add event listener for favorite icon clicks
    const favoriteIcons = document.querySelectorAll('.favorite-icon');
    favoriteIcons.forEach(icon => {
      icon.addEventListener('click', toggleFavorite);
    });
  }

  // Toggle favorite status
  async function toggleFavorite(event) {
    const profileId = event.target.getAttribute('data-profile-id');

    try {
      // Check if the profile is already in favorites
      const favorites = await fetchFavorites();
      const isFavorite = favorites.includes(profileId);

      let updatedFavorites;

      if (isFavorite) {
        // Remove from favorites
        await removeFavorite(profileId);
        updatedFavorites = favorites.filter(id => id !== profileId);
      } else {
        // Add to favorites
        await addFavorite(profileId);
        updatedFavorites = [...favorites, profileId];
      }

      // Update the favorite icon class
      event.target.classList.toggle('fas');
      event.target.classList.toggle('far');

      // Update the favorites array in the fetchFavorites function
      fetchFavorites.favorites = updatedFavorites;
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.error('API Error:', error.response);
      }
    }
  }

  async function addFavorite(profileId) {
    const url = 'https://fa.bdtechnologies.ch/api/v1/favorites';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profileId: parseInt(profileId),

      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add favorite');
    }
  }

  async function removeFavorite(profileId) {
    const url = `https://fa.bdtechnologies.ch/api/v1/favorites/${profileId}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove favorite');
    }
  }

  // Fetch user information for single page display
  function fetchUserInfo(profileId) {
    fetch(`https://fa.bdtechnologies.ch/api/v1/profiles/${profileId}`)
      .then(response => response.json())
      .then(data => displayUserInfo(data))
      .catch(error => console.error(error));
  }

// Display user information in the modal
function displayUserInfo(userInfo) {
    const userInfoContainer = document.getElementById('userInfo');
    const userInfoAge = document.getElementById('userInfoAge');
    const userInfoCity = document.getElementById('userInfoCity');
    const userInfoAvatar = document.getElementById('userInfoAvatar');
    
    userInfoAge.textContent = userInfo.age;
    userInfoCity.textContent = userInfo.city;
    userInfoAvatar.setAttribute('src', userInfo.avatar);
        
    // Update the modal title with user name and relationship status
      const modalTitle = document.getElementById('userModalLabel');
      modalTitle.textContent = `${userInfo.name} - ${userInfo.relationship_status}`;
    // Show the modal
    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    userModal.show();
  }

  // Initialize the page
  document.addEventListener('DOMContentLoaded', () => {
    fetchUserProfiles();
  });

// Event delegation for card clicks
document.addEventListener('click', event => {
  if (event.target.classList.contains('card') || event.target.classList.contains('btn-action') || event.target.classList.contains('card-img-top')) {
    const profileId = event.target.closest('.card').querySelector('.favorite-icon').getAttribute('data-profile-id');
    navigateToUserProfile(profileId);
  }
});

// Function to navigate to the user-profile.html page with the profile ID as a query parameter
function navigateToUserProfile(profileId) {
  window.location.href = `user-profile.html?id=${profileId}`;
}

  // Event listener for toggle favorite button
  document.addEventListener('click', event => {
    if (event.target.id === 'toggleFavoriteBtn') {
      const profileId = document.querySelector('.favorite-icon').getAttribute('data-profile-id');
      toggleFavorite(event, profileId);
    }
  });