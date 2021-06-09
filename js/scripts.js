const randomUserURL = 'https://randomuser.me/api/?results=12';
const cardGallery = document.querySelector('#gallery');

fetch(randomUserURL)
  .then(res => res.json())
  .then(data => createUser(data.results))
  .catch(err =>
    console.log('There was an error while processing request', err)
  );

function createUser(users) {
  const userCards = users
    .map(user => {
      return `
      <div class="card">
        <div class="card-img-container">
          <img class="card-img" src="${user.picture.large}" alt="profile picture">
        </div>
        <div class="card-info-container">
          <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="card-text">${user.email}</p>
          <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
        </div>
      </div>
    `;
    })
    .join('');

  cardGallery.insertAdjacentHTML('beforeend', userCards);
}
