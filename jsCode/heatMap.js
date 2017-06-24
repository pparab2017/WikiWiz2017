
function ungroupObjects(data)
{
	var pages = [];
for(var i=0;i<data.length;i++)
{
	var eachPage  = data[i].values;
	for(var j=0;j<eachPage.length;j++)
	{
		var eachPagei = eachPage[j].key;
		 pages.push({"pageName": eachPagei,"userName": data[i].key});
	}


}

var gPages = d3.nest().key(function(d) { return d.pageName; }).entries(pages);
console.log("new data");
console.log(gPages);
//d3.scan(array, function(a, b) { return a.foo - b.foo; }); 


//console.log(gPages[0].pageName + "---->");
var svdInput = [];
var svdPages = [];

for (var i =0 ;i< gPages.length;i++)
{



var userRow =[];
var checkForZero = 0;
for(var j=0;j<data.length;j++)
		{
	
		 // added to check if then sum is zero, we dont want such data. // bad data kinda
			var eachPage  = data[j].values;
			
			//console.log(eachPage[0].key);
			//console.log("eachpage");
			//console.log(eachPage);

			var result = $.grep(eachPage, function(e){ return e.key == gPages[i].key; });
			//var t = d3.scan(eachPage, function(a) { return a.key }); 
			if(result.length!= 0) 
			{
				//console.log( result);
				var sum = d3.nest()
						  .rollup(function(v) { return {
						    total: d3.sum(v, function(d) { if (d.isReverted ==  "True") return 1 ; else return 0; })
						  }; })
						  .entries(result[0].values);
				var matVal = (result[0].values.length  -  sum.total);
				userRow.push(matVal);
				checkForZero = checkForZero + matVal;


			}else
			{
				userRow.push(0);
				checkForZero = checkForZero + 0;
			}
			

		}
		if(checkForZero >  0)
		{
		svdInput.push(userRow);
		svdPages.push(gPages[i].key); // stoiring the page names
		}
		//console.log(svdInput);



}


console.log("input --->");
console.log(svdInput);
console.log("input --->112");
console.log(svdPages);
var outPut = numeric.svd(svdInput);
		console.log(outPut);
var sig = outPut.S;


//
//
// var loss= calculateBestLoss(sig);
//
//
//
// console.log(loss.index + "<----index");
//
// var tMs =[];
// for(var i = 0 ; i< sig.length ; i++ )
// {
// var eachRow = [];
// 	for(var j= 0 ; j< sig.length ; j++ )
// 	{
//
// 			if(i==j && !(i > (sig.length - loss.index)))
// 		eachRow.push(sig[i]*-1);
// 			else
// 		eachRow.push(0);
// 	}
// tMs.push(eachRow);
//
//
//
// }
//
// console.log(tMs);
//
//
// var dimRed = numeric.dot(outPut.U,tMs, outPut.V);
// console.log("reduced ---->");
// console.log((7.598936756908212e-26).toFixed(20));
// console.log(dimRed);
//

    pageScatterPlot(outPut.U,svdPages);


//var svdX = svd(X, "full");
//singularvalues = svdX.s;



}

function pageScatterPlot(data,pageNames)
{
 // create objects for the scatter plot here
	var pageScatterObj = [];
	var maxx  = 1000, maxy =1000;
	var minx = 0, miny = 0;
	for(var i=0 ; i< data.length; i++)
	{
		if(minx<data[i][0]) minx = data[i][0];
        if(miny<data[i][0]) miny = data[i][0];
        if(maxx>data[i][0]) maxx = data[i][0];
        if(maxy>data[i][0]) maxy = data[i][0];
		var eachObj = {"x": data[i][0], "y": data[i][1], "name": pageNames[i] }
		pageScatterObj.push(eachObj);
	}

	console.log("pages scatter obj");
	console.log(pageScatterObj);

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;


// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);


    var svg = d3.select("#heatMap").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left+ 10)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size","10")
        .text("U[0]");


    g.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .style("font-size","10")
        .text("U[1]");


    // Scale the range of the data
    x.domain(d3.extent(pageScatterObj, function(d) { return d.x; }));
    y.domain(d3.extent(pageScatterObj, function(d) { return d.y; }));


    // Add the scatterplot
    var circles= g.selectAll("circle")
        .data(pageScatterObj)
        .enter().append("circle")
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
			.style("fill", "#fff")
			.style("stroke", "#f00")
			.on("mousemove", function (d) {
				alert(d.name);
            });
        ;





}


function calculateBestLoss(sig)
{
	for(var i =0 ;i <= sig.length; i++)
	{
		var finalLoss = calculateLoss(sig,i);
		if(finalLoss.loss > 80 & finalLoss.loss < 92)
		{
			return finalLoss;
		}
	}
}

	function calculateLoss(sig, index)
	{

	var originalLoss = 0;
	var newLoss = 0;

	for(var i=0 ;i< sig.length; i++)
	{
	originalLoss = originalLoss + sig[i];
	if(i  != (sig.length - index) )
	newLoss = newLoss + sig[i];
	}

	var loss = (newLoss/originalLoss) * 100;
	return {"loss":loss,"index":index};


	}

function heatMap(data)
{



$("#heatMap").remove();
$("#heatMapContainer").append("<div id='heatMap'>");


console.log("heat map");
console.log(data);
ungroupObjects(data);



var userMatrix  = [];
for(var i=0; i<data.length; i++)
{

	var userPages = data[i].values; 
	var isMata =[];
	var fe = [];
	var vfe = [];
	var se = [];
	var index = 0;



var eachUser  = [];

for(var j =0; j<userPages.length; j++)
	 	{
	 		var pageEdits = userPages[j].values;
	 		var page = userPages[j].key;
	 		
			if(isMetaPage(page))
			{
				isMata.push({"index": index, "pageTitle": page });
				index ++;
			}

	 		for(var k = 0; k<pageEdits.length - 1 ; k++)
	 		{
	 			//console.log(pageEdits);
	 			var curr_edit_time = new Date(pageEdits[k].revtime).getTime();
	 			var next_edit_time = new Date(pageEdits[k+1].revtime).getTime();

	 			var timeDiff = next_edit_time - curr_edit_time;
	 			var timeDiff = millisToMinutesAndSeconds(timeDiff);
	 			
	 			// All pages
	 			
	 			if(timeDiff <= (3*60))
	 			{
	 				vfe.push({"index": index, "pageTitle": page });
	 				index ++;
	 			}
	 			else if(timeDiff >= (3*60) & timeDiff <= (15*60))
	 			{
	 				fe.push({"index": index, "pageTitle": page });
	 				index ++;
	 			}
	 			else if(timeDiff >= (15*60))
	 			{
	 				se.push({"index": index, "pageTitle": page });
	 				index ++;
	 			}


	 		}
	 	}




 	
    eachUser.push({"key": "Meta",  "values": isMata});
    eachUser.push({"key": "veryFast",  "values":vfe});
    eachUser.push({"key": "fast",  "values":fe});
    eachUser.push({"key": "slow",  "values":se});
    

userMatrix.push({"key": data[i].key,"values":eachUser});

}

console.log(userMatrix);


draw(userMatrix);
}

function isMetaPage(page)
{
	

	if(page.toLowerCase().indexOf("talk:") >= 0
	 				| page.toLowerCase().indexOf("user:") >= 0
	 				| page.toLowerCase().indexOf("wikipedia:") >= 0
	 				| page.toLowerCase().indexOf("template:") >= 0
	 				| page.toLowerCase().indexOf("category:") >= 0
	 				| page.toLowerCase().indexOf("command:") >= 0
	 				| page.toLowerCase().indexOf("daft:") >= 0
	 				| page.toLowerCase().indexOf("book:") >= 0
	 				| page.toLowerCase().indexOf("file:") >= 0
	 				)
	 			{

	 				return true;
	 			}
	 			else
	 			{
	 				return false;
	 			}
}






function draw(data)
{

const margin = { top: 10, right: 30, bottom: 10, left: 30 },
          width = 1260 - margin.left - margin.right,
          height = 220 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 24),
          legendElementWidth = gridSize*2,
          buckets = 9;	
var each ;
var heatMapStart = 0 ;


  const svg = d3.select("#heatMap").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	for (var i =0 ; i< data.length; i++)
	{
		var eachUser = data[i].values;
		eachUser.sort(function(x, y){
		return d3.ascending(x.values.length, y.values.length);
		})
		console.log(eachUser);
		each = eachUser;
	

var expensesCount = d3.nest()
  .rollup(function(d) {
                    return {
                        count: d3.sum(d, function(e) { return e.values.length; }),
                        
                    };
                }).entries(each);

var maxW = expensesCount.count;
//maxW = 250
console.log(expensesCount);




 //heatMapStart = heatMapStart + (20 * i);

var eachWidth = width/maxW;


//heatMap


var MetaPagesMatrix = svg.selectAll("rect.meta" + i)
                       .data(each[3].values)
                       .enter()
                      .append("rect");

var PagesMatrix = svg.selectAll("rect.pages1"+ i)
                       .data(each[0].values)
                       .enter()
                      .append("rect");

var PagesMatrix1 = svg.selectAll("rect.pages2"+ i)
                       .data(each[1].values)
                       .enter()
                      .append("rect");


var PagesMatrix2 = svg.selectAll("rect.pages"+ i)
                       .data(each[2].values)
                       .enter()
                      .append("rect");

var MetaAttributes = MetaPagesMatrix
                       .attr("x", function(d){ return (eachWidth * d.index);})
                       .attr("y", heatMapStart)
                       .attr("width", eachWidth)
                       .attr("height", 5)
                       .style("fill", "green");

heatMapStart = heatMapStart+ 5;

var pageAttributes = PagesMatrix2
                       .attr("x", function(d){ return (eachWidth * d.index);})
                       .attr("y", heatMapStart)
                       .attr("width", eachWidth)
                       .attr("height", 5)
                       .style("fill", "red");

heatMapStart = heatMapStart+ 5;

var pageAttributes1 = PagesMatrix1
                       .attr("x", function(d){ return (eachWidth * d.index);})
                       .attr("y", heatMapStart )
                       .attr("width", eachWidth)
                       .attr("height", 5)
                       .style("fill", "red");

heatMapStart = heatMapStart+ 5;

var pageAttributes2 = PagesMatrix
                       .attr("x", function(d){ return (eachWidth * d.index);})
                       .attr("y", heatMapStart )
                       .attr("width", eachWidth)
                       .attr("height", 5)
                       .style("fill", "red");

heatMapStart = heatMapStart+ 10;
}

// for(var j = 0 ; j< 4 ; j++)
// {
// 	var ca = 5 *j;
// for(var i = 0 ; i< maxW ; i++)
// {
// 	svg.append("rect")
//             .attr("x", 1 + (eachWidth *i))
//             .attr("y", heatMapStart + (ca))
//             .attr("width", eachWidth)
//             .attr("height", 5 )
//             .style("stroke", "#ddd")
//             .style("fill", "none");
// }

// }





}