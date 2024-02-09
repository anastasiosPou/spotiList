import styles from "./Playlist.module.css";
import {useState} from "react";

function Playlist({children}) {
  const [playlistName, setPlaylistName] = useState("");

  const handlePlaylistNameChange = ({target}) => {
    setPlaylistName(target.value);
  }
  return(
    <section id={styles.playlist}>
      <form id={styles.playlistNameForm}>
        <input id={styles.playlistNameInput} type="text" placeholder="Playlist name..." value={playlistName} onChange={handlePlaylistNameChange}/>
      </form>
      {children}
      <button id={styles.saveBtn}>Save to Spotify</button>
    </section>
  );
}

export default Playlist;