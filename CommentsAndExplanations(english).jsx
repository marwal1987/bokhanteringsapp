// This file is intended to help users learn more about the code and how it works.
// It assumes some basic knowledge of JavaScript data types and React syntax.

import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State to hold books, initially an empty array
  const [books, setBooks] = useState([]);

  // State to hold values from the form (initially empty)
  const [formValues, setFormValues] = useState({
    id: null,
    title: "",
    author: "",
    isbn: "",
    publishYear: "",
    language: "",
  });

  // State to keep track of whether we are in edit mode
  const [isEditing, setIsEditing] = useState(false);

  // useEffect hook to fetch books on the first render of the component (App in this case)
  useEffect(() => {
    fetchBooks();
  }, []); // Having an empty array here ensures that useEffect only runs once when the component (App) loads

  // async/await function that fetches books from the API (or a json-server in my case)
  const fetchBooks = async () => {
    try {
      // Make a GET request to the API to fetch books and save the response
      let response = await fetch("http://localhost:5000/books");
      // Convert the response/data into JSON format and store it in the data variable
      let data = await response.json();
      // Save the data in the state variable 'books'
      setBooks(data);

      // Handle any errors that might occur during fetching
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to handle changes in form fields. (e) = event object that is passed to handleInputChange when a user interacts with a form field. It is a standard object that contains information about what triggered the event, in this case, a form field.
  const handleInputChange = (e) => {
    // Destructure to extract name and value from e.target (e.target represents the form field that triggered the event)
    // name is the attribute of the form field that identifies which field was changed (e.g., "title").
    // value is the new value that the user has entered into the form field.
    const { name, value } = e.target;
    setFormValues({
      ...formValues, // Copies all previous fields and their values from the formValues object.
      [name]: value, // Dynamic key that updates the specific field in formValues with the new value. Since name is a variable, we use it as a key in the object, allowing us to update the correct field based on which field in the form is changing.
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page on submit
    if (isEditing) {
      // If we are in edit mode, update an existing book
      try {
        await fetch(`http://localhost:5000/books/${formValues.id}`, {
          method: "PUT", // HTTP method to update
          headers: {
            "Content-Type": "application/json", // Specifies that we are sending JSON data
          },
          body: JSON.stringify(formValues), // Convert formValues to JSON
        });
        // Update the book list with the new changes
        setBooks(
          books.map((book) => (book.id === formValues.id ? formValues : book))
        );
        setIsEditing(false); // Disable edit mode
      } catch (error) {
        console.error("Error updating book:", error);
      }
    } else {
      // If we are not in edit mode:
      // Create a book
      try {
        let response = await fetch("http://localhost:5000/books", {
          method: "POST", // HTTP method to create
          headers: {
            "Content-Type": "application/json", // Specifies that we are sending JSON data
          },
          // Convert formValues to JSON and add a unique id. // performance.now() is used here to generate a unique ID based on the exact time the function runs.
          // This is a simple way to generate a unique ID for the new book in a small application.
          // In a larger application or in production, it's common to let the server generate unique IDs to avoid collisions.
          body: JSON.stringify({ ...formValues, id: performance.now() }),
        });
        let newBook = await response.json(); // Convert the data from response to JSON format and store it in 'newBook' variable.
        // Add the new book to the list of books
        setBooks([...books, newBook]);
      } catch (error) {
        console.error("Error adding book:", error);
      }
    }

    // Clear the form after submission
    setFormValues({
      id: null,
      title: "",
      author: "",
      isbn: "",
      publishYear: "",
      language: "",
    });
  };

  // Function to set a book in edit mode
  const handleEdit = (book) => {
    setFormValues(book); // Set formValues to the book's values for editing
    setIsEditing(true); // Enable edit mode
  };

  // Delete a book
  const handleDelete = async (id) => {
    try {
      // Make a DELETE request to the API to remove the book
      await fetch(`http://localhost:5000/books/${id}`, {
        method: "DELETE",
      });
      // Update state with a new array that contains all books except the one with the specified id (detailed explanation further down document)
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      // If something goes wrong with the fetch
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

// In-depth explanations:

// useEffect
// The useEffect hook is used to handle side effects in React components.
// In this case, useEffect is used to fetch books from the API when the component first renders.
// The empty array as the second argument [ ] means that useEffect runs only once,
// which is after the initial render of the component. This is where we want to fetch data
// because we need the books to display them in the interface. By calling
// fetchBooks inside useEffect, we ensure that the API request is made after the component has
// mounted, avoiding unnecessary repeated calls to the API.

// filter() method
// This method creates a new array with all elements that pass the test
// implemented by the callback function. If the callback function returns 'true' for an element, it will be included in the new array. If it returns false, the element will be excluded. So, true = include in the new array, false = exclude from the new array.

// Here is a more detailed explanation of what happens:

//     books.filter((book) => book.id !== id)
//         books: This is the array with all books.
//         filter: The method is used to create a new array that only includes the books whose ID does not match the ID we want to remove.
//         Callback Function: (book)
