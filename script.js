const popupOverlay = document.getElementById("popup-overlay");
const popupBox = document.getElementById("popup-box");
const addPopupButton = document.getElementById("add-popup-button");
const closePopup = document.getElementById("close-popup");
const cancelPopup = document.getElementById("cancel-popup");
const bookForm = document.getElementById("book-form");
const bookList = document.getElementById("book-list");
const titleInput = document.getElementById("book-title-input");
const authorInput = document.getElementById("book-author-input");
const descriptionInput = document.getElementById("book-description-input");

let books = [];

const sampleBooks = [
  {
    id: "book-1",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    description: "A personal finance classic about money mindset, investing, and financial independence.",
  },
];

function openPopup() {
  popupOverlay.style.display = "block";
  popupBox.style.display = "block";
  titleInput.focus();
}

function closePopupModal() {
  popupOverlay.style.display = "none";
  popupBox.style.display = "none";
  bookForm.reset();
}

function saveBooks() {
  localStorage.setItem("booksky-books", JSON.stringify(books));
}

function getBooks() {
  const stored = localStorage.getItem("booksky-books");
  if (stored) {
    return JSON.parse(stored);
  }
  return sampleBooks.slice();
}

function createBookCard(book) {
  const card = document.createElement("article");
  card.className = "book-card";
  card.innerHTML = `
    <div>
      <h3>${book.title}</h3>
      <h4>${book.author}</h4>
      <p>${book.description || "No description provided."}</p>
    </div>
    <button class="delete-button" type="button" data-id="${book.id}">Delete</button>
  `;
  return card;
}

function renderBooks() {
  bookList.innerHTML = "";

  if (!books.length) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "book-card";
    emptyMessage.innerHTML = `
      <h3>Your bookshelf is empty.</h3>
      <p>Tap the add button to start tracking books you want to read or have already finished.</p>
    `;
    bookList.append(emptyMessage);
    return;
  }

  books.forEach((book) => {
    bookList.append(createBookCard(book));
  });
}

function addBook(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !author) {
    alert("Please enter both a book title and author.");
    return;
  }

  const newBook = {
    id: `book-${Date.now()}`,
    title,
    author,
    description,
  };

  books.unshift(newBook);
  saveBooks();
  renderBooks();
  closePopupModal();
}

function deleteBook(id) {
  books = books.filter((book) => book.id !== id);
  saveBooks();
  renderBooks();
}

addPopupButton.addEventListener("click", openPopup);
closePopup.addEventListener("click", closePopupModal);
cancelPopup.addEventListener("click", closePopupModal);
popupOverlay.addEventListener("click", (event) => {
  if (event.target === popupOverlay) {
    closePopupModal();
  }
});

bookForm.addEventListener("submit", addBook);

bookList.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-button");
  if (!button) return;
  deleteBook(button.dataset.id);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && popupOverlay.style.display === "block") {
    closePopupModal();
  }
});

function init() {
  books = getBooks();
  renderBooks();
}

init();
