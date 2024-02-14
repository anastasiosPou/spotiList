import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App/App';
import reportWebVitals from './reportWebVitals';
import Spotify from "./spotify";

/*If we have a successful connection and authorization with
* the Spotify API then we could proceed with the rendering of the App,
* if not, for the time being we just log the error, but we could
* also create an error template html that would show to the user
* what happened and what the use should do in that case.*/
Spotify.getToken()
  .then(result => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})
  .catch(error => console.log(error));


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
