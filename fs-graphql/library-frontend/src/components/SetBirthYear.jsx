import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useMutation } from "@apollo/client/react";

const SetBirth = ({ authors }) => {
  const [name, setName] = useState(authors[0]?.name ?? "");
  const [year, setYear] = useState(0);

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const submit = async (event) => {
    event.preventDefault();
    await editAuthor({ variables: { name, setBornTo: year } });
    setName(authors[0]?.name ?? "");
    setYear(0);
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            name
            <select
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            >
              {authors.map((a) => (
                <option value={a.name} key={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            born
            <input
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            ></input>
          </label>
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default SetBirth;
