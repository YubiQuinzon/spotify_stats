var genre_dict = {};
ordered_genre_list = []

function cleanGenreList(){
    genre_dict= {}
    ordered_genre_list.length = 0;
    
    merged_genre_list = JSON.parse(localStorage.getItem("complete_genre_list")).concat(JSON.parse(localStorage.getItem("complete_playlist_genre_list")))
    flat_genre_list = merged_genre_list.flat()
    
    flat_genre_list.forEach((genre) => {
        if (genre_dict[genre]){
            genre_dict[genre] += 1;
        }
        else {
            genre_dict[genre] = 1;
        }
    });

    var items = Object.keys(genre_dict).map(
        (key) => { return [key, genre_dict[key]] });
      
    items.sort(
        (first, second) => { return second[1] - first[1] }
    );

    var keys = items.map((e) => {return e[0]});
    
    var counter = 0;
    if (items.length < 9){
        counter = items.length
    }
    else{
        counter = 9
    }
    
    ordered_genre_list = items.slice(0,counter+1);
    ordered_genre_list.sort(
        (first, second) => { return first[1] - second[1] }
      );

    console.log(ordered_genre_list)

    plotBarGraph()
}

function plotBarGraph(){
    var y_list = []
    var x_list = []
    ordered_genre_list.forEach((genre)=>{
        y_list.push(genre[0])
        x_list.push(genre[1])
    })

    var data = [{
        type: 'bar',
        text: x_list.map(String),
        x: x_list,
        y: y_list,
        orientation: 'h',
        textposition: 'auto',
        marker: {
            color: 'rgb(29,185,84)',
            opacity: 1,
          }
    }];

    const config = {
        displayModeBar: false
      };

    var layout = {
        width: 900,
        height: 600,
        yaxis: {
            automargin: 'True',
            autorange: 'True',
        },
        title: {
            text: '<b>TOP GENRE CHART</b> <br> (NUMBERS REPRESENT HOW MANY SONGS OF THAT GENRE WERE SAVED OR LIKED)',
            font:{
                size: 15
            }
        },
        font:{
            family: 'Raleway, sans-serif',
            size: 15,
            color: 'rgb(256,256,256)'
        },
        showlegend: false,
        yaxis: {
            tickson: "boundaries",
          
        },
        xaxis: {
            showticklabels: false
          
        },
        bargap :0.05,
        plot_bgcolor:"black",
        paper_bgcolor:"black",
        margin: {
            l: 125
        }
    };
    
    
    Plotly.newPlot('bar', data,layout, config);

    console.log(x_list, y_list)

    // Changes the explanation bar as well
    var selector = d3.select('#parentbarplot')
    d3.select('#deletethis').remove();
    d3.select('#genrelist').remove();
    selector.append("h1")
        .attr('class', 'explanationchart deletethis col-md-4 col-xs-4 w3-responsive animated animatedFadeInUp fadeInUp text-sm-center')
        .attr('style', 'float: right;')
        .attr('id', 'deletethis')
        .text("TOP LIST")
    
    selector.append("ul")
        .attr('class', 'genrelist col-md-4 col-xs-4 w3-responsive animated animatedFadeInUp fadeInUp text-sm-center')
        .attr('id', 'genrelist')
    
    const list = document.getElementById("genrelist");
    var counter = 0;
    if (ordered_genre_list.length < 9){
        counter = ordered_genre_list.length
    }
    else{
        counter = 9
    }
    for (i=counter; i>-1; i--){
        var string = '<il>' + ordered_genre_list[i][0].toUpperCase() + '</il><br>';
        list.innerHTML += string
    }
}
