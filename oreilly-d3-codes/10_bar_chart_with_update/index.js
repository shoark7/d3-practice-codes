var dataset = [];
var dataLength = 20;
var maxValue = 50;


for(let i = 0; i < dataLength; i++ ) {
	dataset[i] = Math.floor(Math.random() * maxValue) + 1;
}
							
var width = 1000;
var height = 500;
var margin = {t: 30, b: 30, l: 50, r: 30};

var svg = d3.select("#my-graph")
							.attr("width", width)
							.attr("height", height);

var yScale = d3.scale.linear()
								.domain([0, maxValue])
								.range([height - margin.b, margin.t])

// ordinal scale for bar chart
var xScale = d3.scale.ordinal()
								.domain(d3.range(dataset.length))
								.rangeRoundBands([margin.l, width - margin.r], 0.02)


// Add bars
svg.selectAll("rect")
	 .data(dataset)
	 .enter()
	 .append("rect")
		.attr({
			x: function(d, i) {
				return xScale(i);
			},
			y: function(d) {
				return yScale(d);
			},
			width: xScale.rangeBand(),
			height: function(d) {
				return height - margin.b - yScale(d);
			}
		})
		.style("fill", function(d) {
			return "rgb(0,0," + (d * 10) +")";
		})



// Add y axis
svg.append("g")
		 .attr("class", "axis")
		 .attr("transform", "translate(" + (margin.l + 5) + ", 0)")
		 .call(
				 d3.svg.axis()
					 .scale(yScale)
					 .orient("left")
					 .ticks(5)
		 );

// Add bar labels
svg.selectAll("bar-label")
		.data(dataset)
		.enter()
		.append("text")
			.attr("class", "bar-labels")
			.style("text-anchor", "middle")
			.attr({
				x: function(d, i) {
					return xScale(i) + xScale.rangeBand() / 2;
				},
				y: function(d) {
					return yScale(d) + 20;
				}
			})
			.text(function(d) { return d; })
			.style("fill", function(d) {
				return d != 1? "white": "black";
			})
	

// Add event listener: When you click on h1, dataset changes.
d3.select("input")
		.on("click", function() {
			for(let i = 0; i < dataLength; i++) {
				dataset[i] = Math.floor(Math.random() * maxValue) + 1;
			}

			svg.selectAll("rect")
					.data(dataset)
					.transition()
					.delay(function(d, i) {
						return i / dataset.length * 1000;
					})
					.duration(500)
					.attr({
						y: function(d) { return yScale(d); },
						height: function(d) { return height - margin.b - yScale(d); }
					})
					.style("fill", function(d) {
						let colorRatio = 255 / maxValue;
						return "rgb(0,0," + (d * colorRatio) +")";
					});

			svg.selectAll(".bar-labels")
					.data(dataset)
					.transition()
					.delay(function(d, i) {
						return i / dataset.length * 1000;
					})
					.duration(500)
					.attr("y", function(d) { return yScale(d) + (d != 1? 20: -10); })
					.text(function(d) { return d; })
					.style("fill", function(d) {
						return d != 1? "white": "black";
					})
		})



