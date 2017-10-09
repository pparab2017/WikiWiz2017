


function ungroupObjects(data) //,svg) not required here
{
	console.log("Un-grouping");
	console.log(data);
	var pages = [];

	var Users = [];
for(var i=0;i<data.length;i++)
{
    var pageEdits = [];
	var eachPage  = data[i].values;
	for(var j=0;j<eachPage.length;j++)
	{
		var eachPagei = eachPage[j].key;
		var all_edits  = eachPage[j].values;
		console.log("--cat--");
		console.log(all_edits);
		 pages.push({"pageName": eachPagei,"userName": data[i].key, "category": all_edits[0].pageCategory });
		 for( var k =0 ;k < all_edits.length ; k++)
		 {

		 	pageEdits.push({"pageName": eachPagei,"userName": data[i].key, "EditTime" : new Date(all_edits[k].revtime), "isReverted": all_edits[k].isReverted});
		 }

	}
    pageEdits.sort(function(x, y){
        return d3.ascending(x.EditTime, y.EditTime);
    });

    var userType = data[i].color == "#000" ? "V" :"B";
    Users.push({"key":data[i].key,"values": pageEdits, "u_Type": userType});
}


console.log(typeof pageEdits[0].EditTime);
var gPages = d3.nest().key(function(d) { return d.pageName; }).entries(pages);
    console.log("did it go?")
    console.log(gPages);

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

			var result = $.grep(eachPage, function(e){ return e.key == gPages[i].key; });
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
		console.log("---------categories----");
		console.log(gPages[i]);
		svdPages.push({"key":gPages[i].key,"categories": gPages[i].values[0].category}); // stoiring the page names
		}



}
var outPut = numeric.svd(svdInput);

var sig = outPut.S;
console.log("<---------SVD Output-------->");
console.log(Users);
console.log(outPut.U);
    console.log(svdPages);
return {"svdOutPut": outPut, "HeatMap":Users, "svdPages" :svdPages };

// commneted as we dont need this here
 // pageScatterPlotNew(outPut.U,svdPages,svg);

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

	//console.log("pages scatter obj");
	//console.log(pageScatterObj);

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
	 		var cat = userPages[j].values[0].pageCategory;
	 		
			if(isMetaPage(page))
			{
				isMata.push({"index": index, "pageTitle": page, "cat" :cat });
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
	 				vfe.push({"index": index, "pageTitle": page,"cat" :cat });
	 				index ++;
	 			}
	 			else if(timeDiff >= (3*60) & timeDiff <= (15*60))
	 			{
	 				fe.push({"index": index, "pageTitle": page ,"cat" :cat});
	 				index ++;
	 			}
	 			else if(timeDiff >= (15*60))
	 			{
	 				se.push({"index": index, "pageTitle": page,"cat" :cat });
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

//console.log(userMatrix);


//var svg = draw(userMatrix); // not the correct results
var cleanObj = ungroupObjects(data);//,svg);
var userMatrix = generateHeatMapData(cleanObj.HeatMap);
var svg = draw(userMatrix);

   // {"svdOutPut": outPut, "HeatMap":Users, "svdPages" :svdPages };

// commneted as we dont need this here
	pageScatterPlotNew(cleanObj.svdOutPut.U,cleanObj.svdPages,svg);

console.log("--User Matrix--");
console.log(userMatrix);

}


function generateHeatMapData(data) {
	console.log("req--------->");
	console.log(data);


    var userMatrix = [];

    var cP = {"pageName": "","userName":"", "EditTime" : "" }; // Current Page
    var pP = {"pageName": "","userName":"", "EditTime" : "" }; // Previous Page


    for (var j = 0; j < data.length; j++) {
        var eachUser = data[j].values;

        console.log("each user bhai");
        console.log(eachUser);
        var userName = data[j].key;

        var singleUser = [];
        var isMata = [];
        var fe = [];
        var vfe = [];
        var se = [];
        var index = 0;

        for (var i = 0; i <eachUser.length; i++)
		{
            cP = eachUser[i];

        if (pP.pageName == "" && isMetaPage(cP.pageName)) {
            isMata.push({"index": index, "pageTitle": cP.pageName, "isReverted":cP.isReverted });
            index++;
        }
        else if (pP.pageName != "" && pP.pageName != cP.pageName && isMetaPage(cP.pageName)) {
            isMata.push({"index": index, "pageTitle": cP.pageName,  "isReverted":cP.isReverted });
            index++;
        }
        else if (pP.pageName == cP.pageName) {
            var curr_edit_time = cP.EditTime.getTime();
            var prev_edit_time = pP.EditTime.getTime();

            var timeDiff = curr_edit_time - prev_edit_time;
            var timeDiff = millisToMinutesAndSeconds(timeDiff);

            if (timeDiff <= (3 * 60)) {
                vfe.push({"index": index, "pageTitle": cP.pageName,  "isReverted":cP.isReverted });
                index++;
            }
            else if (timeDiff >= (3 * 60) & timeDiff <= (15 * 60)) {
                fe.push({"index": index, "pageTitle": cP.pageName,  "isReverted":cP.isReverted });
                index++;
            }
            else if (timeDiff >= (15 * 60)) {
                se.push({"index": index, "pageTitle": cP.pageName,  "isReverted":cP.isReverted });
                index++;
            }
        }
        pP = eachUser[i];


    }
        singleUser.push({"key": "0", "values": isMata}); // meta
        singleUser.push({"key": "1", "values": vfe}); // veryfast
        singleUser.push({"key": "2", "values": fe}); // fast
        singleUser.push({"key": "3", "values": se}); // slow


    userMatrix.push({"key":data[j].key, "name":userName, "values": singleUser, "u_type": data[j].u_Type});
}
    return userMatrix;

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

	console.log("hello--->");
	console.log(data);
const margin = { top: 40, right: 40, bottom: 40, left: 40 },
          width = 1260 - margin.left - margin.right,
          height = 420 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 24),
          legendElementWidth = gridSize*2,
          buckets = 9;	
var each ;
var heatMapStart = height/2 ;


  const svg = d3.select("#heatMap").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
         ;

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	for (var i =0 ; i< data.length; i++)
	{
		var eachUser = data[i].values;
		eachUser.sort(function(x, y){
		return d3.ascending(x.values.length, y.values.length);
		})

		console.log("-------each user here ------->" + data[i].name)
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
//console.log(expensesCount);


        eachUser.sort(function(x, y){
            return d3.ascending(x.key, y.key);
        });

 //heatMapStart = heatMapStart + (20 * i);

var eachWidth = width/maxW;


//heatMap
console.log("testing  the data ------>")
		console.log(data);


var MetaPagesMatrix = g.selectAll("rect.meta" + i)
                       .data(eachUser[0].values)
                       .enter()
                       .append("rect");

var PagesMatrix = g.selectAll("rect.veryFast"+ i)
                       .data(eachUser[1].values)
                       .enter()
                       .append("rect");

var PagesMatrix1 = g.selectAll("rect.fast"+ i)
                       .data(eachUser[2].values)
                       .enter()
                      .append("rect");


var PagesMatrix2 = g.selectAll("rect.slow"+ i)
                       .data(eachUser[3].values)
                       .enter()
                       .append("rect");

var pushAttr = 10;
var RectHeight = 5;

var spaceHeight  = 10;

        var cell = g.append("g");




        var circle = cell.append("circle")
                                 .attr("cx",  5)
                                 .attr("cy",heatMapStart + RectHeight )
                                 .attr("r", 6);


        cell.append("text")
            .attr("x", 1.5)
            .attr("y", heatMapStart + RectHeight + 4)
            .text(data[i].u_type)
            .attr("font-size", "10px")
            .style("fill", "#fff");
		cell.append("title")
            .text(data[i].name);

var MetaAttributes = MetaPagesMatrix
                       .attr("x", function(d){ return (eachWidth * d.index + pushAttr);})
                       .attr("y", heatMapStart)
                       .attr("width", eachWidth)
                       .attr("height", RectHeight)
    					.attr("class", function(d) { return "rect_" + d.pageTitle.replace(/[_\W]+/g, "-"); })
                       .style("fill", "#000");

heatMapStart = heatMapStart+ RectHeight;

var pageAttributes = PagesMatrix
                       .attr("x", function(d){ return (eachWidth * d.index + pushAttr);})
                       .attr("y", heatMapStart)
                       .attr("width", eachWidth)
                       .attr("height", RectHeight)
	                   .attr("class", function(d) { return "rect_" + d.pageTitle.replace(/[_\W]+/g, "-"); })
    .style("fill", function (d) {
        if(d.isReverted == "True")
        {
            return "#F00";
        }
        else
        {
            return "#F6B67F";

        }
    } );
                      // .style("fill", "#F6B67F");

heatMapStart = heatMapStart+ RectHeight;

var pageAttributes1 = PagesMatrix1
                       .attr("x", function(d){ return (eachWidth * d.index + pushAttr);})
                       .attr("y", heatMapStart )
                       .attr("width", eachWidth)
                       .attr("height", RectHeight)
    		.attr("class", function(d) { return "rect_" + d.pageTitle.replace(/[_\W]+/g, "-"); })
                       .style("fill", "#c49165");

heatMapStart = heatMapStart+ RectHeight;

var pageAttributes2 = PagesMatrix2
                       .attr("x", function(d){ return (eachWidth * d.index + pushAttr);})
                       .attr("y", heatMapStart )
                       .attr("width", eachWidth)
                       .attr("height", RectHeight)
    .attr("class", function(d) { return "rect_" +  d.pageTitle.replace(/[_\W]+/g, "-"); })
                       .style("fill", function (d) {
						   if(d.isReverted == "True")
						   {
						   	return "#F00";
						   }
						   else
						   {
						return "#ac7f58";

						   }
                       } );//"#ac7f58"

heatMapStart = heatMapStart+ spaceHeight;



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

    // svg.append("g")
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    return {"svg" :svg, "g":g};


}