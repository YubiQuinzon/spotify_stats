var redirect_uri = 'https://yq-spotify-stats.herokuapp.com/'  //'http://127.0.0.1:5500/index.html'

var client_id = 'f0cd086c71734ab287d5bac2266b52cc';
var client_secret = process.env.API_KEY;

const AUTHORIZE = 'https://accounts.spotify.com/authorize'
const TOKEN = 'https://accounts.spotify.com/api/token';

// When page loads, checks url for authorization code.
function onPageLoad(){
    if (window.location.search.length > 0){
        handleRedirect();
    }
}

// If url a query string, retrieves author code, exchanges for tokens.
function handleRedirect(){
    let code = getCode();
    fetchAccessTokens(code);
    window.history.pushState("", "", redirect_uri); //removes param from url
}

function fetchAccessTokens(code){
    let body = 'grant_type=authorization_code';
    body += '&code=' + code;
    body += '&redirect_uri=' + encodeURI(redirect_uri);
    body += '&client_id=' + client_id;
    body += '&client_secret=' + client_secret;
    callAuthorizationApi(body)
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ':' + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if (data.access_token != undefined){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if (data.refresh_token != undefined){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
        swapPage();
    }
    else{
        console.log(this.responseText);
        alert(this.responseText);
        console.log("This happened")
    }
}

function swapPage(){
    let url = 'stats.html';
    window.location.href = url;
}

// checks if there is query string. If so, recieves the value of the 'code' parameter
function getCode(){
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }

    return code;
}

function requestAuthorization(){
    let url = AUTHORIZE;
    url += '?client_id=' + client_id;
    url += '&response_type=code';
    url += '&redirect_uri=' + encodeURI(redirect_uri);
    url += '&show_dialoge=true';
    url += '&scope=user-read-private user-read-email user-top-read playlist-read-private user-library-read'
    window.location.href = url;
}