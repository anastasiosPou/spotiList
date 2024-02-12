import styles from "./SearchResults.module.scss";
function SearchResults({children}) {
  return(
    <section id={styles.results}>
      <h2>Results</h2>
      {children}
    </section>
  );
}

export default SearchResults;