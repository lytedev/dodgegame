sweg.useConsole = false;
sweg.width = 640;
sweg.height = 360;

enemies = false;
pickup = false;
ob = false; 

maxSlomoTime = false;
slomoCooldown = false;
slomoTime = false;
usingSlomo = false;
slomoRatio = false;
survivedTime = false;

spawnChance = false;

cscreen = false;

newPickup = function() {
	pickup = new sweg.entity();
	if (Math.random() < 0.1) {
		pickup.color = "#fb0";
		pickup.points = 10000;
	} else {
		pickup.color = "#4f0";
		pickup.points = 2000;
	}
	pickup.w = 8;
	pickup.h = 8;
	pickup.x = (sweg.width * Math.random()) - ob.w;
	pickup.y = ((sweg.height / 2) * Math.random()) + (sweg.height / 2) - ob.h;
}

startGame = function() {
	cscreen = "game"; 

	enemies = [];

	newPickup();

	ob = new sweg.entity(); 
	ob.color = "#06f";
	ob.w = 16;
	ob.h = 16;
	ob.y = sweg.height - ob.h;
	ob.x = (sweg.width * Math.random()) - ob.w;

	maxSlomoTime = 2;
	slomoCooldown = false;
	slomoTime = maxSlomoTime;
	usingSlomo = false;
	slomoRatio = 4;
	survivedTime = 0;
	spawnChance = 0.01;
}; 

loseGame = function() {
	cscreen = "lost"; 

	ob = false;
	pickup = false;

	maxSlomoTime = 2;
	slomoCooldown = false;
	slomoTime = maxSlomoTime;
	usingSlomo = false;
	slomoRatio = 4;
	spawnChance = 0.40;
}; 

introGame = function() {
	cscreen = "intro"; 

	pickup = false;

	enemies = [];
	ob = new sweg.entity(); 
	ob.color = "#06f";
	ob.w = 16;
	ob.h = 16;
	ob.y = sweg.height - ob.h;
	ob.x = (sweg.width * Math.random()) - ob.w;

	maxSlomoTime = 2;
	slomoCooldown = false;
	slomoTime = maxSlomoTime;
	slomoRatio = 4;
	survivedTime = 0;
	usingSlomo = false;
	spawnChance = 0.40;
}; 

sweg.init = function() {
	sweg.graphics.addFont("small", "Segoe UI, Lucida Grande, Tahoma, sans-serif", 10);
	sweg.graphics.addFont("default", "Segoe UI, Lucida Grande, Tahoma, sans-serif", 12);
	sweg.graphics.addFont("large", "Georgia, Times New Roman, serif", 36);
	sweg.graphics.setFont("default");

	introGame();
}; 

sweg.update = function(dt) {
	ob.ay = 0;
	ob.ax = 0;
	ob.ay = 400;

	if (sweg.input.isPressed(sweg.input.keys.p)) { sweg.paused = !sweg.paused; }
	if (sweg.paused) { return; }

	if (cscreen == "lost") {
		if (sweg.input.isPressed(sweg.input.keys.k)) {
			var escore = document.getElementById("score-container");
			var md5d = "secret)_I0gR:Lg[p-353" + Math.floor(survivedTime);
			escore.value = MD5(md5d) + " " + Math.floor(survivedTime);
			var sform = document.getElementById("score-form");
			sform.submit();
			escore.value = "";
		}
	}

	if (dt > 0.2) { dt = 0.2; }

	if (cscreen != "lost")
	{
		usingSlomo = false;
		if (sweg.input.isDown(sweg.input.keys.m) && !slomoCooldown) { 
			usingSlomo = true;
			if (cscreen == "game") { slomoTime -= dt; }
			dt /= slomoRatio; 
			if (slomoTime < 0) {
				slomoCooldown = true;
				slomoTime = 0;
			}
		} else {
			slomoTime += (dt / 3);
			if (slomoTime >= maxSlomoTime) {
				slomoTime = maxSlomoTime;
				slomoCooldown = false;
			}
		}
		survivedTime += dt * 100;
		spawnChance += dt / 1000;

		var speed = 8;
		if (sweg.input.isDown(sweg.input.keys.v)) { loseGame(); }
		if (sweg.input.isDown(sweg.input.keys.w)) { ob.ay -= speed * 100; }
		if (sweg.input.isDown(sweg.input.keys.s)) { ob.ay += speed * 100; }
		if (sweg.input.isDown(sweg.input.keys.a)) { ob.vx -= speed; }
		if (sweg.input.isDown(sweg.input.keys.d)) { ob.vx += speed; }
		if (ob) { ob.update(dt); }
		var bco = 2
		if (ob.x < 0) { ob.x = 0; ob.vx = -ob.vx / bco; }
		if (ob.y < 0) { ob.y = 0; ob.vy = -ob.vy / bco; }
		if (ob.x + ob.w > sweg.width) { ob.x = sweg.width - ob.w; ob.vx = -ob.vx / bco;}
		if (ob.y + ob.h > sweg.height) { ob.y = sweg.height - ob.h; ob.vy = -ob.vy / bco; }
	} 

	if (cscreen != "game") {
		if (sweg.input.isPressed(sweg.input.keys.l)) {
			startGame();
		}
	}

	for (var i = 0; i < enemies.length; i++) {
		enemies[i].update(dt);
		if (ob && cscreen == "game") {
			if (enemies[i].intersectsEntity(ob)) {
				loseGame();
			}
		}
		if (enemies[i].y > sweg.height) {
			enemies.splice(i, 1);
			if (cscreen == "game") { survivedTime += 200; }
			i--;
		}
	}

if (ob && pickup && cscreen == "game") {
	if (pickup.intersectsEntity(ob)) {
		survivedTime += pickup.points;
		newPickup();
	}
}

	while (Math.random() < spawnChance) {
		enemy = new sweg.entity();
		enemy.w = Math.floor((Math.random() * 42) + 3);
		enemy.h = Math.floor((Math.random() * 42) + 3);
		enemy.ay = 400;
		enemy.y = -enemy.h;
		enemy.x = (Math.random() * sweg.width) - enemy.w;
		enemy.color = "rgb(" + 
			Math.floor((Math.random() * 120) + 135) + "," + 
			Math.floor((Math.random() * 60) + 60) + "," + 
			Math.floor((Math.random() * 60) + 0)  + ")";
		enemies.push(enemy);
	}
};

sweg.draw = function(dt) { // dt = delta time in seconds

	if (!usingSlomo) {
		sweg.clearScreen();
	} else {
		var preimage = sweg.ctx.getImageData(0, 0, sweg.width, sweg.height);
		for (var i = 0; i < preimage.data.length; i++) { preimage.data[i] /= 1.20; }
		sweg.ctx.putImageData(preimage, 0, 0);
	}

	if (cscreen == "game") {
		for (var i = 0; i < enemies.length; i++) {
			enemies[i].draw(dt);
		}
		if (ob) { ob.draw(dt); }
		if (pickup) { pickup.draw(dt); }

		sweg.ctx.fillStyle = "#111";
		sweg.ctx.fillRect(8, 8, ((slomoTime / maxSlomoTime) * 100) + 4, 14);
		if (slomoCooldown) {
			sweg.ctx.fillStyle = "#f40";
		} else {
			sweg.ctx.fillStyle = ob.color;		
		}
		sweg.ctx.fillRect(10, 10, (slomoTime / maxSlomoTime) * 100, 10);
		sweg.ctx.fillStyle = "#fff";
		sweg.ctx.strokeStyle = "#000";
		sweg.graphics.setFont("default");

		sweg.ctx.textAlign = "left";
		sweg.graphics.drawStringWithOutline(Math.floor(survivedTime) + "", 120, 20, 3);
	} else if (cscreen == "lost") {
		for (var i = 0; i < enemies.length; i++) {
			enemies[i].draw(dt);
		}

		sweg.ctx.fillStyle = "#fff";
		sweg.ctx.strokeStyle = "#000";
		sweg.ctx.textAlign = "center";
		var y = 180;
		sweg.graphics.setFont("small");
		sweg.graphics.drawStringWithOutline("FINAL SCORE", sweg.width / 2, y - 35, 3);
		sweg.graphics.setFont("large");
		sweg.graphics.drawStringWithOutline(Math.floor(survivedTime)+"", sweg.width / 2, y, 5);
		sweg.graphics.setFont("default");
		sweg.graphics.drawStringWithOutline("Press 'L' to play again!", sweg.width / 2, y + 30, 3);
		sweg.graphics.drawStringWithOutline("Press 'K' to submit your score!", sweg.width / 2, y + 45, 3);
		sweg.graphics.drawStringWithOutline("Created at http://lytedev.com", sweg.width / 2, y + 75, 3);
	} else if (cscreen == "intro") {
		for (var i = 0; i < enemies.length; i++) {
			enemies[i].draw(dt);
		}
		if (ob) { ob.draw(dt); }

		sweg.ctx.fillStyle = "#fff";
		sweg.ctx.strokeStyle = "#000";
		sweg.graphics.setFont("large");
		sweg.ctx.textAlign = "center";
		var y = 140;
		sweg.graphics.drawStringWithOutline("Dodge", sweg.width / 2, y, 5);
		sweg.graphics.setFont("default");
		sweg.graphics.drawStringWithOutline("Move with W,A,S,D", sweg.width / 2, y + 30, 3);
		sweg.graphics.drawStringWithOutline("Slo-mo with M", sweg.width / 2, y + 45, 3);
		sweg.graphics.drawStringWithOutline("Pause with P", sweg.width / 2, y + 60, 3);
		sweg.graphics.drawStringWithOutline("Don't touch the falling boxes!", sweg.width / 2, y + 75, 3);
		sweg.graphics.drawStringWithOutline("Press L to start!", sweg.width / 2, y + 105, 3);
		sweg.graphics.drawStringWithOutline("Created at http://lytedev.com", sweg.width / 2, y + 135, 3);
	}

	if (sweg.paused) {
		sweg.ctx.fillStyle = "#fff";
		sweg.ctx.strokeStyle = "#000";
		sweg.ctx.textAlign = "left";
		sweg.graphics.setFont("small");
		sweg.graphics.drawStringWithOutline("PAUSED", 10, 30, 3);
	}
	
	/*
	sweg.graphics.drawString(sweg.fps + "", 10, sweg.height - 10);
	sweg.graphics.drawString(enemies.length + "", 10, sweg.height - 25);
	*/
}; 

sweg.prepare();
sweg.print("Prepared");

var MD5 = function (string) {
 
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
 
	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}
 
 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }
 
	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};
 
	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	};
 
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
 
	string = Utf8Encode(string);
 
	x = ConvertToWordArray(string);
 
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
 
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
	return temp.toLowerCase();
}