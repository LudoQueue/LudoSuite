window.onload = Init;

var W, H;
var ctx;
var drawInter;
var particles = {};

//Lets create a simple particle system in HTML5 canvas and JS
function Init() {
	//Initializing the canvas
	var canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	W = window.innerWidth;
	H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;

	drawInter = setInterval(draw, 33);
}
function create_particle(id)
{
	particles[id] = new particle();
}
//Lets create a function which will help us to create multiple particles
function particle()
{
	//Random position on the canvas
	this.x = Math.random()*W;
	this.y = Math.random()*H;
	
	//Lets add random velocity to each particle
	this.vx = 0;
	this.vy = 0;
	
	//Random colors
	var r = Math.random()*255>>0;
	var g = Math.random()*255>>0;
	var b = Math.random()*255>>0;
	this.color = "rgba("+r+", "+g+", "+b+", 0.5)";
	
	//Random size
	this.radius = Math.random()*20+20;
}

function update_particle_vel(id, tilt)
{
	var p = particles[id];
	p.vx = tilt.fb / 5;
	p.vy = -tilt.lr / 5;
}

function lose_particle(id)
{
	delete particles[id];
}

//Lets animate the particle
function draw()
{
	//Moving this BG paint code insde draw() will help remove the trail
	//of the particle
	//Lets paint the canvas black
	//But the BG paint shouldn't blend with the previous frame
	ctx.globalCompositeOperation = "source-over";
	//Lets reduce the opacity of the BG paint to give the final touch
	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
	ctx.fillRect(0, 0, W, H);
	
	//Lets blend the particle with the BG
	ctx.globalCompositeOperation = "lighter";
	
	//Lets draw particles from the array now
	for(var id in particles)
	{
		var p = particles[id];
		ctx.beginPath();
	
		//Time for some colors
		var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
		//gradient.addColorStop(0, "white");
		//gradient.addColorStop(0.1, "white");
		gradient.addColorStop(0, p.color);
		gradient.addColorStop(1, "black");
	
		ctx.fillStyle = gradient;
		ctx.arc(p.x, p.y, p.radius, Math.PI*2, false);
		ctx.fill();
	
		//Lets use the velocity now
		p.x += p.vx;
		p.y += p.vy;
	
		//To prevent the balls from moving out of the canvas
		if(p.x < -50) p.x = W+50;
		if(p.y < -50) p.y = H+50;
		if(p.x > W+50) p.x = -50;
		if(p.y > H+50) p.y = -50;
	}
}
function surf_fail(message) {
	clearInterval(drawInter);
	var textX = W / 2;
	var textY = H / 2;
	ctx.fillStyle = 'red';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = '30px _sans';
	ctx.fillText(message,textX,textY-100);
}