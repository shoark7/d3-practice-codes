var root = d3.select('svg');
var W = root.attr('width');
var H = root.attr('height');

var data = [];

generate(data, W * 0.5, H, 0.5 * Math.PI, H * 0.2);
render(data);



// Function Definition Baby :)
function generate(data, x, y, a, l) {
	if(l < 3) return;

	var x2 = x + Math.cos(a) * l;
	var y2 = y - Math.sin(a) * l;
	data.push({x1: x, y1: y, x2: x2, y2: y2, l: l});

	generate(data, x2, y2,
			a + Math.PI * 2 / 12,
			l * (0.65 + Math.random() * 0.2));

	generate(data, x2, y2,
			a - Math.PI * 2 / 12,
			l * (0.65 + Math.random() * 0.2));
}


function render(data) {
	var lines = root.selectAll('line').data(data);
	// Selection is made.
	lines.enter()
		.append('line')
		.merge(lines)
		.attr('stroke', function(d) {
			return d.l > 5 ? 'brown' : 'darkgreen';	
		})
		.attr('x1', function(d) { return d.x1; })
		.attr('y1', function(d) { return d.y1; })
		.attr('x2', function(d) { return d.x2; })
		.attr('y2', function(d) { return d.y2; });
	lines.exit()
		.remove();
}
