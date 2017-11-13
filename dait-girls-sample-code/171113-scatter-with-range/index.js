function cleanseData(data, targetYear) {
	// original dataset
	// {
	// country: "Albania",
	// rank: "38",
	// score: "0.6613",
	// type: "economic",
	// year: "2006",
	// }

	var cleanData = data.map(function(d) {
		return {
			'country': d['country'],
			'score': +d['score'],
			'rank': +d['rank'],
			'year': +d['year'],
			'type': d['type']
		};
	}).filter(function(d) {
		return d['year'] === targetYear;
	});

	return d3.nest()
					.key(function(d) {
						return d['country'];  // country 중심으로 헤쳐모여!
					})
					.entries(cleanData)
					.map(function(d) {
						var newData = {
							country: d['key'],
							year: d['values'][0]['year'],	
						};	
						for(var i = 0; i < d['values'].length; i++) {
							var type = d['values'][i]['type'];
							var score = d['values'][i]['score'];
							newData[type] = score;
						};
						return newData;
					});

	// After cleansing
	// {
	// country:  "Albania",
	// economic:  0.668,
	// education:  0.986,
	// health:  0.947,
	// overall:  0.7036,
	// political:  0.214,
	// year:  2016,
	// }
}


function render(data, targetYear) {
	d3.select('#currentYear').text(targetYear);
	var W = 150;
	var H = 150;
	var T = 10, L = 30, R = 10, B = 30;
	var x = d3.scaleLinear()
		.domain([0, 1])
		.range([0, W - R - L]);
	var y = d3.scaleLinear()
		.domain([0, 1])
		.range([H - T - B, 0]);
	var xAxis = d3.axisBottom()
		.scale(x)
		.ticks(3);
	var yAxis = d3.axisLeft()
		.scale(y)
		.ticks(3);

	d3.select('.x-axis')
		.style('transform', 'translate(' + L + 'px, ' + (H - B) + 'px)')
		.call(xAxis);

	d3.select('.y-axis')
		.style('transform', 'translate(' + L + 'px, ' + T + 'px)')
		.call(yAxis);

	var dots = d3.select('.dots')
			.style('transform', 'translate(' + L + 'px, ' + T + 'px)')
			.selectAll('circle')
			.data(data, function(d) {
				return d['country'];	
			});  // data 메소드에 두 번째 인자함수는 요소 충돌을 막는다.

	dots.enter()
		.append('circle')
			.attr('cx', 0)
			.attr('cy', H - B)
			.merge(dots)
			.transition()
			.duration(500)
			.attr('r', function(d) {
				return d['country'] === 'South Korea' ? 4 : 2;	
			})
			.attr('cx', function(d, i) {
				return x(d['political']);	
			})
			.attr('cy', function(d, i) {
				return y(d['economic']);	
			})
			.style('fill', function(d, i) {
			
				return d['country'] === 'South Korea' ? 'red' : null;	
			});

	dots.exit()
		.transition()
		.duration(500)
		.attr('cx', W - L - R)
		.attr('cy', 0)
		.style('opacity', 0)
		.remove();
}


d3.csv('gggr_all.csv', function(err, data) {
	if(err) return;

	d3.select('#year').on('change', function() {
		var targetYear = +this.value;	
		var nestedData = cleanseData(data, targetYear);
		render(nestedData, targetYear);
	});
	render(cleanseData(data, 2016), 2016);
});
