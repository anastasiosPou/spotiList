import logo from './logo.svg';
import styles from './App.module.css';
import tracks from './mockData';

function App() {
  const mockData = [...tracks];
  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.appName}>SpotiList</h1>
      </header>
      <main>
        <section>
          <p>Search your favorite songs and create playlists</p>
          <ul>
            {
              mockData.map(track => {
                return <li>{track.name}</li>
              })
            }
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
