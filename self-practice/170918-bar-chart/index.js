let MAXDATA = 50;
let ALPHABETS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
								 "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"];
let key = function(d) {
	return d.key;
}

let dataset = []
let randomColor = function() {
	r = Math.floor(Math.random() * 246) + 10;
	g = Math.floor(Math.random() * 246) + 10;
	b = Math.floor(Math.random() * 246) + 10;
	return "rgb(" + r + ", " + g + ", " + b + ")";
}

for(let i = 0; i < 20; i++) {
	n = Math.floor(Math.random() * MAXDATA + 1);
	dataset[i] = { key: i, value: n };
}

let MARGIN = {t: 40, r: 30, b: 40, l: 50};
let width = 800 - MARGIN.r - MARGIN.l;
let height = 500 - MARGIN.t - MARGIN.b;

let xScale = d3.scale.ordinal()
								.domain(d3.range(dataset.length))
								.rangeRoundBands([0, width], 0.1);
let yScale = d3.scale.linear()
								.domain([0, MAXDATA])
								.range([height, 0]);

let svg = d3.select("#my-graph")
						.attr("width", width + MARGIN.r + MARGIN.l)
						.attr("height", height + MARGIN.t + MARGIN.b)
					  .append("g")
						.attr("transform", "translate(" + MARGIN.l + ", " + MARGIN.t + ")");
let colors = d3.scale.category20();

// Initially enter bars
color = randomColor();
svg.selectAll("rect")
		.data(dataset, key)
		.enter()
		.append("rect")
			.attr("class", "bar")
			.style("fill", function(d, i) {
				return color;
			})
			.attr({
				x: function(d, i) {
					return xScale(i);	
				},
				y: function(d, i) {
					return yScale(d.value);	
				},
				width: xScale.rangeBand(),
				height: function(d) {
					return height - yScale(d.value);
				}
			});


// Make x axis, y axis
svg.append("g")
		.attr("class", "axis yAxis")
		.call(
			d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.ticks(5)
		)

svg.append("g")
		.attr("class", "axis xAxis")
		.attr("transform", "translate(0," + height + ")")
		.call(
			d3.svg.axis()
				.scale(xScale)
				.orient("bottom")
				.tickFormat(function(d, i) {
					return ALPHABETS[i];
				})
		)
		
