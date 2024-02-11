import {useState} from "react";
import styles from './App.module.scss';
import tracks from './mockData';
import Tracklist from "./Components/Tracklist/Tracklist";
import SearchBar from "./Components/SearchBar/SearchBar";
import SearchResults from "./Components/SearchResults/SearchResults";
import Playlist from "./Components/Playlist/Playlist";

function App() {
  const mockData = [...tracks];
  let [searchResults, setSearchResults] = useState([]);
  let [playlist, setPlaylist] = useState([]);

  /*
  When we press the Search button, handleSubmit should filter the mock data(or send the api call to Spotify)
  and update the searchResults state variable with the results from the API call to Spotify.
   */
  const handleSubmit = (e, userInput) => {
    e.preventDefault();
    if (userInput === "") {return;}
    setSearchResults(mockData.filter(track => track.name.toLowerCase().startsWith(userInput.toLowerCase())));
  };

  /*
  handleAdd will be executed when we press the + on the results. It will add the track to the playlist.
  It could also remove the track from the results so that the user won't press it again as it's already in the
  playlist
   */
  const handleAdd = (trackID) => {
    /*
    If the song is already in the playlist, we shouldn't be able to click add and add it again.
     */
    const alreadyInPlayList = playlist.filter(track => track.id === trackID).length > 0;
    if (alreadyInPlayList) return;

    const selectedTrack = searchResults.find(track => track.id === trackID);
    setPlaylist([...playlist, selectedTrack])
  };
  /*
  handleRemove should remove the selected track from the playlist when the - is pressed.
  It could also add back the track to the results list.
   */
  const handleRemove = (trackID) => {
    const updatedPlaylist = playlist.filter(track => track.id !== trackID);
    setPlaylist(updatedPlaylist);
  };


  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.appName}>SpotiList</h1>
      </header>
      <main>
        <section id={styles.search}>
          <p>Search your favorite songs and create playlists</p>
          <SearchBar onHandleSubmit={handleSubmit}/>
        </section>
        {searchResults.length > 0 &&
          <SearchResults>
            <Tracklist
              tracks={searchResults}
              buttonStyle="addButton"
              buttonText="+"
              onButtonClick={handleAdd}
            />
          </SearchResults>
        }
        {playlist.length > 0 &&
          <Playlist>
            <Tracklist
              tracks={playlist}
              buttonStyle="removeButton"
              buttonText="-"
              onButtonClick={handleRemove}/>
          </Playlist>}
      </main>
    </div>
  );
}

export default App;
