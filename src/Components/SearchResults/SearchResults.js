import styles from "./SearchResults.module.css";
function SearchResults({children}) {
  return(
    <section id={styles.results}>
      <h2>Results</h2>
      {children}
    </section>
  );
}

export default SearchResults;