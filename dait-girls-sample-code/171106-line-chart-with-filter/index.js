function cleanse(data) {
	var parse = d3.timeParse('%Y-%m-%d');

	return data.filter(function(d) {
		return d['Source'] === 'GISTEMP';	
	}).map(function(d) {
		return {
			'Date': parse(d['Date']),
			'Mean': +d['Mean']	
		};	
	}).sort(function(a, b){
		return d3.ascending(a['Date'], b['Date']);	
	});
}


function render(data) {
	var margins = {T: 10, B: 35, L: 35, R: 10};
	var W = window.innerWidth;
	var H = window.innerHeight - 60;

	var x = d3.scaleTime()
					.domain(d3.extent(data, function(d){ return d['Date']; }))
					.range([0, W - margins.L - margins.R]);
	var y = d3.scaleLinear()
					.domain(d3.extent(data, function(d){ return d['Mean']; }))
					.range([H - margins.T - margins.B, 0]);

	var xAxis = d3.axisBottom()
							.ticks(5)
							.scale(x);

	var yAxis = d3.axisLeft()
							.scale(y);

	d3.select('svg')
			.attr('width', W)
			.attr('height', H);

	d3.select('svg .x-axis')
		.style('transform', 'translate(' + margins.L + 'px, ' + (H - margins.B) + 'px)')
		.call(xAxis);

	d3.select('svg .y-axis')
		.style('transform', 'translate(' + margins.L + 'px, ' +  margins.T + 'px)')
		.call(yAxis);

	var line = d3.line()
							.x(function(d) { return x(d['Date']);})
							.y(function(d) { return y(d['Mean']);});
	d3.select('svg .data')
		.style('transform', 'translate(' + margins.L + 'px, ' + margins.T + 'px)')
		.select('path')
		.attr('d', line(data));
}


d3.csv(
		'data.csv', 
		function(err, data) {
			if(err) {
				return;
			}

			var cleanData = cleanse(data);

			render(cleanData);

			d3.select('#go').on('click', function() {
				var yearRange = d3.extent(cleanData, function(d) {
				return d['Date'].getFullYear();
				});	
				var yearFrom = +d3.select('#from').property('value') || yearRange[0];
				var yearTo = +d3.select('#to').property('value') || (yearRange[1] + 1);

				if(yearFrom > yearTo) {
					alert('잘못? ㅇㅇ ㅇㅈ');
					return;
				}

				var filteredData = cleanData.filter(function(d) {
					var year = d['Date'].getFullYear();
					return yearFrom <= year && year < yearTo;	
				});
				render(filteredData);
			});
		}
);
