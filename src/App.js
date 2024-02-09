import {useState} from "react";
import styles from './App.module.css';
import tracks from './mockData';
import Tracklist from "./Components/Tracklist/Tracklist";
import SearchBar from "./Components/SearchBar/SearchBar";

function App() {
  const mockData = [...tracks];
  let [searchResults, setSearchResults] = useState([]);

  /*
  When we press the Search button, handleSubmit should filter the mock data(or send the api call to Spotify)
  and update the searchResults state variable with the results.
   */
  const handleSubmit = (e, userInput) => {
    e.preventDefault();
    if (userInput === "") {return;}
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
          <SearchBar onHandleSubmit={handleSubmit}/>
        </section>
        <section>
          <Tracklist tracks={searchResults} />
        </section>
      </main>
    </div>
  );
}

export default App;
