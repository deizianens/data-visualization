var country = "Brazil";
var year = 2015;

// Load data (asynchronously)
d3_queue
    .queue()
    .defer(
        d3.csv,
        "./data/world-happiness-report-" + year + "-kaggle.csv"
    )
    .await(ready);

function ready(error, data) {
    var idx = -1;
    // find country index on array
    for(var i = 0; i<data.length; i++){
        if(data[i].Country == country){
            idx = i;
        }
    }
    // console.log(idx);
    // var pieData = {};
    // var columns = console.log(data[0].Country);
    // var stack = d3.stack().keys(columns);
    // var layers = stack(data).map(function (layer){ return layer.map(function(e, i) {
    //     return { country: e.data.Country,
    //              contribution: layer.key, 
    //              score: e.data.Score,
    //              rank: e.data.Rank,
    //              region: e.data.Region,
    //              color:["#ED254E","#8FF7A7","#FFEF60",'#51BBFE','#25CED1','#4E5379','#B03FC1']               
    //     };
    // });
    // });

    // console.log(layers[1][0]);
    const pieData = [
        { name: "Economia", value: 17, color: '#ED254E'},
        { name: "Família", value: 13, color: '#8FF7A7' },
        { name: "Vida Saudável", value: 30, color: '#FFEF60' },
        { name: "Liberdade", value: 10, color: '#51BBFE' },
        { name: "Confiança", value: 12, color: '#25CED1' },
        { name: "Generosidade", value: 12, color: '#4E5379' },
        { name: "Distopia", value: 6, color: '#B03FC1' },
    ];

    bakeDonut(data[idx]);
    // bakeDonut(pieData);
}

function bakeDonut(d) {
    // var columns = ["Economy", "Family", "Health" , "Freedom", "Trust", "Generosity", "Dystopia"];
    var colors = ["#ED254E","#8FF7A7","#FFEF60",'#51BBFE','#25CED1','#4E5379','#B03FC1'];
    const pieData = [
        { name: "Economia", value: d.Economy, color: '#ED254E'},
        { name: "Família", value: d.Family, color: '#8FF7A7' },
        { name: "Vida Saudável", value: d.Health, color: '#FFEF60' },
        { name: "Liberdade", value: d.Freedom, color: '#51BBFE' },
        { name: "Confiança", value: d.Trust, color: '#25CED1' },
        { name: "Generosidade", value: d.Generosity, color: '#4E5379' },
        { name: "Distopia", value: d.Dystopia, color: '#B03FC1' },
    ];
    // const pieData = [
    //     { name: "Economia", value: (d.Economy*100/d.Score).toFixed(2), color: '#ED254E'},
    //     { name: "Família", value: (d.Family*100/d.Score).toFixed(2), color: '#8FF7A7' },
    //     { name: "Vida Saudável", value: (d.Health*100/d.Score).toFixed(2), color: '#FFEF60' },
    //     { name: "Liberdade", value: (d.Freedom*100/d.Score).toFixed(2), color: '#51BBFE' },
    //     { name: "Confiança", value: (d.Trust*100/d.Score).toFixed(2), color: '#25CED1' },
    //     { name: "Generosidade", value: (d.Generosity*100/d.Score).toFixed(2), color: '#4E5379' },
    //     { name: "Distopia", value: (d.Dystopia*100/d.Score).toFixed(2), color: '#B03FC1' },
    // ];
    // var values = [d.Economy, d.Family, d.Health, d.Freedom, d.Trust, d.Generosity, d.Dystopia];
    // console.log(values);
    let activeSegment;
    const data = pieData.sort( (a, b) => b['value'] - a['value']),
        viewWidth = 600,
        viewHeight = 400,
        svgWidth = viewHeight,
        svgHeight = viewHeight,
        thickness = 60,
        colorArray = data.map(k => k.color),
        // el = d3.select('body'),
        radius = Math.min(svgWidth, svgHeight) / 2,
        color = d3.scaleOrdinal()
            .range(colorArray);

    const max = d3.max(pieData, (maxData) => maxData.value);

    const svg = d3
        .select(".ddonut")
        .append("svg")
        .attr('viewBox', `0 0 ${viewWidth + thickness} ${viewHeight + thickness}`)
        .attr('class', 'pie')
        .attr('width', viewWidth)
        .attr('height', svgHeight);

    // const svg = el.append('svg')
    // .attr('viewBox', `0 0 ${viewWidth + thickness} ${viewHeight + thickness}`)
    // .attr('class', 'pie')
    // .attr('width', viewWidth)
    // .attr('height', svgHeight);

    const g = svg.append('g')
        .attr('transform', `translate( ${(svgWidth / 2) + (thickness / 2)}, ${(svgHeight / 2) + (thickness / 2)})`);

    const arc = d3.arc()
        .innerRadius(radius - thickness)
        .outerRadius(radius);

    const arcHover = d3.arc()
        .innerRadius(radius - (thickness + 5))
        .outerRadius(radius + 8);
    
    var i = 0;
    console.log(data);
    const pie = d3.pie()
        .value(function(pieData) { return pieData.value; })
        .sort(null);


    const path = g.selectAll('path')
        .attr('class', 'data-path')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'data-group')
        .each(function (pathData, i) {
            const group = d3.select(this)

            group.append('text')
                .text(`${pathData.data.value}`)
                .attr('class', 'data-text data-text__value')
                .attr('text-anchor', 'middle')
                .attr('dy', '1rem')

            group.append('text')
                .text(`${pathData.data.name}`)
                .attr('class', 'data-text data-text__name')
                .attr('text-anchor', 'middle')
                .attr('dy', '3.5rem')

            // Set default active segment
            if (pathData.value === max) {
                const textVal = d3.select(this).select('.data-text__value')
                    .classed('data-text--show', true);

                const textName = d3.select(this).select('.data-text__name')
                    .classed('data-text--show', true);
            }

        })
        .append('path')
        .attr('d', arc)
        .attr('fill', (fillData, i) => color(fillData.data.name))
        .attr('class', 'data-path')
        .on('mouseover', function () {
            const _thisPath = this,
                parentNode = _thisPath.parentNode;

            if (_thisPath !== activeSegment) {

                activeSegment = _thisPath;

                const dataTexts = d3.selectAll('.data-text')
                    .classed('data-text--show', false);

                const paths = d3.selectAll('.data-path')
                    .transition()
                    .duration(250)
                    .attr('d', arc);

                d3.select(_thisPath)
                    .transition()
                    .duration(250)
                    .attr('d', arcHover);

                const thisDataValue = d3.select(parentNode).select('.data-text__value')
                    .classed('data-text--show', true);
                const thisDataText = d3.select(parentNode).select('.data-text__name')
                    .classed('data-text--show', true);
            }


        })
        .each(function (v, i) {
            if (v.value === max) {
                const maxArc = d3.select(this)
                    .attr('d', arcHover);
                activeSegment = this;
            }
            this._current = i;
        });

    const legendRectSize = 15;
    const legendSpacing = 10;

    const legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (legendData, i) {
            const itemHeight = legendRectSize + legendSpacing;
            const offset = legendRectSize * color.domain().length;
            const horz = svgWidth + 80;
            const vert = (i * itemHeight) + legendRectSize + (svgHeight - offset) / 2;
            return `translate(${horz}, ${vert})`;
        });

    legend.append('circle')
        .attr('r', legendRectSize / 2)
        .style('fill', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .attr('class', 'legend-text')
        .text((legendData) => legendData)
}
