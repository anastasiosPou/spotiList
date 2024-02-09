import Track from "../Track/Track";
import styles from "./Tracklist.module.css";

function Tracklist({tracks}) {

  return(
    <section id={styles.tracklist}>
      {tracks && tracks.map(track => {
        return (
          <section className={styles.tracklistItem} key={track.id}>
            <Track name={track.name} artist={track.artist} album={track.album} />
            <button className={styles.addButton}>＋</button>
          </section>
        );
      })}
    </section>
  );
}

export default Tracklist;