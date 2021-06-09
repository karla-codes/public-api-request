const randomUserURL = 'https://randomuser.me/api/?results=12';
const cardGallery = document.querySelector('#gallery');

fetch(randomUserURL)
  .then(res => res.json())
  .then(data => createUser(data.results))
  .catch(err =>
    console.log('There was an error while processing request', err)
  );

/**
 * Creates a card for each employee that displays their first and last name,
 * email, and location using the information fetched from the Random User API.
 *
 * @param {array} users
 */
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
  addClickEvent(users);
}

function addClickEvent(users) {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      createUserModal(users, card);
    });
  });
}

function createUserModal(users, card) {
  const cardName = card.querySelector('#name').textContent;
  users.forEach(user => {
    if (user.name.first + ' ' + user.name.last === cardName) {
      const body = document.querySelector('body');
      const userPhone = user.cell.replace(/[^0-9]/g, '');
      const formattedPhone = userPhone.replace(
        /(\d{3})(\d{3})(\d+)/,
        '($1) $2-$3'
      );
      // const userDOB;
      const modalHTML = `
        <div class="modal-container">
          <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${formattedPhone}</p>
                <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${user.dob.date}</p>
            </div>
          </div>
          <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
          </div>
        </div>
      `;
      body.insertAdjacentHTML('beforeend', modalHTML);
    }
  });

  const exitModalButton = document.querySelector('#modal-close-btn');
  exitModalButton.addEventListener('click', removeModal);
}

function removeModal() {
  const modal = document.querySelector('.modal-container');
  modal.remove();
}
