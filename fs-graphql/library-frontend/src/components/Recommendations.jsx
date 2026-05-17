import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ME } from "../queries";

const Recommendations = ({ show }) => {
  const userResult = useQuery(ME, {
    skip: !show,
  });

  const favoriteGenre = userResult.data?.me?.favoriteGenre;

  const booksResult = useQuery(ALL_BOOKS, {
    skip: !show || !favoriteGenre,
    variables: { genre: favoriteGenre },
  });

  if (!show) {
    return null;
  }

  if (userResult.loading || booksResult.loading) {
    return <div>loading...</div>;
  }

  if (!userResult.data?.me) {
    return <div>login required</div>;
  }

  const books = booksResult.data?.allBooks ?? [];

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
