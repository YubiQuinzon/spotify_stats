var acc_token = localStorage.getItem("access_token");
var ref_token = localStorage.getItem("refresh_token");

var limit_count = 0


USERINFO = 'https://api.spotify.com/v1/me'

function pageBootup(){
    callApi('GET', USERINFO, null, handleUserInformationResponse)
    getTopArtists('medium_term', 50)
    getTopTracks('medium_term', 50);
}

function handleUserInformationResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if (data.id != undefined){
            user_id = data.id;
            localStorage.setItem("user_id", user_id);
            console.log(user_id)
        }
        if (data.images[0].url != undefined){
            user_image = data.images[0].url;
            localStorage.setItem("user_image", user_image);
            console.log(user_image)
        }
        if (data.display_name != undefined){
            user_name = data.display_name;
            localStorage.setItem("user_name", user_name);
            console.log(user_name)
        }
        if (data.email != undefined){
            user_email = data.email;
            localStorage.setItem("user_email", user_email);
            console.log(user_email)
        }
        updateUserInfo();
    }
    else if (this.status == 401){   
        refreshAccessToken();
    }
    else { 
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function refreshAccessToken(){
    let body = 'grant_type=refresh_token';
    body += '&refresh_token=' + ref_token;
    body += '&client_id=' + client_id;
    callAuthorizationApi(body);
}

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + acc_token);
    xhr.send(body);
    xhr.onload = callback;
}

function updateUserInfo(){
    // Selecting the parentdiv 
    var selector = d3.select("#profileinfo")
    d3.select("#profilename").remove(); //removing name if one is already loaded
    d3.select("#profilepicture").remove(); //removing picture if one is already loaded

    selector
        .append("h2")
            .attr("id", "profilename")
            .attr("class", "profilename")
            .text(selectText());
    
    selector
        .append("img")
            .attr("id", "profilepicture")
            .attr("class", "center profilepicture")
            .attr("src", localStorage.getItem("user_image"))
            .attr("width", 100)
            .attr("height", 100)

}
function selectText(){
    if (localStorage.getItem("user_name")){
        return (localStorage.getItem("user_name"))
    }
    else{
        return(localStorage.getItem("user_email"))
    }
}
function getTopArtists(time_range, limit){
    let TOPARTISTS = 'https://api.spotify.com/v1/me/top/artists?'
    TOPARTISTS += 'time_range=' + time_range;
    TOPARTISTS += '&limit=' + limit;
    TOPARTISTS += '&offset=0';
    limit_count = limit;
    callApi('GET', TOPARTISTS, null, handleTopArtistsResponse)
}

function handleTopArtistsResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);

        console.log(data);

        var iterator_count = getIterator(data);

        artist_rank = getRank(iterator_count);
        artist_list = iteratorTopList(data)
        artist_image = iteratorTopImage(data)

        localStorage.setItem("artist_rank", artist_rank);
        localStorage.setItem("artist_list", artist_list);
        localStorage.setItem("artist_image", artist_image);


        console.log(artist_list)
        console.log(artist_image)
        console.log(artist_rank)

        updateArtistsTable()
    }
    else if (this.status == 401){   
        refreshAccessToken();
    }
    else { 
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function getRank(number){
    rank_list = []
    for (i=0; i<number; i++){
            rank_list.push(i+1);
        }
        return(rank_list)
}

function iteratorTopList(database){
    if (database.items[0]['name']!= null){    
        var target_list = [];
        for (i=0; i<limit_count; i++){
            target_list.push(database.items[i]['name']);
        }
        return(target_list)
    }
}

function iteratorTopImage(database){
    if (database.items[0]['images'][0]['url'] != null){    
        var target_list = [];
        for (i=0; i<limit_count; i++){
            target_list.push(database.items[i]['images'][0]['url']);
        }
        return(target_list)
    }
}

function iteratorTopTrackImage(database){
    if (database.items[0]['album']['images'][0]['url'] != null){    
        var target_list = [];
        for (i=0; i<limit_count; i++){
            target_list.push(database.items[i]['album']['images'][0]['url']);
        }
        return(target_list)
    }
}

function iteratorTopTrackArtists(database){
    if (database.items[0]['artists'][0]['name'] != null){    
        var target_list = [];
        for (i=0; i<limit_count; i++){
            target_list.push(database.items[i]['artists'][0]['name']);
        }
        return(target_list)
    }
}

function updateArtistsTable(){
    var selector = d3.select("#tableparentdiv")
    d3.select('#tableStats').remove();
    table = selector.append("table")
        .attr("id","tableStats")
        .attr("class", "w3-table w3-bordered maintable w3-center")
    
    const tables = document.getElementById("tableStats");
    header = tables.innerHTML += '<tr><th>#</th><th>Artist</th></tr>';

    addArtistTableEntry(limit_count, tables);
}

function addArtistTableEntry(count_limit, tables){
    for (i=0; i<count_limit; i++){
        var string = '<tr><td>' + artist_rank[i] + '<img class = "tableimg" src=' + artist_image[i] + '></img></td><td><h4>' + artist_list[i] + '</h4></td></tr>';
        tables.innerHTML += string
    }
}

function getTopTracks(time_range, limit){
    let TOPARTISTS = 'https://api.spotify.com/v1/me/top/tracks?'
    TOPARTISTS += 'time_range=' + time_range;
    TOPARTISTS += '&limit=' + limit;
    TOPARTISTS += '&offset=0';
    limit_count = limit;
    callApi('GET', TOPARTISTS, null, handleTopTracksResponse)
}

function handleTopTracksResponse(){
    if (this.status == 200){
        var data = JSON.parse(this.responseText);

        console.log(data);
        
        var iterator_count = getIterator(data);

        track_rank = getRank(iterator_count);
        track_list = iteratorTopList(data)
        track_image = iteratorTopTrackImage(data)
        track_artist = iteratorTopTrackArtists(data)

        localStorage.setItem("track_rank", track_rank);
        localStorage.setItem("track_list", track_list);
        localStorage.setItem("track_image", track_image);
        localStorage.setItem("track_artist", track_artist);


        console.log(track_rank)
        console.log(track_list)
        console.log(track_image)
        console.log(track_artist)

        updateTrackTable()
    }
    else if (this.status == 401){   
        refreshAccessToken();
    }
    else { 
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function updateTrackTable(){
    var selector = d3.select("#tableparentdiv2")
    d3.select('#tableStats2').remove();
    table = selector.append("table")
        .attr("id","tableStats2")
        .attr("class", "w3-table w3-bordered maintable w3-center")
    
    const tables = document.getElementById("tableStats2");
    header = tables.innerHTML += '<tr><th>#</th><th>Track</th></tr>';

    addTrackTableEntry(limit_count, tables);
}

function addTrackTableEntry(count_limit, tables){
    for (i=0; i<count_limit; i++){
        var string = '<tr><td>' + track_rank[i] + '<img class = "tableimg2" src=' + track_image[i] + '></img></td><td><h4>' + track_list[i] + '</h4><h6>' + track_artist[i] + '</h6></td></tr>';
        tables.innerHTML += string
    }
}

function click4weeks(){
    getTopArtists('short_term', 40)
    getTopTracks('short_term', 40);
}

function click6mon(){
    getTopArtists('medium_term', 50)
    getTopTracks('medium_term', 50);
}

function clickalltime(){
    getTopArtists('long_term', 50)
    getTopTracks('long_term', 50);
}

function getIterator(database){
    var iterator_count = Object.keys(database.items).length;
    console.log(iterator_count);
    limit_count = iterator_count;
    return (iterator_count)
}