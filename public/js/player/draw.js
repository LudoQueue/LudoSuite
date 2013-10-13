var canvas,
	ctx,
	W,
	H,
	color;

function create_draw() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	W = window.innerWidth;
	H = window.innerHeight;
	window.addEventListener("resize", function() {
		W = window.innerWidth;
		H = window.innerHeight;	
		canvas.width = W;
		canvas.height = H;
		if(game.overlay.menu != null) {
			game.overlay.menu[0].style.top = H/2+'px';
		}
		console.log('resizing');
	}, false);
	
	this.init = function() {
		canvas.width = W;
		canvas.height = H;
	};
	
	this.play = function() { this.state(); };
	
	this.temp_state = function() {};
	
	var new_state;
	var tran_start;
	
	this.change_state = function(new_state_string) {
		switch(new_state_string) {
			case "waiting":
				new_state = waiting;
				break;
			case "surfing":
				new_state = surfing;
				break;
			case "racing":
				new_state = racing;
				break;
			case "balancing":
				new_state = balancing;
				break;
		}
		if( this.state == transition ) {
			this.temp_state = function(){};
		}
		else {
			this.temp_state = this.state;
		}
		transition_time = Date.now();
		transition_down = false;
		transition_alph = 0;
		this.state = transition;
	};
	
	this.spinner = new create_spinner();
	
	this.waiting_message = 'Please enter your name';
	var waiting_message_time = Date.now();
	
	var waiting = function() {
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
		ctx.fillRect(0, 0, W, H);
		ctx.globalCompositeOperation = "lighter";
		this.spinner.draw(W/2, H*4/5);
		
		if(Date.now() - waiting_message_time < 2000 ) {
			ctx.font = '20pt Calibri';
			ctx.textAlign = 'center';
			ctx.textBaseline = "top";
			ctx.fillStyle = 'white';
			ctx.fillText(this.waiting_message, W/2, 50);
		}
		else if(Date.now() - waiting_message_time > 4000 ) {
			waiting_message_time = Date.now();
		}

	};
	
	var surfing = function() {
		ctx.beginPath();
		var gradient = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 100);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.5, color);
		gradient.addColorStop(1, "black");
	
		ctx.fillStyle = gradient;
		ctx.arc(W/2, H/2, 100, Math.PI*2, false);
		ctx.fill();
	};
	
	var racing = function() {
		var box_width = (W/2)/4;
		for(var i=0;i<4;i++) {
			var left_style;
			var right_style;
			if(i%2 == 0) {
				left_style = "white";
				right_style = color;
			}
			else {
				left_style = color;
				right_style = "white";
			}
			var line_y = ((H/2)-(box_width*2))+(box_width*i);
			for(var w=0;w<4;w++) {
				box_x = ((W/2)-(box_width*2))+(box_width*w);
				if( w % 2 == 0 ) {
					ctx.fillStyle = left_style;
				}
				else {
					ctx.fillStyle = right_style;
				}
				ctx.fillRect(box_x,line_y,box_width,box_width);
			}
		}
		ctx.font = '15pt Calibri';
	};
	
	var balancing = function() {
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.lineWidth = "10";
		ctx.moveTo(W/4,H/2);
		ctx.lineTo(3*W/4,H/2);
		ctx.stroke();
	};
	
	var transition_down = false;
	var transition_alph = 0;
	var transition_time;
	
	var transition = function() {
		if( !transition_down ) {
			transition_alph += ( Date.now() - transition_time ) / 1500;
			this.temp_state();
			ctx.globalCompositeOperation = "source-over";
			ctx.fillStyle = "rgba(0, 0, 0, "+transition_alph+")";
			ctx.fillRect(0, 0, W, H);
			if( transition_alph >= 1 ) {
				this.temp_state = new_state;
				transition_alph = 1;
				transition_down = true;
				waiting_message_time = Date.now();
			}
		}
		else {
			if( transition_alph <= 0 ) {
				this.state = new_state;
				transition_down = false;
				transition_alph = 0;
			}
			else {
				transition_alph -= ( Date.now() - transition_time ) / 1500;
				this.temp_state();
				ctx.globalCompositeOperation = "source-over";
				ctx.fillStyle = "rgba(0, 0, 0, "+transition_alph+")";
				ctx.fillRect(0, 0, W, H);
			}
		}
		transition_time = Date.now();
	};
	
	this.state = function(){};
	
}

function create_spinner() {
	this.angle = 0;
	this.rad = 5;
	this.last_time = Date.now();
	
	this.draw = function(X,Y) {
		ctx.beginPath();
		var spin_x = X + Math.cos(this.angle)*this.rad;
		var spin_y = Y + Math.sin(this.angle)*this.rad;
		var gradient = ctx.createRadialGradient(spin_x, spin_y, 0, spin_x, spin_y, this.rad);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(1, "black");
		ctx.fillStyle = gradient;
		ctx.arc(spin_x, spin_y, this.rad, Math.PI*2, false);
		ctx.fill();
		ctx.closePath();
		this.angle += ( ( Date.now() - this.last_time ) / 500 ) * Math.PI;
		if( this.angle > Math.PI*2 ) {
			this.angle -= Math.PI*2;
		}
		this.last_time = Date.now();
	};
}