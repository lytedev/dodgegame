var m_sweg_input = new sweg.module("Sweg Input", "input");
m_sweg_input.update = function(dt) {
	sweg.input.oldKeysDown = [];
	for (var i = 0; i < sweg.input.keysDown.length; i++) {
		sweg.input.oldKeysDown[i] = sweg.input.keysDown[i];
	}
};
m_sweg_input.draw = function(dt) {

};

sweg.input = {};
sweg.input.keysDown = [];
sweg.input.oldKeysDown = [];

for (var i = 0; i < 256; i++) { sweg.input.keysDown[i] = false; }
		
sweg.input.onKeyDown = function(e) {
	sweg.input.keysDown[e.keyCode] = true;
};

sweg.input.onKeyUp = function(e) {
	sweg.input.keysDown[e.keyCode] = false;
};

sweg.input.isDown = function(keyCode) {
	return sweg.input.keysDown[keyCode] === true;
};

sweg.input.isUp = function(keyCode) {
	return sweg.input.keysDown[keyCode] === false;
};

sweg.input.isPressed = function(keyCode) {
	return sweg.input.keysDown[keyCode] === true && sweg.input.oldKeysDown[keyCode] === false;
};

addEventListener("keydown", sweg.input.onKeyDown, false);
addEventListener("keyup", sweg.input.onKeyUp, false);

sweg.input.keys = {};
sweg.input.keys.uparrow = 38;
sweg.input.keys.downarrow = 40;
sweg.input.keys.leftarrow = 37;
sweg.input.keys.rightarrow = 39

{
	var k = 64
	sweg.input.keys.a = k += 1;
	sweg.input.keys.b = k += 1;
	sweg.input.keys.c = k += 1;
	sweg.input.keys.d = k += 1;
	sweg.input.keys.e = k += 1;
	sweg.input.keys.f = k += 1;
	sweg.input.keys.g = k += 1;
	sweg.input.keys.h = k += 1;
	sweg.input.keys.i = k += 1;
	sweg.input.keys.j = k += 1;
	sweg.input.keys.k = k += 1;
	sweg.input.keys.l = k += 1;
	sweg.input.keys.m = k += 1;
	sweg.input.keys.n = k += 1;
	sweg.input.keys.o = k += 1;
	sweg.input.keys.p = k += 1;
	sweg.input.keys.q = k += 1;
	sweg.input.keys.r = k += 1;
	sweg.input.keys.s = k += 1;
	sweg.input.keys.t = k += 1;
	sweg.input.keys.u = k += 1;
	sweg.input.keys.v = k += 1;
	sweg.input.keys.w = k += 1;
	sweg.input.keys.x = k += 1;
	sweg.input.keys.y = k += 1;
	sweg.input.keys.z = k += 1;
}