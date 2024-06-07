"use strict";

// Selecting the necessary DOM elements
const inputSearch = document.getElementById('input-search-username');
const resultSearchBox = document.getElementById('result-search-box');
const imgUser = document.getElementById('imgUser');
const dataProfileUser = document.querySelectorAll('.data-profile-user');
const userName = document.querySelector('.username');
const bioUser = document.querySelector('.bio-user');
const containerResReposUser = document.getElementById('containerRepos');
const viewAllBtn = document.getElementById('view-all-btn');

let reposUser = []; // Array to hold the user repositories
let debounceTimeout; // Timeout ID for debouncing

// Function to fetch user data from GitHub API
async function requestSearch(username) {
  try {
    let response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error('Error in requesting search');
    return await response.json();
  } catch (error) {
    console.error(error);
    return { message: 'User not found' }; // Return an error message object
  }
}

// Function to populate user profile data
function importData(data) {
  resultSearchBox.classList.replace('flex', 'hidden'); // Hide the search result box
  imgUser.src = data.avatar_url || ''; // Set the user's avatar
  dataProfileUser[0].textContent = data.followers || 0; // Display followers count
  dataProfileUser[1].textContent = data.following || 0; // Display following count
  dataProfileUser[2].textContent = data.location || 'No location available'; // Display user's location
  userName.textContent = data.name || data.login; // Display user's name
  bioUser.textContent = data.bio || 'No bio available'; // Display user's bio
}

// Function to fetch user repositories from GitHub API
async function requestRepos(username) {
  try {
    let response = await fetch(`https://api.github.com/users/${username}/repos`);
    if (!response.ok) throw new Error('Error in requesting repos');
    reposUser = await response.json(); // Store repositories in global array
    importRepos(reposUser.slice(0, 4)); // Display the first 4 repositories
  } catch (error) {
    console.error(error);
  }
}

// Function to display user repositories
function importRepos(dataRepos) {
  containerResReposUser.innerHTML = ''; // Clear the container
  dataRepos.forEach(repo => {
    containerResReposUser.innerHTML += `
        <a href="${repo.html_url}" target="_blank" class="w-[48%] p-4 mb-12 rounded-2xl bg-gradient-to-r from-colorDarkBackground to-colorDarkSecondary max-sm:w-full max-sm:mb-6">
          <h2 class="title-repo font-normal text-lg text-colorLightBackground max-sm:text-base">${repo.name}</h2>
          <p class="desc-repo text-sm text-colorLightSecondary font-light mt-4 mb-5">${repo.description ? repo.description.slice(0, 50) : 'No description available'}</p>
          <div class="more-data-repo flex items-center text-colorLightSecondary max-sm:text-sm">
            ${repo.license ? `<div class="license flex"><img src="./Chield_alt.svg" alt="chield" /><p>${repo.license.name}</p></div>` : ''}
            <div class="nesting flex ml-3"><img src="./Nesting.svg" alt="nesting" /><p>${repo.forks_count}</p></div>
            <div class="star flex ml-3"><img src="./Star.svg" alt="star" /><p>${repo.stargazers_count}</p></div>
            <div class="time-update flex text-[12px] ml-5 max-sm:text-[10px]"><p>updated ${new Date(repo.updated_at).toLocaleDateString()}</p></div>
          </div>
        </a>`;
  });
}

// Event listener for the "View All" button to display all repositories
viewAllBtn.addEventListener('click', () => {
  importRepos(reposUser); // Display all repositories
  // Hide the button after clicking
  viewAllBtn.classList.remove('block');
  viewAllBtn.classList.add('hidden');
});

// Event listener for input field to search users
inputSearch.addEventListener('input', () => {
  clearTimeout(debounceTimeout); // Clear the previous timeout
  const inputValue = inputSearch.value.trim(); // Get the trimmed input value

  if (inputValue.length > 0) {
    debounceTimeout = setTimeout(async () => {
      resultSearchBox.classList.replace('hidden', 'flex'); // Show the search result box
      const resultUserData = await requestSearch(inputValue); // Fetch user data

      if (resultUserData.message) { // If user is not found
        resultSearchBox.innerHTML = `
                <div class="contianer-result-search-data flex items-center">
                    <div class="username-bio-box">
                        <h3 class="text-colorLightBackground font-medium">${resultUserData.message}</h3>
                    </div>
                </div>`;
        resultSearchBox.classList.replace('hover:cursor-pointer', 'hover:cursor-not-allowed'); // Change cursor to not allowed
      } else { // If user is found
        resultSearchBox.innerHTML = `
                <div class="contianer-result-search-data flex items-center">
                    <div class="img-box mr-2">
                        <div class="image-user p-2 size-[80px] rounded-lg max-md:mr-4 max-md:size-[80px]">
                            <img class="size-full rounded-lg" src="${resultUserData.avatar_url}" alt="image user" />
                        </div>
                    </div>
                    <div class="username-bio-box">
                        <h3 class="text-colorLightBackground font-medium">${resultUserData.login}</h3>
                        <p class="text-base text-colorLightSecondary font-light">${resultUserData.bio ? resultUserData.bio.slice(0, 60) + ' ...' : 'No bio available'}</p>
                    </div>
                </div>`;
        resultSearchBox.classList.replace('hover:cursor-not-allowed', 'hover:cursor-pointer'); // Change cursor to pointer

        // Event handler to show the user data and repositories when a result is clicked
        resultSearchBox.onclick = async () => {
          // Show the "View All" button
          viewAllBtn.classList.add('block');
          viewAllBtn.classList.remove('hidden');
          importData(resultUserData); // Populate user data
          await requestRepos(resultUserData.login); // Fetch and display user repositories
        };
      }
    }, 1000); // 1-second debounce delay
  } else {
    resultSearchBox.classList.replace('flex', 'hidden'); // Hide the search result box if input is empty
  }
});