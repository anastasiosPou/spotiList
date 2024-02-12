import Track from "../Track/Track";
import styles from "./Tracklist.module.scss";

function Tracklist({tracks, buttonStyle, onButtonClick, buttonText}) {

  return(
    <section id={styles.tracklist}>
      {tracks && tracks.map(track => {
        return (
          <section className={styles.tracklistItem} key={track.id}>
            <Track name={track.name} artist={track.artist} album={track.album} />
            <button className={styles[buttonStyle]} onClick={() => onButtonClick(track.id)}>{buttonText}</button>
          </section>
        );
      })}
    </section>
  );
}

export default Tracklist;