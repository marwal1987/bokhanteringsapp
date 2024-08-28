// Denna fil har endast syftet att lära användaren mer om koden och hur den fungerar.
// Den förutsätter viss grundläggande kunskap om JavaScript datatyper och React-syntax.

import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // State för att hålla böckerna, initialt en tom array
  const [books, setBooks] = useState([]);

  // State för att hålla värden från formuläret (tom från början)
  const [formValues, setFormValues] = useState({
    id: null,
    title: "",
    author: "",
    isbn: "",
    publishYear: "",
  });

  // State för att hålla koll på om vi är i redigeringsläge
  const [isEditing, setIsEditing] = useState(false);

  // useEffect hook för att hämta böcker vid komponentens (App i det här fallet) första render
  useEffect(() => {
    fetchBooks();
  }, []); // Att ha en tom array här, gör att useEffect bara körs en gång när komponenten (App) laddas

  // async/await funktion som hämtar böcker från API:et (eller som i mitt fall en json-server)
  const fetchBooks = async () => {
    try {
      // Gör en GET-förfrågan till API:et för att hämta böcker och spara i response
      let response = await fetch("http://localhost:5000/books");
      // Omvandla svaret/datan i response till JSON-format och placerar den i data variabeln
      let data = await response.json();
      // Spara data i state variabeln 'books'
      setBooks(data);

      // Hantera eventuella fel som kan uppstå under hämtningen
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Funktion för att hantera ändringar i formulärfälten. (e) = event-objekt som skickas till handleInputChange när en användare interagerar med ett formulärfält. Det är ett standardobjekt som innehåller information om det som utlöste eventet, i detta fall ett formulärfält.
  const handleInputChange = (e) => {
    // destrukturering för att extrahera name och value från e.target (e.target representerar det formulärfält som utlöste eventet)
    // name är attributet på formulärfältet som identifierar vilket fält som ändrats (t.ex. "title").
    // value är det nya värdet som användaren har matat in i formulärfältet.
    const { name, value } = e.target;
    setFormValues({
      ...formValues, // kopierar alla tidigare fält och deras värden från formValues-objektet.
      [name]: value, // dynamisk nyckel som uppdaterar det specifika fältet i formValues med det nya värdet. Eftersom name är en variabel kan vi använda den som nyckel i objektet, vilket gör att vi kan uppdatera det rätta fältet baserat på vilket fält i formuläret som ändras.
    });
  };

  // Hantera formulärinskick
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Förhindra att formuläret laddas om när det skickas
    if (isEditing) {
      // Om vi är i redigeringsläge, uppdatera en befintlig bok
      try {
        await fetch(`http://localhost:5000/books/${formValues.id}`, {
          method: "PUT", // HTTP-metod för att uppdatera
          headers: {
            "Content-Type": "application/json", // Anger att vi skickar JSON-data
          },
          body: JSON.stringify(formValues), // Omvandla formValues till JSON
        });
        // Uppdatera listan med böcker med de nya ändringarna
        setBooks(
          books.map((book) => (book.id === formValues.id ? formValues : book))
        );
        setIsEditing(false); // Avaktivera redigeringsläget
      } catch (error) {
        console.error("Error updating book:", error);
      }
    } else {
      // om vi inte är i redigeringsläget:
      // Skapa en bok
      try {
        let response = await fetch("http://localhost:5000/books", {
          method: "POST", // HTTP-metod för att skapa/create
          headers: {
            "Content-Type": "application/json", // Anger att vi skickar JSON-data
          },
          // Omvandla formValues till JSON och lägg till ett unikt id. // performance.now() används här för att skapa ett unikt ID baserat på den exakta tidpunkten då funktionen körs.
          // Detta är ett enkelt sätt att generera ett unikt ID för den nya boken i en liten applikation.
          // I en större applikation eller i produktion är det vanligt att låta servern generera unika ID:n, för att undvika kollisioner.
          body: JSON.stringify({ ...formValues, id: performance.now() }),
        });
        let newBook = await response.json(); // Data:t från response görs om till JSON-format och läggs in i 'newBook' variablen.
        // Lägg till den nya boken i listan med böck
        setBooks([...books, newBook]);
      } catch (error) {
        console.error("Error adding book:", error);
      }
    }

    // Töm/rensa formuläret efter det skickats in
    setFormValues({
      id: null,
      title: "",
      author: "",
      isbn: "",
      publishYear: "",
      language: "",
    });
  };

  // Funktion för att sätta en bok i redigeringsläge
  const handleEdit = (book) => {
    setFormValues(book); // Sätt formValues till bokens värden för redigering
    setIsEditing(true); // Aktivera redigeringsläget
  };

  // Ta bort en bok
  const handleDelete = async (id) => {
    try {
      // Gör en DELETE-förfrågan till API:et för att ta bort boken
      await fetch(`http://localhost:5000/books/${id}`, {
        method: "DELETE",
      });
      // Uppdatera state med en ny array som innehåller alla böcker utom den med det angivna id:t (detaljerad förklaring längre ner dokumentet)
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      // Om något går fel med hämtningen
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

// Djupgående förklaringar:

// useEffect
// useEffect hook används för att hantera bieffekter i React-komponenter.
// I det här fallet används useEffect för att hämta böcker från API:et när komponenten först renderas.
// Den tomma arrayen som andra argument [ ] betyder att useEffect endast körs en gång,
// vilket är efter den första renderingen av komponenten. Det är här vi vill hämta data
// eftersom vi behöver böckerna för att visa dem i gränssnittet. Genom att kalla på
// fetchBooks inuti useEffect säkerställer vi att API-förfrågan görs efter att komponenten har
// monterats, och vi undviker att göra onödiga upprepade anrop till API:t.

// filter() metoden
// Denna metod skapar en ny array med alla element som klarar testet
// som är implementerat av callback-funktionen. Om callback-funktionen returnerar 'true' för ett element, kommer det att inkluderas i den nya arrayen. Om det returnerar false, kommer elementet att uteslutas. Alltså, true = inkludera i nya arrayen, false = uteslut från nya arrayen.

// Detaljerad Genomgång av filter-anropet:
//     books.filter((book) => book.id !== id)
//         books: Detta är arrayen med alla böcker.
//         filter: Metoden används för att skapa en ny array som endast innehåller de böcker vars ID inte matchar det ID som vi vill ta bort.
//         Callback Function: (book) => book.id !== id
//             book: Representerar det aktuella bokobjektet från arrayen 'books' som filter-metoden itererar över.
//             book.id: ID:et för det aktuella bokobjektet.
//             id: Det ID som vi vill ta bort från arrayen.
//             book.id !== id: Det här uttrycket returnerar true om bokobjektets ID inte är lika med det ID vi vill ta bort (kom ihåg true = inkludera i nya arrayen, false = uteslut från nya arrayen.). Om det returnerar true, kommer bokobjektet att behållas i den nya arrayen. Om det returnerar false, kommer bokobjektet att uteslutas.

// Varför !== används
//     book.id !== id betyder att vi letar efter böcker vars ID inte är lika med det specifika ID vi vill ta bort. Om bokens ID inte matchar det ID vi vill ta bort, kommer den att vara kvar i den nya arrayen.
//     ID som matchar (book.id === id) kommer att returnera false från vår callback-funktion och därmed tas bort från arrayen. Det betyder att den boken inte kommer att inkluderas i den nya arrayen.

// Så, i praktiken, är processen "Ta bort" ett element, att skapa en ny array och exkludera det objektet vi vill ta bort, vilket kan kännas lite bakvänt om man tänker på det som att man direkt tar bort ett objekt.
