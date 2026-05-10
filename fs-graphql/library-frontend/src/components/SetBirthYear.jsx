import { useState } from "react";
import { EDIT_AUTHOR } from "../queries";
import { useMutation } from "@apollo/client/react";

const SetBirth = ({ authors }) => {
  const [name, setName] = useState("");
  const [year, setYear] = useState(0);

  const [editAuthor] = useMutation(EDIT_AUTHOR);

  const submit = (event) => {
    event.preventDefault();
    editAuthor({ variables: { name, born: year } });
    setName("");
    setYear(0);
  };

  return (
    <div>
      <h2>Set Birth Year</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            Name
            <select value={name} onChange={(e) => setName(e.target.value)}>
              {authors.map((a) => (
                <option key={a.id}>{a.name}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Born
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
