new sweg.module("Sweg Graphics", "graphics");

sweg.graphics = {};

// Let the scripting environment know that the current module has been loaded so other modules may make checks

sweg.graphics.fonts = [];

// Adds a font to the font list
sweg.graphics.addFont = function(fontKey, fontFamily, size) {
	sweg.graphics.fonts[fontKey] = size + "px " + fontFamily;
};

// Sets the font for the canvas context to use
sweg.graphics.setFont = function(fontFamily, size) {
    sweg.ctx.font = size + "px " + fontFamily;
};

// Gets the font for the canvas context to use from the current available fonts by name
sweg.graphics.setFont = function(fontKey) {
	sweg.ctx.font = sweg.graphics.fonts[fontKey];
};

// Draws a string to the canvas
sweg.graphics.drawString = function(str, x, y) {
    sweg.ctx.fillText(str, x, y);
};

sweg.graphics.drawStringWithOutline = function(str, x, y, outline) {
    sweg.ctx.lineWidth = outline;
    sweg.ctx.strokeText(str, x, y);
    sweg.ctx.fillText(str, x, y);
};

sweg.graphics.drawImage = function(image, x, y) {
	sweg.ctx.drawImage(image, x, y); 
};

sweg.graphics.drawRectangle = function(x, y, w, h) {
	sweg.ctx.fillRect(x, y, w, h);
};