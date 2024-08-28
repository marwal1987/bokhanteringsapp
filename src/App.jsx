import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [formValues, setFormValues] = useState({
    id: null,
    title: "",
    author: "",
    isbn: "",
    publishYear: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // useEffect hook för att hämta böcker vid komponentens (App i det här fallet) första render
  useEffect(() => {
    fetchBooks();
  }, []);

  // async/await funktion som hämtar böcker från API:et (eller som i mitt fall en json-server)
  const fetchBooks = async () => {
    try {
      let response = await fetch("http://localhost:5000/books");
      let data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Funktion för att hantera ändringar i formulärfälten.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Hantera inskick av formulär (både för uppdatering och lägga till ny bok)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      // Uppdatera befintlig bok
      try {
        await fetch(`http://localhost:5000/books/${formValues.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });
        setBooks(
          books.map((book) => (book.id === formValues.id ? formValues : book))
        );
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating book:", error);
      }
    } else {
      // Lägga till ny bok
      try {
        let response = await fetch("http://localhost:5000/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formValues, id: Date.now() }),
        });
        let newBook = await response.json();
        setBooks([...books, newBook]);
      } catch (error) {
        console.error("Error adding book:", error);
      }
    }

    // Töm formuläret från data
    setFormValues({
      id: null,
      title: "",
      author: "",
      isbn: "",
      publishYear: "",
      language: "",
    });
  };

  // Hantera editering av bok
  const handleEdit = (book) => {
    setFormValues(book);
    setIsEditing(true);
  };

  // Ta bort en bok
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/books/${id}`, {
        method: "DELETE",
      });
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div class="main-container">
      <section class="form-section">
        <h1>Book Manager</h1>
        <form class="form" onSubmit={handleFormSubmit}>
          <h2>{isEditing ? "Update Book" : "Add New Book"}</h2>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            required
          />
          <br />
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formValues.author}
            onChange={handleInputChange}
            required
          />
          <br />
          <label>ISBN</label>
          <input
            type="text"
            name="isbn"
            value={formValues.isbn}
            onChange={handleInputChange}
            required
          />
          <br />
          <label>Publish Year</label>
          <input
            type="number"
            name="publishYear"
            value={formValues.publishYear}
            onChange={handleInputChange}
            required
          />
          <br />
          <label>Language</label>
          <input
            type="text"
            name="language"
            value={formValues.language}
            onChange={handleInputChange}
            required
          />
          <br />
          <button type="submit">
            {isEditing ? "Save Changes" : "Add Book"}
          </button>
        </form>
      </section>

      {/* List of books */}
      <section class="book-list">
        <h2>Book List</h2>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <div>
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>ISBN: {book.isbn}</p>
                <p>Published: {book.publishYear}</p>
                <p>Language: {book.language}</p>
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
