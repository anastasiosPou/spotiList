const clientID = "20beaf5317e34b638fef47a4770a087b";
const redirectURI = "http://localhost:3000";
const scope = "playlist-modify-public";
const authorizationEndpoint = new URL("https://accounts.spotify.com/authorize");
const tokenEndpoint = new URL("https://accounts.spotify.com/api/token");
let accessToken = null;


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

    const hashed = await sha256(codeVerifier);
    return base64encode(hashed);
  },
  requestUserAuthorization: async () => {
    const codeVerifier = Spotify.generateCodeVerifier(128);
    const codeChallenge = await Spotify.generateCodeChallengeFrom(codeVerifier);

    //Save the code verifier in localStorage
    window.localStorage.setItem('code_verifier', codeVerifier);

    const params = {
      response_type: 'code',
      client_id: clientID,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectURI
    };

    authorizationEndpoint.search = new URLSearchParams(params).toString();
    console.log('authorizationEndpoint: ', authorizationEndpoint);
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
    //If we already have the access token, return it
    if (accessToken) return accessToken;

    /*If we don't have the token, then we need to, first,
    * get the authorization code and then proceed with the fetch of the token*/
    let codeAuthorization = Spotify.getCodeAuthorization();

    /*If we don't have the code authorization, we need to request authorization*/
    if (!codeAuthorization) {
      await Spotify.requestUserAuthorization();
      codeAuthorization = Spotify.getCodeAuthorization();
    }

    const codeVerifier = localStorage.getItem('code_verifier');

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

    const body = await fetch(tokenEndpoint, payload);
    const response = await body.json();

    localStorage.setItem('access_token', response['access_token']);
    accessToken = response['access_token'];
  }
};


export default Spotify;