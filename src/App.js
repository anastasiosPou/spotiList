import styles from './App.module.css';
import tracks from './mockData';
import {useState} from "react";
import Track from "./Components/Track/Track";

function App() {
  const mockData = [...tracks];
  let [userInput, setUserInput] = useState("");
  let [searchResults, setSearchResults] = useState([]);

  const onUserInputChange = ({target}) => {
    setUserInput(target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (userInput === "") {
      return;
    }
    setSearchResults(mockData.filter(track => track.name.toLowerCase().startsWith(userInput.toLowerCase())));
  };

  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.appName}>SpotiList</h1>
      </header>
      <main>
        <section>
          <p>Search your favorite songs and create playlists</p>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Name of the song.." value={userInput} onChange={onUserInputChange}/>
            <button type="submit">Search</button>
          </form>
        </section>
        <section>
          {
            searchResults && searchResults.map(track => <Track {...track} key={track.id}/> )
          }
        </section>
      </main>
    </div>
  );
}

export default App;
