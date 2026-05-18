import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";
import { useApolloClient, useSubscription } from "@apollo/client/react";
import { ALL_BOOKS, BOOK_ADDED } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token"),
  );
  const client = useApolloClient();

  const updateBooksCache = (addedBook) => {
    const addToCache = (variables) => {
      client.cache.updateQuery({ query: ALL_BOOKS, variables }, (data) => {
        if (!data || data.allBooks.some((book) => book.id === addedBook.id)) {
          return data;
        }

        return {
          allBooks: data.allBooks.concat(addedBook),
        };
      });
    };

    addToCache();
    addToCache({ genre: null });
    addedBook.genres.forEach((genre) => {
      addToCache({ genre });
    });
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data?.bookAdded;
      if (!addedBook) {
        return;
      }

      window.alert(`new book added: ${addedBook.title}`);
      updateBooksCache(addedBook);
    },
  });

  const onLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const logStatus = token ? (
    <button onClick={onLogout}>logout</button>
  ) : (
    <button onClick={() => setPage("login")}>login</button>
  );

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && (
          <button onClick={() => setPage("recommend")}>recommend</button>
        )}
        {logStatus}
      </div>

      <Authors show={page === "authors"} token={token} />

      <Books show={page === "books"} />

      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />

      <NewBook show={page === "add"} />

      <Recommendations show={page === "recommend"} />
    </div>
  );
};

export default App;
