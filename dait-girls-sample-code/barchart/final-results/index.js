var dataset = []

for(let i = 0; i < 20; i++) {
	dataset[i] = Math.floor(Math.random() * 20 + 1)
}

(function main() {
var get_height = function(d) { return d ; }
var get_x = function(d, i) { return i * (bar_width + bar_interval) + offset_x; }
var get_y = function(d) { return h - d  - offset_y;	}

// Set variable
let w = 500;
let h = 300;
let bar_length = dataset.length;
let offset_x = 40;
let offset_y = 30;
let bar_interval = 5;
let bar_width = (w - offset_x - bar_interval * (bar_length - 1)) / bar_length - 1;
let largest_data = Math.max(...dataset);

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
let yscale = d3.scale.linear()
								.domain([0, 20])
								.range([20 , 0]);

svg.append("g")
			.attr("class", "axis")
			.attr("transform", "translate(" + offset_x + ", " + (h - 20 - offset_y) + ")")
			.call(
					d3.svg.axis()
						.scale(yscale)
						.orient("left")
			)
//// x axis
svg.append("rect")
		.attr("class", "axis_x")
		.attr("width", w - offset_x - 10)
		.attr("height", 1)
		.attr("transform", "translate(" + offset_x + ", " + (h - offset_y) + ")")

// Draw x axis' labels
svg.selectAll("x-axis-label")
	 .data(dataset)
	 .enter()
	   .append("text")
		 .attr("class", "bar-label")
		 .attr("x", function(d, i) {
			 return get_x(d, i) + bar_width / 2;
		 })
		 .attr("y", h - offset_y + 15)
		 .text(function(d, i) {
			 return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"][i];	
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


