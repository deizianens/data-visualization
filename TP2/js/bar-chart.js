var year = 2015;
var countryMapping;
var rank = 0;
var numCountries = 20;
var data_aux;
var aux = 0;

function findCountryContinent(country_name){
    for (var i = 0, len = countryMapping.length; i < len; i++) {
        if (countryMapping[i]["country"] === country_name){
            if(countryMapping[i]["continent"] == "Americas"){
                if(countryMapping[i]["sub_region"] == "Northern America"){
                    return countryMapping[i]["sub_region"];
                }
                else{
                    return countryMapping[i]["continent"];
                }
            } 
            return countryMapping[i]["continent"];
        }
    }
}

function getCountryAlpha2(country_name){
    for (var i = 0, len = countryMapping.length; i < len; i++) {
        if (countryMapping[i]["country"] === country_name)
            return countryMapping[i]["code_2"];
    }
}

// target the single container and include one div for data-viz
const container = d3.select(".container-chart");
// ! all visualization share the same SVG structure (although margin and height values are modified for the second viz, requiring less space)
// ! all viz benegit also from the same tooltip (although including different text values)

const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 100
};

const width = 500 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

const tooltip = container
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

// include in the div tooltip, two paragraphs to detail the information in two lines
tooltip
    .append("p")
    .attr("class", "title");

tooltip
    .append("p")
    .attr("class", "description");

// Load data (asynchronously)
d3_queue
    .queue()
    .defer(
        d3.csv,
        "./data/world-happiness-report-" + year + "-kaggle.csv"
    )
    .defer(
        d3.csv,
        "country-continent.csv"
    )
    .await(ready);

function ready(error, data, c) {
    if (error) throw error;
    // console.log(data);
    countryMapping = c;
    data_aux = data;
    if(rank == 0){
        var cat = new Array(6).fill(0);
        var val = new Array(6).fill(0);
        for(var i = 0; i < data.length; i++){
            if(findCountryContinent(data[i].Country) == "Africa"){
                cat[0] += 1; 
                val[0] += parseInt(data[i].Score); 
            }
            else if(findCountryContinent(data[i].Country) == "Americas"){
                cat[1] += 1; 
                val[1] += parseInt(data[i].Score);
            }
            else if(findCountryContinent(data[i].Country) == "Northern America"){
                cat[2] += 1; 
                val[2] += parseInt(data[i].Score);
            }
            else if(findCountryContinent(data[i].Country) == "Europe"){
                cat[3] += 1; 
                val[3] += parseInt(data[i].Score);
            }
            else if(findCountryContinent(data[i].Country) == "Oceania"){
                cat[4] += 1; 
                val[4] += parseInt(data[i].Score);
            }
            else if(findCountryContinent(data[i].Country) == "Asia"){
                cat[5] += 1; 
                val[5] += parseInt(data[i].Score);
            }
            else {
                console.log("Continent not found! :( "+data[i].Country);
            }
        }
        
        var d = [
            { category: "Africa", value: parseFloat(val[0]/cat[0]).toFixed(2)},
            { category: "América Latina", value: parseFloat(val[1]/cat[1]).toFixed(2)},
            { category: "América do Norte", value: parseFloat(val[2]/cat[2]).toFixed(2)},
            { category: "Europe", value: parseFloat(val[3]/cat[3]).toFixed(2)},
            { category: "Oceania", value: parseFloat(val[4]/cat[4]).toFixed(2)},
            { category: "Asia", value: parseFloat(val[5]/cat[5]).toFixed(2)}
        ];
        // console.log(d);
    }
    else{
        var cat = new Array(Math.abs(numCountries)).fill(0);
        var val = new Array(Math.abs(numCountries)).fill(0); 
        if(numCountries>0){
            for (var i = 0; i<numCountries; i++){
                cat[i] = {category: data[i].Country, value: parseFloat(data[i].Score).toFixed(2)}
            }
        }
        else{
            var j = 0;
            for (var i = (data.length + numCountries); i<data.length; i++){
                cat[j] = {category: data[i].Country, value: parseFloat(data[i].Score).toFixed(2)}
                j++;
            }
        }
        var d = [];
        d = cat;

        console.log(d);
    }
    dataValues = d.sort( (a, b) => b['value'] - a['value'])
    // console.log(val[0]/cat[0]);

    // include a section for the specific visualization
    const licenses = container
        .append("section")
        .attr("id",`bar-chart`);
    
        // SVG
    // include the SVG and nested g element in which to plot the visualization
    const licensesSVG = licenses
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // SCALES
    // define scales based on the data

    // linear scale for the x axis, detailing the data values
    const licensesXScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataValues, (d) => d.value)])
        .range([0, width]);

    // band scale for the y-axis, with one band for data point
    const licensesYScale = d3
        .scaleBand()
        .domain(dataValues.map(dataLicense => dataLicense.category))
        .range([0, height]);


    // AXES
    // reducing the number of horizontal ticks
    const licensesXAxis = d3
        .axisBottom(licensesXScale)
        .ticks(5);

    // removing the ticks for the vertical axis
    const licensesYAxis = d3
        .axisLeft(licensesYScale)
        .tickSize(0)
        .tickPadding(5);

    licensesSVG
        .append("g")
        .attr("class", `axis`)
        .attr("id", `x-axis`)
        .attr("transform", `translate(0, ${height})`)
        .call(licensesXAxis);

    licensesSVG
        .append("g")
        .attr("class", `axis`)
        .attr("id", `y-axis`)
        .call(licensesYAxis);

    // GRID LINES
    // include vertical grid lines with a line element for each horizontal tick
    licensesSVG
        .select("g#x-axis")
        .selectAll("g.tick")
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        // -height as the SVG syntax reasons top to bottom
        .attr("y2", -height)
        .style("opacity", 0.3);

    // FORMAT
    // include a formatting function for the number of licences (to show a comma every third digit)
    const formatThou = d3.format(",");

    // HORIZONTAL BARS
    // append a rect element for each data point
    licensesSVG
        .selectAll("rect")
        .data(dataValues)
        .enter()
        .append("rect")
        // on hover show the tooltip with information regarding the category and the actual number of licenses
        .on("mouseenter", (d, i) => {
            tooltip
                .style("opacity", 1)
                // pageX and pageY allow to target where the cursor lies in a page taller than 100vh
                // slightly offset the position of the tooltip with respect to the cursor
                .style("left", `${d3.event.pageX - 500}px`)
                .style("top", `${d3.event.pageY - 170}px`);
            tooltip
                .select("p.title")
                .text(() => `${d.category}`);
            tooltip
                .select("p.description")
                .text(() => `Score: ${formatThou(d.value)}`);
        })
        .on("mouseout", () => tooltip.style("opacity", 0))
        // include two classes of the hunting category, to style it accordingly
        .attr("class", (d) => (d.category === "hunting") ? "bar accent" : "bar")
        // each rectangle starts from the left and its respective band
        .attr("x", 0)
        // vertically offset by a fourth of the band width as to center the bars (which have half the band width)
        .attr("y", (d) => licensesYScale(d.category) + licensesYScale.bandwidth() / 4)
        // while the height is dicated by half the band width, the width is transitioned to the appropriate value represented by the data value
        .attr("height", licensesYScale.bandwidth() / 2)
        .transition()
        .duration((d, i) => 2000 - 100 * i)
        .delay((d, i) => 900 + 100 * i)
        .attr("width", (d, i) => licensesXScale(d.value));
}

function ready2(error, data){
    var c = document.getElementById("search-input").value;
    console.log(aux);
    if(aux!=1){
        var img = document.getElementById('img-country');
        document.getElementById("flag").removeChild(img);
    }
    data_aux = data;
    for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].Country === c){
            d3.selectAll("#bar-chart").remove();
            var element = document.getElementById("show-country")
            element.classList.remove("hidden");
            rank = i; //keeps country index (bacalhau? rs)
            break;
        }
    }
    if(i == data_aux.length){
        alert("País não encontrado!");
        return;  
    }

    document.getElementById("h1-country").innerHTML = data[rank].Country;
    document.getElementById("p-country").innerHTML = "<strong>Ranking:</strong> " + data[rank].Rank + "<br><strong>Pontuação:</strong> " + data[rank].Score;
    addImg();
    aux = -1;
    
}

function addImg(){
    var img = document.createElement("img");
    img.src = "img/"+getCountryAlpha2(data_aux[rank].Country)+".svg";
    img.setAttribute("id", "img-country");
    document.getElementById("flag").appendChild(img);
}

function setYearSlider(y){
    year = y;
    if(aux == 0){
        d3.selectAll("#bar-chart").remove();
        // Load data (asynchronously)
        d3_queue
        .queue()
        .defer(
            d3.csv,
            "./data/world-happiness-report-" + year + "-kaggle.csv"
        )
        .defer(
            d3.csv,
            "country-continent.csv"
        )
        .await(ready);
    }
    else{
        d3_queue
        .queue()
        .defer(
            d3.csv,
            "./data/world-happiness-report-" + year + "-kaggle.csv"
        )
        .await(ready2);
    }
}

function setRank(r){
    aux = 0;
    rank = r;
    d3.selectAll("#bar-chart").remove();
    var element = document.getElementById("show-country")
    element.classList.add("hidden");
    // Load data (asynchronously)
    d3_queue
    .queue()
    .defer(
        d3.csv,
        "./data/world-happiness-report-" + year + "-kaggle.csv"
    )
    .defer(
        d3.csv,
        "country-continent.csv"
    )
    .await(ready);
}

function setTop(t){
    aux = 0;
    rank = 1;
    numCountries = t;
    var element = document.getElementById("show-country")
    element.classList.add("hidden");
    d3.selectAll("#bar-chart").remove();
    // Load data (asynchronously)
    d3_queue
    .queue()
    .defer(
        d3.csv,
        "./data/world-happiness-report-" + year + "-kaggle.csv"
    )
    .await(ready);
}

function showCountry(){
    aux += 1;
    
    d3_queue
    .queue()
    .defer(
        d3.csv,
        "./data/world-happiness-report-" + year + "-kaggle.csv"
    )
    .await(ready2);
}