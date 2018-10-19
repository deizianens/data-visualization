// Load data (asynchronously)
d3_queue.queue()
    .defer(d3.csv, "../data/world-happiness-report-2015-kaggle")
    .await(ready);

var paletteScale = d3.scale.linear()
.domain([minValue,maxValue])
.range(["#f0f9e8","#08589e"]); // green

// fill dataset in appropriate format
series.forEach(function(item){ //
    // item example value ["USA", 70]
    var iso = item[0],
            value = item[1];
    dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
});

const map = new Datamap({
    element: document.querySelector('.container'),
    responsive: true,
    fills: { 
        // 7-class GnBu: http://colorbrewer2.org/#type=sequential&scheme=GnBu&n=7
        ULTRA_H:'#08589e',
        HIGH: '#2b8cbe',
        HIGH_M: '#4eb3d3',
        MEDIUM: '#7bccc4',
        LOW_M: '#a8ddb5',
        LOW: '#ccebc5',
        ULTRA_L: '#f0f9e8',
        UNKNOWN: '#d0d0d0',
        defaultFill: '#d0d0d0'
    },
    geographyConfig: {
        borderColor: '#000',
        highlightBorderWidth: 2,
        // don't change color on mouse hover
        highlightFillColor: function(geo) {
            return geo['fillColor'];
        },
        // only change border
        highlightBorderColor: '#B7B7B7'
      
    }
  })