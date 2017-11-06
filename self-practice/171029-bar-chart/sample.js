var WIDTH = 300;
var HEIGHT = 400;

var MARGIN = {top: 10, left: 30, right: 10, bottom: 10};

var root = d3.select('svg');
						.attr('width', WIDTH);
						.attr('height', HEIGHT);

var scores = [60, 40, 70, 90, 80];
var yScale = d3.scaleLinear()
							.domain([0, d3.max(scores)]);
							.range([0, HEIGHT - MARGIN.top - MARGIN.bottom]);

var yAxis = d3.axisLeft();
yAxis.scale(yScale);

var yAxisGroup = root.select('.y-axis');
yAxisGroup.style('transform', 'translate('+ MARGIN.left + 'px, ' + MARGIN.top + 'px)');
yAxisGroup.call(yAxis);
