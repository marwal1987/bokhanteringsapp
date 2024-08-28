## Grundläggande Bokhanteringsapplikation

### Beskrivning av Uppgift

Bygg en webbapplikation där användaren kan lägga till, ta bort och uppdatera böcker i en lista. Använd Fetch API för att hantera bokinformationen via en mock-server eller `localStorage`. Applikationen använder CRUD-operationer (Create, Read, Update, Delete) för att hantera bokdata.

**Mål:** Öva på att använda Fetch API och CRUD-operationer i React för att hantera data i en webbapplikation.

_Notering:_ I det här projektet använder jag inte separata filer för komponenterna.

### Användning av Appen

**Krav:** Node.js och npm pakethanterare.  
Jag använder `json-server` för att hantera bokdata, vilket är ett smidigt verktyg när man övar på CRUD-operationer med Fetch/async/await.

#### Installera och Starta JSON-servern

_(Ta bort `-g` flaggan om du inte vill installera `json-server` globalt)_

```
npm install -g json-server
json-server db.json --port 5000
```

### Starta Utvecklingsservern

```
npm run dev
```

## Förklaring av kod

Det finns en fil [CommentsAndExplanations(svenska).jsx](<CommentsAndExplanations(svenska).jsx>) som förklarar vad som händer i detalj. Den är avsedd för att öka kunskapen om koden.

## Bygga själv?

Om du vill skriva koden själv från grunden finns en [pseudocode(svenska).txt](<pseudocode(svenska).txt>) fil att utgå ifrån som kan vara till hjälp.

## Struktur

Applikationen består av en huvudkomponent `App` som hanterar:

- **State Management:** Användning av `useState` för att lagra böcker, formulärvärden och redigeringsläge.
- **Data Fetching:** Hämtning av böcker från en mock-server med `fetchBooks` funktionen.
- **Formulärhantering:** Hantering av formulärinput och formulärinskickning med `handleInputChange` och `handleFormSubmit`.
- **CRUD-operationer:** Implementering av Create, Read, Update, Delete funktioner med `handleEdit`, `handleDelete`, och `handleFormSubmit`.

## Teknologier

- **React/Vite:** För att bygga användargränssnittet.
- **json-server:** För att emulera en backend-server.
- **Node.js:** För att köra serverrelaterade skript och hantera npm-paket.
- **CSS:** För styling.

# English instructions

## Basic Book Management Application

### Task Description

Build a web application where users can add, remove, and update books in a list. Use the Fetch API to manage book information through a mock server or `localStorage`. The application uses CRUD operations (Create, Read, Update, Delete) to handle book data.

**Goal:** Practice using the Fetch API and CRUD operations in React to manage data in a web application.

_Note:_ In this project, I do not use separate files for components.

### Using the App

**Requirements:** Node.js and npm package manager.  
I use `json-server` to manage book data, which is a convenient tool for practicing CRUD operations with Fetch/async/await.

#### Install and Start JSON Server

_(Remove the `-g` flag if you do not want to install `json-server` globally)_

```
npm install -g json-server json-server db.json --port 5000
```

### Start the Development Server

```
npm run dev
```

## Want to build it Yourself?

If you want to write the code from scratch, there is a pseudocode file available that can be helpful as a reference. [pseudocode(english).txt](<pseudocode(english).txt>)

## Explanation of Code

There is a file [CommentsAndExplanations(english).jsx](<CommentsAndExplanations(english).jsx>) that explains what happens in detail. This file provides an in-depth overview of the code’s structure and functionality to help you understand each part of the application.

## Structure

The application consists of a main component `App` that handles:

- **State Management:** Using `useState` to manage books, form values, and edit mode.
- **Data Fetching:** Fetching books from a mock server with the `fetchBooks` function.
- **Form Handling:** Handling form input and submission with `handleInputChange` and `handleFormSubmit`.
- **CRUD Operations:** Implementing Create, Read, Update, Delete functionalities with `handleEdit`, `handleDelete`, and `handleFormSubmit`.

## Technologies Used

- **React/Vite:** For building the user interface.
- **json-server:** For emulating a backend server.
- **Node.js:** For running server-related scripts and managing npm packages.
- **CSS:** For styling.
