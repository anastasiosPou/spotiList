import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Components/App/App';
import Spotify from "./spotify";

/*If we have a successful connection and authorization with
* the Spotify API then we could proceed with the rendering of the App,
* if not, for the time being we just log the error, but we could
* also create an error template html that would show to the user
* what happened and what the user should do in that case.*/
try {
  await Spotify.getToken();
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
catch (error) {
    console.error('Error while attempting to retrieve token', error.message);
}