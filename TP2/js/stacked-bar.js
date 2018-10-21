var year = 2016;

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 50, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
/*
 * Scale for bar widths.
 */
var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);
/*
 * Scale for bar heights.
 */
var y = d3.scaleLinear()
    .rangeRound([height, 0]);
/*
 * Scale for fill color of the categorical data (age groups).
 */
var colorScale = d3.scaleOrdinal()
   .range(["#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"]);
var columns,
    numCountries,
	stack,
	layers,
	yGroupMax,
	yStackMax,
    rect;
 
var slicedData;
var index = 0;
/*
 * Create request for CSV-data, and then process the response.
 */
d3.csv("./data/world-happiness-report-" + year + "-kaggle.csv", addTotalsColumn, function(error, data) {
    if (error) throw error;
    // data.sort(function(a, b) { return b.total - a.total; });
    
    columns = ["Economy", "Family", "Health" , "Freedom", "Trust", "Generosity", "Dystopia"];
    // numCountries = data.length;
    numCountries = 20;
    stack = d3.stack().keys(columns);
    slicedData = data.slice(index, index+20);
    // console.log(slicedData);

    ready(slicedData, numCountries, stack);
});

function ready(data, numCountries, stack){
    layers = stack(data).map(function (layer) { return layer.map(function(e, i) {
        return { country: e.data.Country, 
                 x: i,
                 y: e.data[layer.key],
                 contribution: layer.key,
                 total: e.data.Score };
      });
    });
    for (s = 0; s < numCountries; ++s) {
      var y0 = 0;
      for (ag = 0; ag < columns.length; ++ag) {
        var e = layers[ag][s];
        e.y0 = y0;
        y0 += e.y;
      }
    }
    /*
     * Calculate the maximum of the total populations,
     * and the maximum of the age groups.
     */
    yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y }); });
    yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });
    /*
     * Set the domains for the x-, y-axis and categorical color scales.
     */
    x.domain(data.map(function(d) { return d.Country; }));
    y.domain([0, d3.max(data, function(d) { return d.Score; })]).nice();
    colorScale.domain(columns);
    /*
     * Render the bars.
     */
    g.selectAll(".serie")
      .data(layers)
      .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) { return colorScale(d[0].contribution); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.country); })
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0);
    rect = g.selectAll("rect");
    /*
     * Initial animation to gradually "grow" the bars from the x-axis.
     */
    rect.transition()
        .delay(function(d, i) { return i; })
        .attr("y", function(d) { return y(d.y0 + d.y) })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y) });
    /*
     * Add SVG title elements for each age group bar segment.
     */
    rect.append("svg:title")
        .text(function(d) { return d.country+", "+d.contribution+": "+d.y+" (total: "+d.total+")"; });
    /*
     * X-axis set-up.
     * Note that we do not set up the Y-axis, since the bar heights are
     * scaled dynamically.
     */
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    /*
     * Add labels to the axes.
     */
    svg.append("text")
       .attr("class", "axis axis--x")
       .attr("text-anchor", "middle")
       .attr("transform", "translate("+(width/2)+","+(height+60)+")")
       .text("Countries");
    
    svg.append("text")
       .attr("class", "axis axis--y")
       .attr("text-anchor", "middle")
       .attr("transform", "translate(0,"+(height/2)+")rotate(-90)")
       .attr("dy", "20.0")
       .text("Happiness Score"); 
    /*
     * Set up the legend explaning the categories.
     */
    var legend = g.selectAll(".legend")
      .data(columns)
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + (i*20) + ")"; });
    legend.append("rect")
        .attr("x", width - 38)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", colorScale);
    legend.append("text")
        .attr("x", width - 44)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) { return d; });
}

  /*
   * Sort the rows of the CSV response in descending order.
   */
  function addTotalsColumn(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  }
  d3.selectAll("input").on("change", change);
  window.document.getElementById("toggleStacked").focus();
  function change() {
    if (this.value === "grouped") transitionGrouped();
    else transitionStacked();
  }
  /*
   * Reset the domain for the y-axis scaling to maximum of the age group totals,
   * transition the x-axis changes to the bar widths, and then transition the
   * y-axis changes to the bar heights.
   */
  function transitionGrouped() {
    y.domain([0, yGroupMax]);
    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i; })
          .attr("x", function(d) { return x(d.country) + 0.5 + columns.indexOf(d.contribution)*(x.bandwidth()/columns.length); })
          .attr("width", x.bandwidth() / columns.length)
        .transition()
           .attr("y", function(d) { return y(d.y); })
           .attr("height", function(d) { return height - y(d.y); });
  }
  /*
   * Reset the domain for the y-axis scaling to maximum of the population totals,
   * transition the y-axis changes to the bar heights, and then transition the
   * x-axis changes to the bar widths.
   */
  function transitionStacked() {
    y.domain([0, yStackMax]);
    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i; })
          .attr("y", function(d) { return y(d.y0 + d.y); })
          .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
        .transition()
          .attr("x", function(d) { return x(d.country); })
          .attr("width", x.bandwidth());
  }