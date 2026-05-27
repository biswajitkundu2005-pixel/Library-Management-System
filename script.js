// Initialize books array from localStorage or with sample data
let books = JSON.parse(localStorage.getItem('libraryBooks')) || [
    { bookId: 1, title: "Java Programming", author: "James Gosling", isIssued: false },
    { bookId: 2, title: "Data Structures and Algorithms", author: "Schaum", isIssued: false },
    { bookId: 3, title: "Operating System Concepts", author: "Galvin", isIssued: false },
    { bookId: 4, title: "Computer Networks", author: "Andrew S. Tanenbaum", isIssued: false },
    { bookId: 5, title: "Database Management Systems", author: "Raghu Ramakrishnan", isIssued: true },
    { bookId: 6, title: "Software Engineering", author: "Ian Sommerville", isIssued: false },
    { bookId: 7, title: "Artificial Intelligence", author: "Stuart Russell", isIssued: false },
    { bookId: 8, title: "Computer Architecture", author: "John L. Hennessy", isIssued: false },
    { bookId: 9, title: "Digital Electronics", author: "Morris Mano", isIssued: true },
    { bookId: 10, title: "Theory of Computation", author: "Michael Sipser", isIssued: false },
    { bookId: 11, title: "Compiler Design", author: "Alfred V. Aho", isIssued: false },
    { bookId: 12, title: "Machine Learning", author: "Tom Mitchell", isIssued: false },
    { bookId: 13, title: "Microprocessors and Interfacing", author: "Douglas V. Hall", isIssued: false },
    { bookId: 14, title: "Computer Graphics", author: "Donald Hearn", isIssued: true },
    { bookId: 15, title: "Discrete Mathematics", author: "Kenneth Rosen", isIssued: false }
];

let currentFilter = 'all';

// Save books to localStorage
function saveBooks() {
    localStorage.setItem('libraryBooks', JSON.stringify(books));
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Update statistics
function updateStats() {
    const total = books.length;
    const available = books.filter(b => !b.isIssued).length;
    const issued = books.filter(b => b.isIssued).length;

    document.getElementById('totalBooks').textContent = total;
    document.getElementById('availableBooks').textContent = available;
    document.getElementById('issuedBooks').textContent = issued;
}

// Filter books based on current filter
function getFilteredBooks() {
    if (currentFilter === 'available') {
        return books.filter(b => !b.isIssued);
    } else if (currentFilter === 'issued') {
        return books.filter(b => b.isIssued);
    }
    return books;
}

// Display books
function displayBooks(booksToDisplay = null) {
    const container = document.getElementById('booksContainer');
    const displayList = booksToDisplay || getFilteredBooks();

    if (displayList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <p>No books found</p>
                <small>Try adjusting your search or filter</small>
            </div>
        `;
        return;
    }

    container.innerHTML = displayList.map(book => `
        <div class="book-card">
            <h3>${book.title}</h3>
            <div class="book-info">
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Book ID:</strong> #${book.bookId}</p>
            </div>
            <span class="book-status ${book.isIssued ? 'status-issued' : 'status-available'}">
                ${book.isIssued ? '● Issued' : '● Available'}
            </span>
            <div class="book-actions">
                ${!book.isIssued ?
            `<button class="btn btn-small btn-success" onclick="issueBook(${book.bookId})">Issue Book</button>` :
            `<button class="btn btn-small btn-warning" onclick="returnBook(${book.bookId})">Return Book</button>`
        }
                <button class="btn btn-small btn-danger" onclick="deleteBook(${book.bookId})">Delete</button>
            </div>
        </div>
    `).join('');

    updateStats();
}

// Add book
function addBook(event) {
    event.preventDefault();

    const bookId = parseInt(document.getElementById('bookId').value);
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();

    // Check if book ID already exists
    if (books.some(b => b.bookId === bookId)) {
        showToast('Book ID already exists! Please use a unique ID.', 'error');
        return;
    }

    const newBook = {
        bookId: bookId,
        title: title,
        author: author,
        isIssued: false
    };

    books.push(newBook);
    saveBooks();
    displayBooks();

    document.getElementById('addBookForm').reset();
    showToast('Book added successfully!', 'success');
}

// Delete book
function deleteBook(id) {
    if (confirm('Are you sure you want to delete this book?')) {
        books = books.filter(b => b.bookId !== id);
        saveBooks();
        displayBooks();
        showToast('Book deleted successfully!', 'success');
    }
}

// Issue book
function issueBook(id) {
    const book = books.find(b => b.bookId === id);
    if (book && !book.isIssued) {
        book.isIssued = true;
        saveBooks();
        displayBooks();
        showToast(`"${book.title}" issued successfully!`, 'success');
    }
}

// Return book
function returnBook(id) {
    const book = books.find(b => b.bookId === id);
    if (book && book.isIssued) {
        book.isIssued = false;
        saveBooks();
        displayBooks();
        showToast(`"${book.title}" returned successfully!`, 'success');
    }
}

// Search books
function searchBooks(query) {
    const searchTerm = query.toLowerCase();
    const filtered = getFilteredBooks().filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.bookId.toString().includes(searchTerm)
    );
    displayBooks(filtered);
}

// Set filter
function setFilter(filter) {
    currentFilter = filter;

    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.filter === filter) {
            tab.classList.add('active');
        }
    });

    // Clear search and display filtered books
    document.getElementById('searchInput').value = '';
    displayBooks();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    displayBooks();

    document.getElementById('addBookForm').addEventListener('submit', addBook);

    document.getElementById('searchInput').addEventListener('input', function (e) {
        searchBooks(e.target.value);
    });

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            setFilter(this.dataset.filter);
        });
    });
});
