var year = 2015;
var countryMapping;

/**
 * Loads the countries mapping.
 */
d3.csv("country-continent.csv", function (er, d) {
    countryMapping = d;
});

// target the single container and include one div for data-viz
const container = d3.select(".container-chart");
// ! all visualization share the same SVG structure (although margin and height values are modified for the second viz, requiring less space)
// ! all viz benegit also from the same tooltip (although including different text values)

const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 70
};

const width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
    .await(ready);

function ready(data) {
    var cat = new Array(6).fill(0);
    var val = new Array(6).fill(0);
    for(var i = 0; i < data.length; i++){
        if(findCountryContinent(data[i].Country) == "Africa"){
            cat[0] += 1; 
            val[0] += data[i].Score; 
        }
        else if(findCountryContinent(data[i].Country) == "Americas"){
            cat[1] += 1; 
            val[1] += data[i].Score;
        }
        else if(findCountryContinent(data[i].Country) == "Northern America"){
            cat[2] += 1; 
            val[2] += data[i].Score;
        }
        else if(findCountryContinent(data[i].Country) == "Europe"){
            cat[3] += 1; 
            val[3] += data[i].Score;
        }
        else if(findCountryContinent(data[i].Country) == "Oceania"){
            cat[4] += 1; 
            val[4] += data[i].Score;
        }
        else if(findCountryContinent(data[i].Country) == "Asia"){
            cat[5] += 1; 
            val[5] += data[i].Score;
        }
        else {
            console.log("Continent not found! :(")
        }
    }
    
    const dataLicenses = [
        { category: "Africa", value: parseFloat(val[0]/cat[0]).toFixed(1)},
        { category: "Americas", value: parseFloat(val[1]/cat[1]).toFixed(1)},
        { category: "Northern America", value: parseFloat(val[2]/cat[2]).toFixed(1)},
        { category: "Europe", value: parseFloat(val[3]/cat[3]).toFixed(1)},
        { category: "Oceania", value: parseFloat(val[4]/cat[4]).toFixed(1)},
        { category: "Asia", value: parseFloat(val[5]/cat[5]).toFixed(1)}
    ];

    // include a section for the specific visualization
    const licenses = container
        .append("section");

    // include introductory heading and paragraph
    licenses
        .append("h2")
        .text("Number of licenses");

    licenses
        .append("p")
        .text("Comparison between prevalent sport licenses in 2015 and hunting licenses");

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
        .domain([0, d3.max(dataLicenses, (d) => d.value)])
        .range([0, width]);

    // band scale for the y-axis, with one band for data point
    const licensesYScale = d3
        .scaleBand()
        .domain(dataLicenses.map(dataLicense => dataLicense.category))
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
        .data(dataLicenses)
        .enter()
        .append("rect")
        // on hover show the tooltip with information regarding the category and the actual number of licenses
        .on("mouseenter", (d, i) => {
            tooltip
                .style("opacity", 1)
                // pageX and pageY allow to target where the cursor lies in a page taller than 100vh
                // slightly offset the position of the tooltip with respect to the cursor
                .style("left", `${d3.event.pageX + 10}px`)
                .style("top", `${d3.event.pageY - 10}px`);
            tooltip
                .select("p.title")
                .text(() => `${d.category}`);
            tooltip
                .select("p.description")
                .text(() => `Number of licenses: ${formatThou(d.value)}`);
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



    // VERTICAL BAR CHART
    // include variables which are used in stead of the margin.left, margin bottom and height defined for the other SVG
    // the remainder of the margins and width values are used as-is
    const marginLeftAge = margin.left / 2;
    const marginBottomAge = margin.bottom + 20;
    const heightAge = height / 2;

    // replicate the reasoning applied to the first visualization, inclluding a wrapping section and introductory HTML elements
    const age = container
        .append("section");

    age
        .append("h2")
        .text("Demography");

    age
        .append("p")
        .text("More than half of hunters is 55 or older");

    // include the data referring to the age intervals and percentages
    // strucure the data in an array of objects, similarly to the first viz
    const dataAge = [
        {
            category: '12-24',
            value: 5.136755751
        },
        {
            category: '25 - 34',
            value: 9.855144098
        },
        {
            category: '35 - 44',
            value: 12.86331325
        },
        {
            category: '45 - 54',
            value: 19.03563665
        },
        {
            category: '55 - 64',
            value: 24.2365838
        },
        {
            category: '65 - 74',
            value: 19.08305805
        },
        {
            category: '75 +',
            value: 9.789508398
        }
    ];


    // SVG
    // using the updated values for the left margin and height values
    const ageSVG = age
        .append("svg")
        .attr("viewBox", `0 0 ${width + marginLeftAge + margin.right} ${heightAge + margin.top + marginBottomAge}`)
        .append("g")
        .attr("transform", `translate(${marginLeftAge}, ${margin.top})`);

    // SCALES
    // switching the reasoning applied to the previous viz, as to have the bars drawn vertically

    const ageYScale = d3
        .scaleLinear()
        // domain to go from 0 to 50 (as from 0 to 100 would render miniscule bars)
        .domain([0, 50])
        // range from the height to 0 to complement the top to bottom SVG logic
        .range([heightAge, 0]);

    const ageXScale = d3
        .scaleBand()
        .domain(dataAge.map(dataLicense => dataLicense.category))
        .range([0, width]);

    // AXES
    const ageXAxis = d3
        .axisBottom(ageXScale);

    const ageYAxis = d3
        .axisLeft(ageYScale)
        // reduce the number of ticks
        .ticks(5)
        // format the vertical tick labels to show a percentage (expect for the origin, shown as-is)
        .tickFormat((d) => (d !== 0) ? `${d}%` : `${d}`);

    ageSVG
        .append("g")
        .attr("class", `axis`)
        .attr("id", `x-axis`)
        .attr("transform", `translate(0, ${heightAge})`)
        .call(ageXAxis)
        // select the tick labels and rotate them
        .selectAll("text")
        // move the labels to the left and to the bottom before rotating them (as the rotation hinges in the top left corner)
        .attr("transform", "translate(-10, 10) rotate(-45)");

    ageSVG
        .append("g")
        .attr("id", `y-axis`)
        .attr("class", `axis`)
        .call(ageYAxis);

    // GRID LINES
    // include grid lines, on the basis of horizontal ticks
    ageSVG
        .select("g#y-axis")
        .selectAll("g.tick")
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .style("opacity", 0.3);

    // FORMAT
    // formatting function to have round numbers
    const formatPercent = d3.format("d");

    // VERTICAL BARS
    // append a rect element for each data point
    ageSVG
        .selectAll("rect")
        .data(dataAge)
        .enter()
        .append("rect")
        // on hover show the tooltip with information regarding the category and the actual number of licenses
        .on("mouseenter", (d) => {
            console.log(d3.event);
            tooltip
                .style("opacity", 1)
                .style("left", `${d3.event.pageX + 10}px`)
                .style("top", `${d3.event.pageY - 10}px`);
            tooltip
                .select("p.title")
                .text(() => `Age ${d.category}`);
            tooltip
                .select("p.description")
                .text(() => `${formatPercent(d.value)}% of population`);
        })
        .on("mouseout", () => tooltip.style("opacity", 0))
        // add a class of .bar to all rectangle elements
        .attr("class", "bar")
        // position the rectangle elements alongside the horizontal axis
        .attr("x", (d) => ageXScale(d.category) + ageXScale.bandwidth() / 4)
        .attr("width", ageXScale.bandwidth() / 2)
        // include y and height values pushing the rectangle elements to the bottom of the SVG
        // transition the bars by incresing the height value and moving the y coordinate where the bar would end (as SVG are drawn top to bottom)
        .attr("y", ageYScale(0))
        .attr("height", 0)
        .transition()
        .duration((d, i) => 2000 - 100 * i)
        .delay((d, i) => 1800 + 100 * i)
        .attr("y", (d) => ageYScale(d.value))
        .attr("height", (d) => (heightAge) - ageYScale(d.value));

}

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

