var dataset = []

for(let i = 0; i < 5; i++) {
	dataset[i] = Math.floor(Math.random() * 20 + 1);
}

(function main() {

	// Set variable
	let w = 500;
	let h = 300;
	let bar_length = dataset.length;
	let margin = {top: 30, right: 40, bottom: 30, left: 40};
	let bar_interval = 5;
	let bar_width = (w - margin.left - bar_interval * (bar_length - 1)) / bar_length - 1;
	let largest_data = d3.max(dataset);


	// yscale 
	var y_axis_scale = d3.scale.linear()
									.domain([20, 0])
									.range([0, h - margin.bottom - margin.top]);
	var yscale = d3.scale.linear()
									.domain([0, 20])
									.range([0, h - margin.bottom - margin.top]);

	// helper functions
	var get_height = function(d) { return yscale(d)	; }
	var get_x = function(d, i) { return i * (bar_width + bar_interval) + margin.left; }
	var get_y = function(d) { return h - yscale(d)  - margin.bottom;	}


	// Draw bars
	let svg = d3.select("#bar-graph")

	svg.selectAll("rect")
		 .data(dataset)
		 .enter()
			.append("rect")
			.attr("class", "bar")
			.attr("width", bar_width)
			.attr("height", get_height)
			.attr("x", get_x)
			.attr("y", get_y);


	// Draw axes
	//// y axis

	svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(" + margin.left + ", " + (h - yscale(20) - margin.bottom) + ")")
				.call(
						d3.svg.axis()
							.scale(y_axis_scale)
							.orient("left")
				)
	//// x axis
	svg.append("rect")
			.attr("class", "axis_x")
			.attr("width", w - margin.left - 10)
			.attr("height", 1)
			.attr("transform", "translate(" + margin.left + ", " + (h - margin.bottom) + ")")

	// Draw x axis' labels
	svg.selectAll("x-axis-label")
		 .data(dataset)
		 .enter()
			 .append("text")
			 .attr("class", "bar-label")
			 .attr("x", function(d, i) {
				 return get_x(d, i) + bar_width / 2;
			 })
			 .attr("y", h - margin.bottom + 15)
			 .text(function(d, i) {
				 return "ABCDEFGHIJKLMNOPQRSTUV"[i];	
			 })

	// Designate each bar's number right above the bar.
	svg.selectAll("bar-label")
			 .data(dataset)
			 .enter()
				 .append("text")
				 .attr("x", function(d, i) {
					 return get_x(d, i) + bar_width / 2;	 
				 })
				 .attr("y", function(d) {
						return get_y(d) - 5;	 
				 })
				 .attr("class", "bar-label")
				 .text(function(d) {
						return d;
				 })
})
();
