
var dataset = {};

// Load data (asynchronously)
d3_queue.queue()
    .defer(d3.csv, "./data/world-happiness-report-2015-kaggle.csv")
    .await(ready);

function ready(error, data) {
    if (error) throw error;

    // We need to colorize every country based on "score"
    var paletteScale = function(value){
        if(value > 0 & value <= 3){
            return '#f0f9e8';
        }
        else if(value > 3 & value <=4){
            return '#ccebc5';
        }
        else if(value > 4 & value <=5){
            return '#a8ddb5';
        }
        else if(value > 5 & value <=6){
            return '#7bccc4';
        }
        else if(value > 6 & value <=7){
            return '#4eb3d3';
        }
        else if(value > 7 & value <=8){
            return '#2b8cbe';
        }
        else if(value > 8){
            return '#08589e';
        }
    }

    // // fill dataset in appropriate format
   for(var i = 0; i<data.length; i++){ 
        // item example value ["USA", 70]
        var country = data[i].Country,
            rank = data[i].Rank,
            region = data[i].Region,
            score = data[i].Score,
            economy = data[i].Economy,
            family = data[i].Family,
            health = data[i].Health,
            freedom = data[i].Freedom,
            trust = data[i].Trust,
            generosity = data[i].Generosity,
            dystopia = data[i].Dystopia;

        dataset[country] = { region: region, rank: rank, score: score, economy: economy, family: family, 
            health: health, freedom: freedom, trust:trust, generosity: generosity, dystopia: dystopia, 
            fillColor: paletteScale(score) };
            
    };

    const map = new Datamap({
        element: document.getElementById('container'),
        projection: 'mercator', // big world map
        responsive: true,
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        geographyConfig: {
            borderColor: '#000',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function(data){
                return data['fillColor'] ;
            },
           // only change border
            highlightBorderColor: '#B7B7B7'
            
        }
      })
    // console.log(dataset);
}

console.log(dataset);



