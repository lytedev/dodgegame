sweg.requireModule("graphics");
new sweg.module("Sweg Entity", "entity");

sweg.entity = function() {
	this.image = false;
	this.color = false;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;
	this.ax = 0;
	this.ay = 0;
	this.w = 1;
	this.h = 1;

	this.intersectsEntity = function(e) {
		return !(this.x > e.x + e.w || this.y > e.y + e.h || this.x + this.w < e.x || this.y + this.h < e.y);
	};
	
	this.setImage = function(src) {
		this.image.src = src;
	};
	
	this.update = function(dt) {
		this.vx += this.ax * dt;
		this.vy += this.ay * dt;
		this.x += this.vx * dt;
		this.y += this.vy * dt;
	};
	
	this.draw = function(dt) {
		if (this.color != false) {
			sweg.ctx.fillStyle = this.color;
			sweg.graphics.drawRectangle(this.x, this.y, this.w, this.h);
		}
		if (this.image != false) {
			sweg.graphics.drawImage(this.image, this.x, this.y); 
		}
	};
};
