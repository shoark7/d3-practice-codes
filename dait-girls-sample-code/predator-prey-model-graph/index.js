/* This code creates predator-prey model grpah with D3
 * Code is from Alan Kang, all rights are reserved for him.
 * Date : 2017/12/01
 */

 //Initialize variables
var POPULATION = 100,
		MAX_POPULATION = 1000,
		PRED_RATIO = 0.2,
		HUNT_RADIUS = 0.05,
		ENERGY_DEFLATE = 0.02,
		PRED_BRATE = 0.005,
		PREY_BRATE = 0.05;
var W = innerWidth, H = innerHeight,
		root = d3.select('svg').attr('width', W).attr('height', H),
		sx = d3.scaleLinear()
					.domain([0, 1])
					.range([0, W]),
		sy = d3.scaleLinear()
					.domain([0, 1])
					.range([0, H]);
var rand = Math.random,
		pi = Math.PI,
		cos = Math.cos,
		sin = Math.sin,
		sqrt = Math.sqrt;


 //Generate initial population
var agents = d3.range(POPULATION).map(function(d, i) {
	return {
		type: ['prey', 'pred'][rand() > PRED_RATIO ? 0 : 1],  // ***
		alive: true,
		x: rand(),
		y: rand(),
		a: rand() * 2 * pi, // ***
		e: 1.0	
	};	
});

tick();
var lastUpdate = Date.now();
function tick() {
	requestAnimationFrame(tick);
	var now = Date.now();
	if(now - lastUpdate < 50) return;
	lastUpdate = now;

	 //update data
	var qtree = d3.quadtree()
		.extent([[0, 0], [W, H]])
		.x(function(a) { return a.x; })
		.y(function(a) { return a.y; })
		.addAll(agents);


	agents.forEach(function(a) {
		 //양일 때와 늑대일 때를 구분해 새 개체 생성
		if(agents.length < MAX_POPULATION && a.type == 'pred' && rand() < PRED_BRATE) {
			agents.push({
				type: 'pred',
				alive: true,
				x: a.x,
				y: a.y,
				a: a.a,
				e: a.e *= 0.5	
			});	
		}	else if (agents.length < MAX_POPULATION && a.type == 'prey' && rand() < PREY_BRATE) {
			agents.push({
				type: 'prey',
				alive: true,
				x: a.x,
				y: a.y,
				a: a.a,
			});	
		} 

	 //hunt
		if(a.type == 'pred') {
			var target = hunt(qtree, a.x, a.y);
			if(target) {
				target.alive = false;
				a.e = 1.0;
			}	

			a.e -= ENERGY_DEFLATE;
			a.alive = a.e > 0.0;
		}

		a.x += cos(a.a) * 0.01;
		a.y -= sin(a.a) * 0.01;
		a.a += (rand() - 0.5) * 2 * pi * 0.1;
		if(a.x < 0) a.x = 1;
		if(a.x > 1) a.x = 0;
		if(a.y < 0) a.y = 1;
		if(a.y > 1) a.y = 0;

	});

	agents = agents.filter(function(a) { return a.alive; });
	var nPred = 0, nPrey = 0;
	agents.forEach(function(a) {
		if(a.type === 'pred')
			nPred++;
		else
			nPrey++;	
	})
	d3.select('#nPred').text(nPred);
	d3.select('#nPrey').text(nPrey);

	 //update selection
	var sel = root.select('.agents').selectAll('.agent').data(agents);
	sel
		.enter()
		.append('circle')
		.merge(sel)
		.attr('class', function(d) { return 'agent ' + d.type; })
		.attr('r', function(d) { return d.type === 'pred' ? 4 : 2; })
		.attr('cx', function(d) { return sx(d.x); })
		.attr('cy', function(d) { return sy(d.y); });
	sel
		.exit()
		.remove();
}


function hunt(qtree, x, y) {
	var x0 = x - HUNT_RADIUS,
			y0 = y - HUNT_RADIUS,
			x3 = x + HUNT_RADIUS,
			y3 = y + HUNT_RADIUS;
	var target = null;

	qtree.visit(function(node, x1, y1, x2, y2) {
		if(target) return true;
		if(!node.length) {
			do {
				var d = node.data;
				if(d.type === 'pred') continue;
				if(sqrt((d.x - x) * (d.x - x) + (d.y - y) * (d.y - y)) < HUNT_RADIUS) {
					target = d;
					return true;	
				}
			}	while(node = node.next);
		}		
		return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
	});

	return target;
}
