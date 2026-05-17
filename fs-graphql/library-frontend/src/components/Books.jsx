import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const {
    data: allBooksData,
    loading: allBooksLoading,
    refetch: refetchAllBooks,
  } = useQuery(ALL_BOOKS);
  const {
    data: filteredBooksData,
    loading: filteredBooksLoading,
    refetch: refetchFilteredBooks,
  } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
  });

  useEffect(() => {
    if (props.show) {
      refetchAllBooks();
      refetchFilteredBooks({ genre: selectedGenre });
    }
  }, [props.show, selectedGenre, refetchAllBooks, refetchFilteredBooks]);

  if (!props.show) {
    return null;
  }

  if (allBooksLoading || filteredBooksLoading) {
    return <div>loading...</div>;
  }

  const books = filteredBooksData.allBooks;
  const allBooks = allBooksData.allBooks;

  const uniqueGenres = [...new Set(allBooks.flatMap((b) => b.genres))];

  const selectGenre = (genre) => {
    setSelectedGenre(genre);
    refetchFilteredBooks({ genre });
  };

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && <p>in genre {selectedGenre}</p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Genres</h3>
      {uniqueGenres.map((g) => (
        <button key={g} onClick={() => selectGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => selectGenre(null)}>all genres</button>
    </div>
  );
};

export default Books;
