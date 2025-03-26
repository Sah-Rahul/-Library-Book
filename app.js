const API = "https://api.freeapi.app/api/v1/public/books";
const BookList = document.getElementById("bookList");
const Search = document.getElementById("search");
const SortByTitle = document.getElementById("sortTitle");
const SortByDate = document.getElementById("sortDate");
const GridView = document.getElementById("gridView");
const ListView = document.getElementById("listView");
const BackBtn = document.getElementById("back");
const NextBtn = document.getElementById("next");

let allBooks = [];
let filteredBooks = [];
let isGridView = true;
let currentPage = 1;
const booksPerPage = 4;

// Fetch Books from API
const dataFetch = async () => {
  try {
    const response = await fetch(API);
    const data = await response.json();
    allBooks = data.data.data || [];
    // console.log(allBooks)
    if(!allBooks){
      BookList.innerHTML = 'Loading...'
    }
    filteredBooks = [...allBooks];
    displayBooks();
  } catch (error) {
    console.error("Error fetching data:", error);
    BookList.innerHTML = "<p class='text-red-500'>Failed to load books.</p>";
  }
};

const displayBooks = () => {
  BookList.innerHTML = "";
  let start = (currentPage - 1) * booksPerPage;
  let end = start + booksPerPage;
  let paginatedBooks = filteredBooks.slice(start, end);

  paginatedBooks.forEach((item) => {
    let image = item.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150";
    let title = item.volumeInfo.title || "No Title";
    let author = item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Unknown Author";
    let publishDate = item.volumeInfo.publishedDate || "Unknown Date";
    let infoLink = item.volumeInfo.infoLink || "#"; // Default to "#" if no link

    let bookCard = `
      <div class="${isGridView ? "bg-white p-4 rounded-lg shadow-md" : "bg-white p-4 rounded-lg shadow-md flex items-center"}">
        <a href="${infoLink}" target="_blank">
          <img
            src="${image}"
            alt="Book Cover"
            class="${isGridView ? "w-full h-48 object-cover rounded-md" : "w-20 h-20 object-cover rounded-md mr-4"}"
          />
        </a>
        <div>
          <h3 class="text-lg font-semibold mt-2">${title}</h3>
          <p class="text-gray-600">by ${author}</p>
          <span class="text-gray-500 text-sm">Published: ${publishDate}</span> 
        </div>
      </div>
    `;
    BookList.innerHTML += bookCard;
  });

  BackBtn.disabled = currentPage === 1;
  NextBtn.disabled = end >= filteredBooks.length;
};

// Search Functionality
Search.addEventListener("input", (e) => {
  const searchQuery = e.target.value.toLowerCase();
  filteredBooks = allBooks.filter(
    (book) =>
      book.volumeInfo.title?.toLowerCase().includes(searchQuery) ||
      book.volumeInfo.authors?.join(", ").toLowerCase().includes(searchQuery)
  );
  currentPage = 1;
  displayBooks();
});

// Sort by Title
SortByTitle.addEventListener("click", () => {
  filteredBooks.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
  displayBooks();
});

// Sort by Date
SortByDate.addEventListener("click", () => {
  filteredBooks.sort((a, b) => (b.volumeInfo.publishedDate || "0").localeCompare(a.volumeInfo.publishedDate || "0"));
  displayBooks();
});

// Toggle Grid View
GridView.addEventListener("click", () => {
  isGridView = true;
  displayBooks();
});

// Toggle List View
ListView.addEventListener("click", () => {
  isGridView = false;
  displayBooks();
});

// Pagination
BackBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayBooks();
  }
});

NextBtn.addEventListener("click", () => {
  if (currentPage * booksPerPage < filteredBooks.length) {
    currentPage++;
    displayBooks();
  }
});

dataFetch();
