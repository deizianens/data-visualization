const countries = ["Australia", "Switzerland", "Iceland", "Denmark", "Norway", "Canada", "Finland", "Netherlands", "Sweden", "New Zealand", "Israel", "Costa Rica", "Austria", "United States","Brazil", "Ireland"];
// Load data (asynchronously)
d3_queue
    .queue()
    .defer(
        d3.csv,
        "./data/world-happiness-report-2015-kaggle.csv"
    )
    .defer(
        d3.csv,
        "./data/world-happiness-report-2016-kaggle.csv"
    )
    .defer(
        d3.csv,
        "./data/world-happiness-report-2017-kaggle.csv"
    )
    .defer(
        d3.csv,
        "country-continent.csv"
    )
    .await(ready);

function ready(error, data1, data2, data3) {
    if (error) throw error;

    var idx1 = new Array(countries.length);
    var idx2 = new Array(countries.length);
    var idx3 = new Array(countries.length);
    // find country index on array
    for(var i = 0; i<countries.length; i++){
        for(var j = 0; j< data1.length; j++){
            if(data1[j].Country == countries[i]){
                idx1[i] = j;
                break;
            }
        }
    }
    for(var i = 0; i<countries.length; i++){
        for(var j = 0; j< data2.length; j++){
            if(data2[j].Country == countries[i]){
                idx2[i] = j;
                break;
            }
        }
    }
    for(var i = 0; i<countries.length; i++){
        for(var j = 0; j< data3.length; j++){
            if(data3[j].Country == countries[i]){
                idx3[i] = j;
                break;
            }
        }
    }
    console.log(idx2);
    var data = [
        [ //Australia
            { 'x': 2015, 'y': data1[idx1[0]].Rank },
            { 'x': 2016, 'y': data2[idx2[0]].Rank },
            { 'x': 2017, 'y': data3[idx3[0]].Rank }
        ],
        [ //Switzerland
            { 'x': 2015, 'y': data1[idx1[1]].Rank },
            { 'x': 2016, 'y': data2[idx2[1]].Rank },
            { 'x': 2017, 'y': data3[idx3[1]].Rank }
        ],
        [ //Iceland
            { 'x': 2015, 'y': data1[idx1[2]].Rank },
            { 'x': 2016, 'y': data2[idx2[2]].Rank },
            { 'x': 2017, 'y': data3[idx3[2]].Rank }
        ],
        [ //Denmark
            { 'x': 2015, 'y': data1[idx1[3]].Rank },
            { 'x': 2016, 'y': data2[idx2[3]].Rank },
            { 'x': 2017, 'y': data3[idx3[3]].Rank }
        ], //Norway
        [
            { 'x': 2015, 'y': data1[idx1[4]].Rank },
            { 'x': 2016, 'y': data2[idx2[4]].Rank },
            { 'x': 2017, 'y': data3[idx3[4]].Rank }
        ],
        [ //Canada
            { 'x': 2015, 'y': data1[idx1[5]].Rank },
            { 'x': 2016, 'y': data2[idx2[5]].Rank },
            { 'x': 2017, 'y': data3[idx3[5]].Rank }
        ],
        [ //Finland
            { 'x': 2015, 'y': data1[idx1[6]].Rank },
            { 'x': 2016, 'y': data2[idx2[6]].Rank },
            { 'x': 2017, 'y': data3[idx3[6]].Rank }
        ],
        [ //Netherlands
            { 'x': 2015, 'y': data1[idx1[7]].Rank },
            { 'x': 2016, 'y': data2[idx2[7]].Rank },
            { 'x': 2017, 'y': data3[idx3[7]].Rank }
        ],
        [ //Sweden
            { 'x': 2015, 'y': data1[idx1[8]].Rank },
            { 'x': 2016, 'y': data2[idx2[8]].Rank },
            { 'x': 2017, 'y': data3[idx3[8]].Rank }
        ],
        [ //"New Zealand"
            { 'x': 2015, 'y': data1[idx1[9]].Rank },
            { 'x': 2016, 'y': data2[idx2[9]].Rank },
            { 'x': 2017, 'y': data3[idx3[9]].Rank }
        ],
        [ //"Israel"
            { 'x': 2015, 'y': data1[idx1[10]].Rank },
            { 'x': 2016, 'y': data2[idx2[10]].Rank },
            { 'x': 2017, 'y': data3[idx3[10]].Rank }
        ],
        [ //"Costa Rica"
            { 'x': 2015, 'y': data1[idx1[11]].Rank },
            { 'x': 2016, 'y': data2[idx2[11]].Rank },
            { 'x': 2017, 'y': data3[idx3[11]].Rank }
        ],
        [ //"Austria"
            { 'x': 2015, 'y': data1[idx1[12]].Rank },
            { 'x': 2016, 'y': data2[idx2[12]].Rank },
            { 'x': 2017, 'y': data3[idx3[12]].Rank }
        ],
        [ //"United States"
            { 'x': 2015, 'y': data1[idx1[13]].Rank },
            { 'x': 2016, 'y': data2[idx2[13]].Rank },
            { 'x': 2017, 'y': data3[idx3[13]].Rank }
        ],
        [ //"Brazil"
            { 'x': 2015, 'y': data1[idx1[14]].Rank },
            { 'x': 2016, 'y': data2[idx2[14]].Rank },
            { 'x': 2017, 'y': data3[idx3[14]].Rank }
        ],
        [ //Ireland
            { 'x': 2015, 'y': data1[idx1[15]].Rank },
            { 'x': 2016, 'y': data2[idx2[15]].Rank },
            { 'x': 2017, 'y': data3[idx3[15]].Rank }
        ]
    ];
    
    
    var colors = [
        'darkgreen', 
        'goldenrod', 
        'lightcoral', 
        'darkblue',
        'cornflowerblue',
        'mediumpurple', 
        'limegreen', 
        'saddlebrown', 
        'cyan', 
        'olive', 
        'lime',
        'fuchsia',
        'chocolate',
        'red',
        'gold',
        'darkorange'
    ]

    var lineNames = [
        'australia',
        'switzerland',
        'iceland',
        'denmark',
        'norway',
        'canada',
        'finland',
        'netherlands',
        'sweden',
        'new-zealand',
        'israel',
        'costa-rica',
        'austria',
        'usa',
        'brazil',
        'ireland'
    ]

    //************************************************************
    // Create Margins and Axis and hook our zoom function
    //************************************************************
    var margin = { top: 20, right: 30, bottom: 50, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 640 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([2014, 2018])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([20, 1])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(-height)
        .tickPadding(10)
        .tickSubdivide(false)
        .orient("bottom")
        .tickFormat(d3.format("d"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickPadding(10)
        .tickSize(-width)
        .tickSubdivide(true)
        .orient("left");



    //************************************************************
    // Generate our SVG object
    //************************************************************	
    var svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", 50)
        .attr("x", (.5 * width) - 30)
        .text('Ano');

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", (-margin.left) + 10)
        .attr("x", -height + 10)
    //.text('Title drops each season');	

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);


    //************************************************************
    // Create D3 line object and draw data on our SVG object
    //************************************************************
    var line = d3.svg.line()
        .interpolate("linear")
        .x(function (d) { return x(d.x); })
        .y(function (d) { return y(d.y); });

    svg.selectAll('.line')
        .data(data)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("clip-path", "url(#clip)")
        .attr('stroke', function (d, i) {
            return colors[i % colors.length];
        })
        .attr('id', function (d, i) {
            return lineNames[i % lineNames.length];
        })
        .attr("d", line);


    //************************************************************
    // Draw points on SVG object based on the data given
    //************************************************************
    var points = svg.selectAll('.dots')
        .data(data)
        .enter()
        .append("g")
        .attr('class', function (d, i) {
            return ('dots ' + lineNames[i % lineNames.length]);
        })
        .attr("clip-path", "url(#clip)")
        ;

    var point = points.selectAll('.dot')
        .data(function (d, index) {
            var a = [];
            d.forEach(function (point, i) {
                a.push({ 'index': index, 'point': point });
            });
            return a;
        })
        .enter()
        .append('g')
        .attr('class', function (d) {
            return 'dot-group dot' + d.point.x;
        }
        );



    point.append('circle')
        .attr('class', 'dot')
        .attr('r', 4)
        .attr('data-count', function (d) {
            return 'Ano ' + d.point.x + ': ' + d.point.y;
        }
        )
        .attr('fill', function (d, i) {
            return colors[d.index % colors.length];
        })
        .attr("transform", function (d) {
            return 'translate(' + x(d.point.x) + ',' + y(d.point.y) + ')'
        })

        ;

    point
        .append('text')
        .attr('class', 'count')
        .attr('transform', function (d) {
            return 'translate(' + (x(d.point.x) - 3) + ',' + (y(d.point.y) - 12) + ')'
        })
        .text(function (d) {
            //return 'Season ' + d.point.x + ': ' + d.point.y; 
            return d.point.y;
        })
        ;




    $('.key li').click(function () {
        //$(this).toggleClass('active');
        var characterChosen = $(this).attr('class').split(" ")[0];
        var characterLine = $('#' + characterChosen);
        var characterDots = $('.dots.' + characterChosen);
        $('li.' + characterChosen).toggleClass('active');
        characterLine.toggleClass('shown');
        characterDots.toggleClass('shown');

        if ($('li.' + characterChosen).hasClass('active')) {
            var path = document.querySelector('#' + characterChosen);
            var length = path.getTotalLength();
            path.style.transition = path.style.WebkitTransition = 'none';
            path.style.strokeDasharray = length + ' ' + length;
            path.style.strokeDashoffset = length;
            path.getBoundingClientRect();
            path.style.transition = path.style.WebkitTransition =
                'stroke-dashoffset 3s ease-in-out';
            path.style.strokeDashoffset = '0';
        }

    });

    $(function () {
        $('li.brazil, li.australia, li.sweden, li.netherlands, li.switzerland, li.usa').trigger('click');
    });


}

