var idCandidate = 8;
var type = 0;
var turn = 0;

// Define map size on screen 
var width = 900,
    height = 900;

var tooltip = d3.select("#squareOne").append("div").attr("class", "tooltip hidden");

var svg = d3.select("#squareOne").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g");

// Align center of Brazil to center of map
var projection = d3.geo.mercator()
  .scale(850)
  .center([-52, -15])
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

// Load data (asynchronously)
d3_queue.queue()
    .defer(d3.json, "./br_states.json")
    .defer(d3.json, "./files/presidente.json")
    .await(ready);

function ready(error, shp, data) {
  if (error) throw error;

  // Extracting polygons and contours
  var states = topojson.feature(shp, shp.objects.estados);
  var states_contour = topojson.mesh(shp, shp.objects.estados);

  var i, j;
  var aux = new Array();
  var totalPerCandidate = new Array(11);
  var totalPerState = new Array(28).fill(0);

    for (var j = 0; j < 11; j++) {
        (function(index) {
            totalPerCandidate[index] = 0;
            for (var i= 0; i < 28; i++) {
                (function(ind) {
                    aux[ind] = parseInt(data[index].value[ind]['num_votes']);
                    totalPerCandidate[index] =  totalPerCandidate[index]+aux[ind];
                    totalPerState[ind] = totalPerState[ind]+aux[ind];  
                })(i);
            }
        })(j);   
    }
    
  // Draw states
   g.selectAll(".estado")
      .data(states.features)
      .enter()
      .append("path") 
	  .attr("class", function(d) {
        switch(d.id) {
            case 'AC':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+0]['num_votes']), totalPerState[0],type);
                break;
            case 'AL':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+1]['num_votes']), totalPerState[1], type);
                break;
            case 'AM':   
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+2]['num_votes']), totalPerState[2], type);
                break;
            case 'AP':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+3]['num_votes']), totalPerState[3], type);
                break;
            case 'BA':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+4]['num_votes']), totalPerState[4], type);
                break;
            case 'CE':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+5]['num_votes']), totalPerState[5], type);
                break;
            case 'DF':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+6]['num_votes']), totalPerState[6], type);
                break;
            case 'ES':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+7]['num_votes']), totalPerState[7], type);
                break;
            case 'GO':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+8]['num_votes']), totalPerState[8], type);             
                break;
            case 'MA':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+9]['num_votes']), totalPerState[9], type);
                break;
            case 'MG':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+10]['num_votes']), totalPerState[10], type);
                break;
            case 'MS':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+11]['num_votes']), totalPerState[11], type);
                break;
            case 'MT':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+12]['num_votes']), totalPerState[12], type);
                break;
            case 'PA':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+13]['num_votes']), totalPerState[13], type);
                break;
            case 'PB':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+14]['num_votes']), totalPerState[14], type);
                break;
            case 'PE':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+15]['num_votes']), totalPerState[15], type);
                break;
            case 'PI':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+16]['num_votes']), totalPerState[16], type);
                break;
            case 'PR':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+17]['num_votes']), totalPerState[17], type);
                break;
            case 'RJ':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+18]['num_votes']), totalPerState[18], type);
                break;
            case 'RN':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+19]['num_votes']), totalPerState[19], type);
                break;
            case 'RO':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+20]['num_votes']), totalPerState[20], type);
                break;
            case 'RR':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+21]['num_votes']), totalPerState[21], type);
                break;
            case 'RS':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+22]['num_votes']), totalPerState[22], type);
                break;
            case 'SC':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+23]['num_votes']), totalPerState[23], type);
                break;
            case 'SE':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+24]['num_votes']), totalPerState[24], type);
                break;
            case 'SP':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+25]['num_votes']), totalPerState[25], type);
                break;
            case 'TO':
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+26]['num_votes']), totalPerState[26], type);
                break;    
            default:
                return selectColor(parseInt(data[idCandidate].value[(turn*28)+27]['num_votes']), totalPerState[27], type);
            }
        })
        .on("mouseover", function(d,i) {
			var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
			var state;
            var votes = [];
            switch(d.id){
                case 'AC':
                    state = "Acre";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+0]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+0]['num_votes'])/totalPerState[0])*100);
                    break;
                case 'AL':
                    state = "Alagoas";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+1]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+1]['num_votes'])/totalPerState[1])*100);
                    break;
                case 'AM':
                    state = "Amazonas";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+2]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+2]['num_votes'])/totalPerState[2])*100);
                    break;
                case 'AP':
                    state = "Amapá";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+3]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+3]['num_votes'])/totalPerState[3])*100);
                    break;
                 case 'BA':
                    state = "Bahia";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+4]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+4]['num_votes'])/totalPerState[4])*100);
                    break;
                case 'CE':
                    state = "Ceará";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+5]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+5]['num_votes'])/totalPerState[5])*100);
                    break;
                case 'DF':
                    state = "Distrito Federal";
                     votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+6]['num_votes']));
                     votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+6]['num_votes'])/totalPerState[6])*100);
                    break;
                case 'ES':
                    state = "Espírito Santo";
                     votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+7]['num_votes']));
                     votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+7]['num_votes'])/totalPerState[7])*100);
                     break;
                case 'GO':
                    state = "Goiás";
                     votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+8]['num_votes']));                    
                     votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+8]['num_votes'])/totalPerState[8])*100);
                    break;
                case 'MA':
                    state = "Maranhão";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+9]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+9]['num_votes'])/totalPerState[9])*100);
                    break;
                case 'MG':
                    state = "Minas Gerais";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+10]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+10]['num_votes'])/totalPerState[10])*100);
                    break;
                case 'MS':
                    state = "Mato Grosso do Sul";
                     votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+11]['num_votes']));
                     votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+11]['num_votes'])/totalPerState[11])*100);
                     break;
                case 'MT':
                    state = "Mato Grosso";
                     votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+12]['num_votes']));
                     votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+12]['num_votes'])/totalPerState[12])*100);
                     break;
                case 'PA':
                    state = "Pará";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+13]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+13]['num_votes'])/totalPerState[13])*100);
                    break;
                case 'PB':
                    state = "Paraíba";
                     votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+14]['num_votes']));
                     votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+14]['num_votes'])/totalPerState[14])*100);
                     break;
                case 'PE':
                    state = "Pernambuco";
                     votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+15]['num_votes']));
                     votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+15]['num_votes'])/totalPerState[15])*100);
                     break;
                case 'PI':
                    state = "Piauí";
                     votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+16]['num_votes']));
                     votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+16]['num_votes'])/totalPerState[16])*100);
                     break;
                case 'PR':
                    state = "Paraná";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+17]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+17]['num_votes'])/totalPerState[17])*100);
                    break;
                 case 'RJ':
                    state = "Rio de Janeiro";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+18]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+18]['num_votes'])/totalPerState[18])*100);
                    break;
                case 'RN':
                    state = "Rio Grande do Norte";
                     votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+19]['num_votes']));
                     votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+19]['num_votes'])/totalPerState[19])*100);
                     break;
                case 'RO':
                    state = "Rondonia";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+20]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+20]['num_votes'])/totalPerState[20])*100);
                    break;
                case 'RR':
                    state = "Roraima";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+21]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+21]['num_votes'])/totalPerState[21])*100);
                    break;
                case 'RS':
                    state = "Rio Grande do Sul";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+22]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+22]['num_votes'])/totalPerState[22])*100);
                    break;
                 case 'SC':
                    state = "Santa Catarina";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+23]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+23]['num_votes'])/totalPerState[23])*100);
                    break;
                case 'SE':
                    state = "Sergipe";
                     votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+24]['num_votes']));
                     votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+24]['num_votes'])/totalPerState[24])*100);
                     break;
                case 'SP':
                    state = "São Paulo";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+25]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+25]['num_votes'])/totalPerState[25])*100);
                    break;
                case 'TO':
                    state = "Tocantins";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+26]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+26]['num_votes'])/totalPerState[26])*100);
                    break;
                default:
                    state = "Estado";
                    votes[0] = formatValue(parseInt(data[idCandidate].value[(turn*28)+27]['num_votes']));
                    votes[1] = formatValue2((parseInt(data[idCandidate].value[(turn*28)+27]['num_votes'])/totalPerState[27])*100);
                }
		    tooltip
                .classed("hidden", false)
                .attr("style", "left:"+(d3.event.pageX - 300)+"px;top:"+(d3.event.pageY - 60)+"px")
                .html("<strong>"+state+"<br/>"+"</strong>"+"<strong>Votos:"+votes[type]+"<br/>"+"</strong>")
                
		})
		.on("mouseout",  function(d,i) {
			tooltip.classed("hidden", true)
		})
		.on("click", function(d){
			
		})
		.attr("d", path);

		//Draw state contour
		g.append("path")
		.datum(states_contour)
		.attr("d", path)
		.attr("class", "state_contour");
     
}

   
function setCandidate(id){
    idCandidate = id;

    d3_queue.queue()
    .defer(d3.json, "./br_states.json")
    .defer(d3.json, "./files/presidente.json")
    .await(ready);
}

function setType(id){
    type = id;
   
    d3_queue.queue()
    .defer(d3.json, "./br_states.json")
    .defer(d3.json, "./files/presidente.json")
    .await(ready);
}

function setTurn(id){
    turn = id;
    var item = document.getElementsByClassName("item-fade")
    
    if(id==1){
        for(var i=0; i<9; i++){
            item[i].classList.add('hidden');
        }
    }
    else{
        for(var i=0; i<9; i++){
            item[i].classList.remove('hidden');
        }
    }
    

    d3_queue.queue()
    .defer(d3.json, "./br_states.json")
    .defer(d3.json, "./files/presidente.json")
    .await(ready);
}


function formatValue(valor) {
    return valor.toLocaleString('pt-BR');
}

function formatValue2(valor) {
    return valor.toFixed(2)+'%';
}

function selectColor(value, v2, type){  
    if(type==0){
        if(value>3000000){      
            return "mapColor3kk";
        }
        else if(value<=3000000 && value>1000000){
            return "mapColor1kk";
        }
        else if(value<=1000000 && value>700000){
            return "mapColor700k";
        }
        else if(value<=700000 && value>500000){
            return "mapColor500k";
        }
        else if(value<=500000 && value>250000){
            return "mapColor250k";
        }
        else if(value<=250000 && value>50000){
            return "mapColor50k";
        }
        else{
            return "mapColor0k";
        }
    } else{
        value = (value/v2)*100;
        if(value>80){
            return "mapColor100";
        }
        else if(value<=80 && value>65){
            return "mapColor80";
        }
        else if(value<=65 && value>50){
            return "mapColor65";
        }
        else if(value>30 && value<=50){
            return "mapColor30";
        }
        else if(value>12.5 && value<=30){
            return "mapColor25";
        }
        else if(value>2 && value<=12.5){
            return "mapColor12";
        }
        else{
            return "mapColor0";
        }
    }
}