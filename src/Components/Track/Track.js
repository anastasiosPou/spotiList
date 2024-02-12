import styles from "./Track.module.scss";
function Track({name, artist, album}) {
  return (
    <section className={styles.track}>
      <figure className={styles.artwork}><img src="https://picsum.photos/200" alt="artwork" /></figure>
      <section className={styles.trackInfo}>
        <h2>{name}</h2>
        <p>{artist}</p>
        <p>{album}</p>
      </section>
    </section>
  );
}

export default Track;