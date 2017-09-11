var makeRandomPoints;
var drawScatter;
var main;


// Make an array of points.
makeRandomPoints = function(maxValue, length) {
	var dataset = [];

	for(let i = 0; i < length; i++) {
		let newX = Math.floor(Math.random() * (maxValue + 1));
		let newY = Math.floor(Math.random() * (maxValue + 1));
		dataset[i] = [newX, newY];
	}
	dataset.maxValue = maxValue;

	return dataset;
}


// Update dataset of point
function updatePointData(dataset) {
	var length = dataset.length;

	for(let i = 0; i < length; i++) {
		let newX = Math.floor(Math.random() * (dataset.maxValue + 1));
		let newY = Math.floor(Math.random() * (dataset.maxValue + 1));
		dataset[i] = [newX, newY];
	}

	return dataset;
}


// Draw a scatter graph with given dataset and selector
drawScatter = function(dataset, selector) {

	var MARGIN = {top: 30, right: 30, bottom: 50, left: 50};
	var svg = d3.select(selector)
								.attr("width", 1000)
								.attr("height", 500)
									.append("g")
									.attr("transform", "translate(" + MARGIN.left + ", " + MARGIN.top + ")");
	var width = 1000 - MARGIN.left - MARGIN.right;
	var height = 500 - MARGIN.top - MARGIN.bottom;

	// Scale!
	var xScale = d3.scale.linear()
									.domain([0, d3.max(dataset, function(d) { return d[0]; })])
									.range([0, width]);
	var yScale = d3.scale.linear()
									.domain([0, d3.max(dataset, function(d) { return d[1]; })])
									.range([height, 0]);

	// Draw points
	svg.selectAll("point")
			.data(dataset)
			.enter()
			  .append("circle")
				.attr("class", "point")
				.attr({
					"r": "3",
					"cx": function(d) { return xScale(d[0]);	},
					"cy": function(d) { return height - yScale(d[1]); }
				});

	// Draw x, y axis
	svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(0, " + height + ")")
			.call(
					d3.svg.axis()
						.scale(xScale)
						.orient("bottom")
			)

	svg.append("g")
			.attr("class", "axis")
			.call(
					d3.svg.axis()
						.scale(yScale)
						.orient("left")
			);
			
	
	// Add an eventListener: Update data when #update-date is clicked.
	d3.select("#update-data")
			.on("click", function() {
				let newData = updatePointData(dataset);

				svg.selectAll("circle")
						.data(newData)
						.attr({
							"cx": function(d) { return xScale(d[0]);	},
							"cy": function(d) { return height - yScale(d[1]); }
						});
			})	


}

// Template to draw
main = function(maxValue, length, selector) {
	console.log("Drawing has begun");
	var dataset = makeRandomPoints(maxValue, length);
	drawScatter(dataset, selector);
	console.log("Finished without any issues");
}

// Execute a program.
main(100, 30, "#scatter");
