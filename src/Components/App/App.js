import {useState} from "react";
import styles from './App.module.scss';
import Tracklist from "../Tracklist/Tracklist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../spotify";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");


  /*
  When we press the Search button, handleSubmit should send the api call to Spotify
  and update the searchResults state variable with the tracks from the API call to Spotify.
   */
  const handleSubmit = (e, userInput) => {
    e.preventDefault();
    if (userInput === "") {return;}
    Spotify.search(userInput).then(tracks => {
      setSearchResults([...tracks]);
    });
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

  /* Save the playlist name*/
  const handlePlaylistNameChange = ({target}) => setPlaylistName(target.value);

  /*
  handleSavePlaylist should save the uris of each track in an array for use with the
  API later. It also needs to reset the playlist and the playlist name.
   */
  const handleSavePlaylist = () => {
    const tracks = playlist.map(track => track.uri);
    Spotify.createPlaylist(playlistName, tracks)
      .then(playlistID => {
        console.log('playlist ID: ', playlistID);
          /*
        After we've saved the playlist, we should reset it(playlist name and the tracks)
         */
          setPlaylist([]);
          setPlaylistName("");
      })
      .catch(reason => {
        console.error('An Error occurred while trying to save the playlist: ', reason.message);
      })
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
          <Playlist playlistName={playlistName} onPlaylistNameChange={handlePlaylistNameChange} onPlaylistSave={handleSavePlaylist}>
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
