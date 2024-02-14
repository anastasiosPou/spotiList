import styles from "./Track.module.scss";
function Track({name, artist, album}) {
  return (
    <section className={styles.track}>
      <figure className={styles.artwork}><img src={album.artwork} alt="artwork" /></figure>
      <section className={styles.trackInfo}>
        <h2>{name}</h2>
        <p>{artist}</p>
        <p>{album.name}</p>
      </section>
    </section>
  );
}

export default Track;