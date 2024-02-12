import styles from "./Playlist.module.scss";

function Playlist({children, playlistName, onPlaylistNameChange, onPlaylistSave}) {
  return(
    <section id={styles.playlist}>
      <form id={styles.playlistNameForm}>
        <input id={styles.playlistNameInput} type="text" placeholder="Playlist name..." value={playlistName} onChange={onPlaylistNameChange}/>
      </form>
      {children}
      <button id={styles.saveBtn} onClick={onPlaylistSave}>Save to Spotify</button>
    </section>
  );
}

export default Playlist;