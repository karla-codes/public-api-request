const randomUserURL = 'https://randomuser.me/api/?results=12&nat=us';
const cardGallery = document.querySelector('#gallery');
const searchContainer = document.querySelector('.search-container');
const body = document.querySelector('body');

fetch(randomUserURL)
  .then(res => res.json())
  .then(data => createUser(data.results))
  .catch(err =>
    console.log('There was an error while processing request', err)
  );

/**
 * Adds the event listener to the search submit button
 *
 * @param {array} names
 */
function addSearchEvent(names) {
  const submitButton = document.querySelector('#search-submit');
  submitButton.addEventListener('click', () => {
    searchFilter(names);
  });
}

/**
 * Compares the search value with the employee card names. If the card name does not match,
 * the card will be hidden. When the search value is blank, all cards are shown.
 *
 * @param {array} names
 */
function searchFilter(names) {
  const inputValue = document
    .querySelector('#search-input')
    .value.toLowerCase();
  names.forEach(name => {
    const userName = name.textContent.toLowerCase();
    const card = name.parentNode.parentNode;

    if (!userName.includes(inputValue)) {
      card.style.display = 'none';
    } else if (inputValue === '') {
      card.style.display = '';
    }
  });
}

/**
 * Adds a search form to the page
 *
 */
function addSearchOption() {
  const formHTML = `
  <form action="#" method="get">
  <input type="search" id="search-input" class="search-input" placeholder="Search...">
  <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
  </form>
  `;
  searchContainer.insertAdjacentHTML('beforeend', formHTML);
}

/**
 * Handles running search events
 *
 * @param {array} users
 */
function handleEvents(users) {
  const cardNames = document.querySelectorAll('#name');
  addSearchOption();
  addSearchEvent(cardNames);
  addClickEvent(users);
}

/**
 * Adds an event listener to each employee info card that
 * listens for a click and runs createUserModal
 *
 * @param {array} users
 */
function addClickEvent(users) {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      createUserModal(users, card);
    });
  });
}

/**
 * Creates a card for each employee that displays their first and last name,
 * email, and location using the information fetched from the Random User API
 *
 * handleEvents is executed
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

  handleEvents(users);
}

/**
 * Creates and displays a modal with additional information about the
 * employee who's card was clicked.
 *
 * @param {array} users
 * @param {array} card
 */
function createUserModal(users, card) {
  const cardName = card.querySelector('#name').textContent;
  const userModals = users.map(user => {
    const userPhone = user.cell.replace(/[^0-9]/g, '');
    const formattedPhone = userPhone.replace(
      /(\d{3})(\d{3})(\d+)/,
      '($1) $2-$3'
    );
    const userDOB = user.dob.date
      .replace(/T\d+\D\d+\D\d+\D\d+Z/g, '')
      .replace(/[^0-9]/g, '');
    const formattedDOB = userDOB.replace(/(\d{4})(\d{2})(\d{2})/, '$2/$3/$1');
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
                <p class="modal-text">Birthday: ${formattedDOB}</p>
            </div>
          </div>
          <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
          </div>
        </div>
      `;

    const name = user.name.first + ' ' + user.name.last;
    const modals = { modalHTML, name };
    return modals;
  });

  addModal(cardName, userModals);

  addModalButtonEvents(userModals);

  addCloseModalEvent();
}

/**
 * Allows users to toggle between employees within the modal
 *
 * @param {element} button
 * @param {array} modals
 */
function modalToggle(button, modals) {
  const activeModal = button.parentNode.parentNode;
  const modalName =
    activeModal.childNodes[1].childNodes[3].childNodes[3].textContent;
  if (button.textContent === 'Next') {
    modals.forEach(modal => {
      if (modal.name === modalName && modals.indexOf(modal) < 11) {
        const nextIndex = modals.indexOf(modal) + 1;
        const modalContainer = document.querySelector('.modal-container');
        modalContainer.remove();
        body.insertAdjacentHTML('beforeend', modals[nextIndex].modalHTML);
        addModalButtonEvents(modals);
        addCloseModalEvent();
      }
    });
  } else if (button.textContent === 'Prev') {
    modals.forEach(modal => {
      if (modal.name === modalName && modals.indexOf(modal) > 0) {
        const prevIndex = modals.indexOf(modal) - 1;
        const modalContainer = document.querySelector('.modal-container');
        modalContainer.remove();
        body.insertAdjacentHTML('beforeend', modals[prevIndex].modalHTML);
        addModalButtonEvents(modals);
        addCloseModalEvent();
      }
    });
  }
}

/**
 * Adds event that closes a modal
 *
 */
function addCloseModalEvent() {
  const exitModalButton = document.querySelector('#modal-close-btn');
  exitModalButton.addEventListener('click', removeModal);
}

/**
 * Adds click event to 'Next' and 'Prev' modal buttons
 *
 * @param {array} modals
 */
function addModalButtonEvents(modals) {
  const nextButton = document.querySelector('#modal-next');
  const prevButton = document.querySelector('#modal-prev');
  const modalButtons = [nextButton, prevButton];
  modalButtons.forEach(button => {
    button.addEventListener('click', e => {
      modalToggle(e.target, modals);
    });
  });
}

/**
 * Adds modal with more details on the employee who's card
 * was clicked.
 *
 * @param {*} cardName
 * @param {*} userModals
 */
function addModal(cardName, userModals) {
  userModals.forEach(modal => {
    if (modal.name === cardName) {
      body.insertAdjacentHTML('beforeend', modal.modalHTML);
    }
  });
}

/**
 * Removes modal when 'x' button on modal is clicked
 *
 */
function removeModal() {
  const modal = document.querySelector('.modal-container');
  modal.remove();
}
