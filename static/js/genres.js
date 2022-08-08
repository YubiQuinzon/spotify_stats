var playlist_id_list = []

var complete_genre_list = []
var complete_playlist_genre_list = []

function genreBootup(){
    getSavedTracksGenres()
    getPlaylistIds()
}

function getSavedTracksGenres(){
    let SAVEDTRACKS = 'https://api.spotify.com/v1/me/tracks?'
    SAVEDTRACKS += 'limit=50';
    SAVEDTRACKS += '&offset=0';
    callApi('GET', SAVEDTRACKS, null, handleSavedTracksResponse)
}

function handleSavedTracksResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);

        console.log(data);

        artists_ids = getSavedTracksArtists(data, 50)
        localStorage.setItem("artists_ids", artists_ids);

        console.log(artists_ids)
        
        getGenres(artists_ids, 'tracks')

        var final_answer = JSON.parse(localStorage.getItem("complete_genre_list"))
    }
    else if (this.status == 401){   
        refreshAccessToken();
    }
    else { 
        console.log(this.responseText);
        alert(this.responseText);
    }
}

// Gets playlist IDS
function getPlaylistIds(){
    let PLAYLISTS = 'https://api.spotify.com/v1/me/playlists?'
    PLAYLISTS += 'limit=50';
    PLAYLISTS += '&offset=0';
    callApi('GET', PLAYLISTS, null, handlePlaylistIdsResponse)
}

// if succcessful, grabs playlists ids  
function handlePlaylistIdsResponse(){
    if (this.status == 200){
        var playlist_id_list = []
        var data = JSON.parse(this.responseText);
        console.log(data);

        playlist_items = data.items
        playlist_items.forEach((playlist=>{
            playlist_id_list.push(playlist.id)
        }))
        
        //storing array in localStorage
        localStorage.setItem("playlist_id_list", JSON.stringify(playlist_id_list)); //store colors
        getPlaylistGenres()
    }
    else if (this.status == 401){   
        refreshAccessToken();
    }
    else { 
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function getPlaylistGenres(){
    playlist_id_list = JSON.parse(localStorage.getItem("playlist_id_list"))
    console.log(playlist_id_list)
    playlist_id_list.forEach((playlist => {
        PLAYLISTSGENRE = 'https://api.spotify.com/v1/playlists/' + playlist + '/tracks?';
        PLAYLISTSGENRE += 'fields=items(track)'
        PLAYLISTSGENRE += '&limit=50'
        PLAYLISTSGENRE += '&offset=0'
        callApi('GET', PLAYLISTSGENRE, null, handlePlaylistGenresResponse)
    }))
}

// if succcessful, grabs playlists ids  
function handlePlaylistGenresResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);

        playlist_artists_ids = getSavedTracksArtists(data, 50)
        
        getGenres(playlist_artists_ids, 'playlists')

        var final_answer = JSON.parse(localStorage.getItem("complete_playlist_genre_list"))
    }
    else if (this.status == 401){   
        refreshAccessToken();
    }
    else { 
        console.log(this.responseText);
        alert(this.responseText);
    }
}

// Returns Artist IDs
function getSavedTracksArtists(database){
    var artist_id_list = [];
    items = database['items'];
    items.forEach((track)=>{
        var track_artist = track.track.artists
        if (track_artist.length > 0){
            track_artist.forEach((artist)=>{
                artist_id_list.push(artist.id)
            })
        }
    })
    return(sliceIntoChunks(artist_id_list,50))
};

// Passing list of IDs - returns list of lists of up to 50 genres
function getGenres(artists_ids, param){
    
    if (param == 'tracks'){
            artists_ids.forEach((idlist)=>{
                GENRES = 'https://api.spotify.com/v1/artists?'
                joined_artists_ids = artists_ids.join(",")
                GENRES += "ids=" + idlist
                callApi('GET', GENRES, null, handleSavedGenres)
            })
        }
    if (param == 'playlists'){
        artists_ids.forEach((idlist)=>{
            GENRES = 'https://api.spotify.com/v1/artists?'
            joined_artists_ids = artists_ids.join(",")
            GENRES += "ids=" + idlist
            callApi('GET', GENRES, null, handleSavedPlaylistGenres)
        })
    }
}

// If successful returns genre list
function handleSavedGenres(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        
        getArtistsGenreList(data)
    }
    else if (this.status == 401){   
        refreshAccessToken();
    }
    else { 
        console.log(this.responseText);
        alert(this.responseText);
    }
}

// Retruns complete list of genres
function getArtistsGenreList(database){
    all_artists_list = database['artists'];
    all_artists_list.forEach((genre)=>{
        complete_genre_list.push(genre.genres)
    })

    //storing array in localStorage
    localStorage.setItem("complete_genre_list", JSON.stringify(complete_genre_list)); //store lists
    console.log(complete_genre_list)
}

// If successful returns genre list
function handleSavedPlaylistGenres(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        
        getPlaylistArtistsGenreList(data)
    }
    else if (this.status == 401){   
        refreshAccessToken();
    }
    else { 
        console.log(this.responseText);
        alert(this.responseText);
    }
}

// Retruns complete list of genres
function getPlaylistArtistsGenreList(database){
    all_artists_list = database['artists'];
    all_artists_list.forEach((genre)=>{
        complete_playlist_genre_list.push(genre.genres)
    })

    //storing array in localStorage
    localStorage.setItem("complete_playlist_genre_list", JSON.stringify(complete_playlist_genre_list)); //store lists
    
}

function sliceIntoChunks(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return (res);
}