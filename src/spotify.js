const clientID = "20beaf5317e34b638fef47a4770a087b";
const redirectURI = "http://localhost:3000";
const scope = "playlist-modify-public";
const authorizationEndpoint = new URL("https://accounts.spotify.com/authorize");
const tokenEndpoint = new URL("https://accounts.spotify.com/api/token");

/*
* This data structure is useful in encapsulating all the necessary info
* that we need in order to be able to make API request, request refreshed tokens etc.*/
const accessToken = {
  get access_token() {return sessionStorage.getItem('access_token') || null;},
  get refresh_token() {return sessionStorage.getItem('refresh_token') || null;},
  get expires_in() {return sessionStorage.getItem('expires_in') || null;},
  get expires() {return sessionStorage.getItem('expires') || null;},

  save: (response) => {
    const {access_token, refresh_token, expires_in} = response;
    sessionStorage.setItem('access_token', access_token);
    sessionStorage.setItem('refresh_token', refresh_token);
    sessionStorage.setItem('expires_in', expires_in);

    const now = new Date();
    const expiry = String(new Date(now.getTime() + (expires_in * 1000)));
    sessionStorage.setItem('expires', expiry);
  }
};

const Spotify = {
  /*A code verifier is as high-entropy cryptographic random string*/
  generateCodeVerifier: (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  },
  generateCodeChallengeFrom: async (codeVerifier) => {
    /*We need to hash the code verifier  using the SHA256 algorithm*/
    const sha256 = async (plain) => {
      const encoder = new TextEncoder()
      const data = encoder.encode(plain)
      return window.crypto.subtle.digest('SHA-256', data)
    }

    /*We will then return a base64 representation from the hashed code verifier*/
    const base64encode = (input) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }

    try {
      const hashed = await sha256(codeVerifier);
      return base64encode(hashed);
    }
    catch (error) {
      console.error('Error while generating code challenge: ', error.message);
    }
  },
  requestUserAuthorization: async () => {
    const codeVerifier = Spotify.generateCodeVerifier(128);
    const codeChallenge = await Spotify.generateCodeChallengeFrom(codeVerifier);

    //Save the code verifier in sessionStorage
    sessionStorage.setItem('code_verifier', codeVerifier);

    const params = {
      response_type: 'code',
      client_id: clientID,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectURI
    };

    authorizationEndpoint.search = new URLSearchParams(params).toString();
    window.location.href = authorizationEndpoint.toString();
  },
  getCodeAuthorization: () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    // Remove code from URL so we can refresh correctly.
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("code");

    const updatedUrl = currentUrl.search ? currentUrl.href : currentUrl.href.replace('?', '');
    window.history.replaceState({}, document.title, updatedUrl);
    return authorizationCode;
  },
  getToken: async () => {
    /*Before the App component renders, we call getToken.
    * If we have already been authorised by the user,
    * get the codeAuthorization in order to send the request for
    * the access token*/
    let codeAuthorization = Spotify.getCodeAuthorization();

    /*If the code Authorization exists(It won't when we first access the app), request the access token*/
    if (codeAuthorization) {
      await Spotify.requestAccessToken(codeAuthorization);
    }

    /*
    If the token exists, return the token.
    */
    if (accessToken.access_token) {
      return accessToken.access_token;
    }
    /*If the token doesn't exist, it means we first need to
    * request user authorization. Then(if the user gives access), after the redirection,
    * we will have the access token.*/
    else {
      try {
        await Spotify.requestUserAuthorization();
      } catch (error) {
        console.error('Error while requesting user authorization', error.message);
      }
    }

  },
  requestAccessToken: async (codeAuthorization) => {
    const codeVerifier = sessionStorage.getItem('code_verifier');

    const payload = {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({
        client_id: clientID,
        grant_type: 'authorization_code',
        code: codeAuthorization,
        redirect_uri: redirectURI,
        code_verifier: codeVerifier
      })
    };

    try {
      const response = await fetch(tokenEndpoint, payload);
      const jsonData = await response.json();
      accessToken.save(jsonData);
    }
    catch (error) {
      console.error('Error while fetching token: ', error.message);
    }
  },
  search: async (term) => {
    const token = accessToken.access_token;

    if (token) {
      const params = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`, params);
        const data = await response.json();
        const tracks = [...data.tracks.items].map(track => {
          return {
            artist: track.artists[0].name,
            album: {
              name: track.album.name,
              artwork: track.album.images[0].url
            },
            name: track.name,
            id: track.id,
            uri: track.uri
          }
        });

        return tracks;
      }
      catch (error) {
        console.error('Error while fetching songs: ', error.message);
      }
    }
}
};


export default Spotify;