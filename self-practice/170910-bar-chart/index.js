let makeRandomData;
let simpleBarChart;
let main;


makeRandomData = function(length, dataRange) {
 /* Make a random integer data.
	* Error handling is not supported.
  *
  * input:
  *   length: Length of data
  *   dataRange: Min and max value of data
  * return:
  *   A simple array consisting of integer
	*
	* example:
	*   makeRandomData(5, [1, 5]) -> [4,1,3,5,5]
  */
	minValue = dataRange[0];
	maxValue = dataRange[1];
	
	var dataset = []
	for(let i = 0; i < length; i++) {
	  dataset[i] = Math.floor(Math.random() * (maxValue - minValue + 1))  + minValue;
	}

	return dataset;
} 


simpleBarChart = function(dataset, selector) {
 /* Make a simple bar chart
	*
	* input:
	*   dataset: dataset to be drawn
	*   selector: svg css selector
	* return:
	*   none. Just draw a graph on the svg of given selector.
	*/

	svg = d3.select(selector)
		// 상수 All caps
	let margin = { top: 30, right: 20, bottom: 40, left: 35 };
	let width = 500;
	let height = 300;
	let barInterval = 5; let barWidth = (width - margin.left - margin.right - barInterval * (dataset.length - 1)) / dataset.length;

	//let xScale = d3.scale.linear()
									//.domain([0, d3.max(dataset)])
									//.range([margin.left, width - margin.right])
	let yScale = d3.scale.linear()
									.domain([0, 20])
									.range([0, height - margin.top - margin.bottom])
	let yAxisScale = d3.scale.linear()
											.domain([0, 20])
											.range([height - margin.top - margin.bottom, 0])

	// Draw bars
	svg.selectAll("rect")
		 .data(dataset)
		 .enter()
		   .append("rect")
			 .attr("class", "bar")
			 .attr({
				 width: barWidth,
			   height: function(d) { return yScale(d); },
				 x: function(d, i) { return i * (barWidth + barInterval) + margin.left;	 },
			   y:	function(d) { return height - margin.bottom - yScale(d); }
			 })

	// Draw y axis
	svg.append("g")
		   .attr("class", "axis")
			 .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
		   .call(
				  d3.svg.axis()
					  .scale(yAxisScale)
						.orient("left")
		  	)

	// Draw x axis
	svg.append("rect")
			.attr("class", "axis")
			.attr({
				width: width - margin.left - 10,
				height: 1,
				x: margin.left,
				y: height - margin.bottom
			})

	// Add bar labels right below each top of bar
	svg.selectAll("bar-label")
	     .data(dataset)
			 .enter()
			 .append("text")
				 .attr("class", "bar-label")
			   .attr({
						 x: function(d, i) { return i * (barWidth + barInterval) + margin.left + barWidth / 2; },
						 y: function(d) { return height - margin.bottom - yScale(d) + (d > 2? 17: -7); }
				 })
				 .text(function(d) { return d; });

	// Add x axis labels
	svg.selectAll("x-axis-labels")
			.data(dataset)
			.enter()
			.append("text")
				.attr("class", "axis-label")
				.attr({
				  x: function(d, i) { return i * (barWidth + barInterval) + margin.left + barWidth / 2; },
					y: height - margin.bottom + 20
				})
				.text(function(d, i) { return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[i]; })
}


main = function(length, dataRange, chartFunction, selector) {
	var dataset = makeRandomData(length, dataRange);
	chartFunction(dataset, selector);
}


main(15, [1, 20], simpleBarChart, '#my-graph');
