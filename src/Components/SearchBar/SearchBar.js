import styles from "./SearchBar.module.css";
import {useState} from "react";

function SearchBar({onHandleSubmit}) {
  const [userInput, setUserInput] = useState("");

  const onUserInputChange = ({target}) => {
    setUserInput(target.value);
  };

  return (
    <form onSubmit={(e) => onHandleSubmit(e, userInput)} id={styles.searchForm}>
      <input id={styles.songSearchField} type="text" placeholder="Name of the song.." value={userInput} onChange={onUserInputChange}/>
      <button type="submit" id={styles.submitButton}>Search</button>
    </form>
  );
}

export default SearchBar;