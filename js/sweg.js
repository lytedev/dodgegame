// Create sweg variable
sweg = {};

sweg.importDirectory = "./js/swegmodules/";

// Import sweg module
sweg.import = function(file) { 
  var s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", this.importDirectory + file);
  document.body.appendChild(s);
}

// Create sweg module container
sweg.modules = []; 

// Set default settings
sweg.width = 640;
sweg.height = 360;

// Initialize members
sweg.useConsole = false;
sweg.paused = false;
sweg.timer = false;
sweg.canvasContainer = false;
sweg.canvas = false;
sweg.bufferCanvas = false;
sweg.ctx = false;
sweg.displayctx = false;
sweg.console = false;
sweg.time = 0;
sweg.ticks = 0;
sweg.ftime = 0;
sweg.frames = 0;
sweg.fps = 0;
sweg.tps = 0;

// Initialize "Settings" 
sweg.desiredFramesPerSecond = 60;

// Internal magic numbers the may or may not want to be changed by the developer for whatever reason
sweg.fpsresetsecs = 5;

// Prints the specified text to the console if possible
sweg.print = function(x) { 
	// If no console, return
    if (sweg.useConsole !== true) { return; }
	// Get timestamp info
    var now = new Date(); 
    var hrs = now.getHours() + ""; if (hrs.length < 2) { hrs = "0" + hrs; }
    var mins = now.getMinutes() + ""; if (mins.length < 2) { mins = "0" + mins; }
    var secs = now.getSeconds() + ""; if (secs.length < 2) { secs = "0" + secs; }
	// Append message to console
    sweg.console.innerHTML = "<span class=\"dark\">[" + hrs + ":" + mins + ":" + secs + "]</span> " + x + "<br />" + sweg.console.innerHTML; 
};

// Define module object
sweg.module = function(mName, mNamespace) {
	this.name = mName;
	this.namespace = mNamespace;
	this.description = "A module.";
	this.version = {major: 1, minor: 0, build: 0, revision: 0};	
	
	this.update = function(dt) {

	};
	
	this.draw = function(dt) { 
		
	}; 
	
	this.getVersionString = function() {
		return this.version.major + "." + this.version.minor + "." + this.version.build + "." + this.version.revision;
	};
	
	sweg.modules.push(this);
};
sweg.module.prototype.toString = function() {
	return this.name + " (" + this.namespace + ") v" + this.getVersionString();
};

// Let the scripting environment know that the current module has been loaded so other modules may make checks
new sweg.module("Sweg Core", "core");

sweg.requireModule = function(moduleNamespace) {
	for (var i = 0; i < sweg.modules.length; i++) {
	if (sweg.modules[i].namespace = "moduleNamespace")
		return sweg.modules[i];
	}
	alert("Required module \"" + moduleNamespace + "\" not found");
};

// Creates the elements necessary for the game
sweg.createElements = function() {
	// Creates the canvas container
    sweg.canvasContainer = document.createElement("div");
    document.body.appendChild(sweg.canvasContainer);
    
	// Creates the canvas
    sweg.canvas = document.createElement("canvas");
    sweg.bufferCanvas = document.createElement("canvas");
    sweg.canvasContainer.appendChild(sweg.canvas);
    
	// Gets the context
    sweg.ctx = sweg.bufferCanvas.getContext("2d");
    sweg.displayctx = sweg.canvas.getContext("2d");
    sweg.applyCanvasStyles();
    
	// If requested, creates the console
    if (sweg.useConsole === true) {
        sweg.console = document.createElement("div"); 
        document.body.appendChild(sweg.console);
    }
};

// Applies the canvas's styles
sweg.applyCanvasStyles = function() {
	// Sets the margins
    sweg.canvasContainer.style.marginBottom = sweg.canvasContainer.style.marginTop = "0";
    sweg.canvasContainer.style.marginLeft = sweg.canvasContainer.style.marginRight = "auto";
	
	// Centers the canvas
    sweg.canvasContainer.style.textAlign = "center";

	// Sets the canvas's dimensions
    sweg.canvas.style.height = (sweg.canvas.height = sweg.height) + "px";
    sweg.canvas.style.width = (sweg.canvas.width = sweg.width) + "px";
    sweg.bufferCanvas.style.height = (sweg.bufferCanvas.height = sweg.height) + "px";
    sweg.bufferCanvas.style.width = (sweg.bufferCanvas.width = sweg.width) + "px";
	
	// Sets colors
    sweg.canvas.style.backgroundColor = "#000";
	
	// Sets the borders
    sweg.canvas.style.border = "solid 1px #444";
    
	// Sets the font
    sweg.ctx.font = "6pt sans-serif";
	
	// Sets the default canvas context colors
    sweg.ctx.fillStyle = "#fff";
    sweg.ctx.strokeStyle = "#fff";
    
	// Request custom styles
    sweg.applyCustomCanvasStyles();
};

// Applies the console's styles
sweg.applyConsoleStyles = function() {
	// Check if console is even in use
    if (sweg.useConsole !== true) { return; }
    
	// Sets colors
    sweg.console.style.backgroundColor = "#111";
	
	// Sets the font family
    sweg.console.style.fontFamily = "monospace";
	
	// Sets the console overflow
    sweg.console.style.overflow = "auto";
	
	// Sets the padding
    sweg.console.style.paddingTop = 
		sweg.console.style.paddingBottom = 
		sweg.console.style.paddingRight = 
		sweg.console.style.paddingLeft = 
			"10px";
			
	// Sets the console's dimensions
    sweg.console.style.width = 
		sweg.width - 
			20 + "px";			
    sweg.console.style.height = 
		"80px";
		
	// Sets the margin
    sweg.console.style.marginTop = "10px";
    sweg.console.style.marginLeft = "auto";
    sweg.console.style.marginRight = "auto";
	
	// Sets the border
    sweg.console.style.border = "solid 1px #444";
    
	// Request custom styles
    sweg.applyCustomConsoleStyles();
};

// Create and initialize the timer
sweg.timer = {};
sweg.timer.TimerCreation = Date.now();
sweg.timer.Current = Date.now();
sweg.timer.Last = Date.now();
sweg.timer.Elapsed = 0;

// Updates the timer (not meant to be called manually)
sweg.timer.update = function() {
        sweg.timer.Current = Date.now();
        sweg.timer.Elapsed = sweg.timer.Current - sweg.timer.Last;
        sweg.timer.Last = sweg.timer.Current;
    };

// Initializes the game and sparks the first tick
sweg.baseinit = function() {
	// Apply element styles
    sweg.applyCanvasStyles();
    sweg.applyConsoleStyles();
	
	// Call overload
    sweg.init();
	
	// Update the timer for the first time
    sweg.timer.update();
	
	// Calls the first tick
    setInterval(sweg.basetick, (1 / sweg.desiredFramesPerSecond) * 1000);
};

// Updates the timer, gets the delta time, updates the frames and ticks-per-second, updates, and draws the game
sweg.basetick = function() {
	// Update the time
    sweg.timer.update();

	// Gets delta time in seconds
    var dt = sweg.timer.Elapsed / 1000;
    
	// Calls the overload
    sweg.tick(dt);	
	
	// Update time-tracking variables
    sweg.time += dt;
    sweg.ftime += dt;
    sweg.ticks++;
    sweg.frames++; 

    sweg.fps = Math.floor(sweg.frames / (sweg.time));
    sweg.tps = Math.floor(sweg.ticks / (sweg.time));
	
	// Check if time-tracking variables need a reset (in order to ensure that tracking is fresh and not too averaged out
    if (sweg.time > sweg.fpsresetsecs) { sweg.time = 0; sweg.ticks = 0; sweg.frames = 0; sweg.ftime = 0; }
	
	// Calls update and draw
    sweg.baseupdate(dt);
    sweg.basedraw(dt);
};

// Updates the game's objects
sweg.baseupdate = function(dt) {
	// Calls the overload
    sweg.update(dt);
	for (var i = 0; i < sweg.modules.length; i++) { 
		sweg.modules[i].update(dt);
	}
};

// Draws the graphics to the canvas
sweg.basedraw = function(dt) { 
	// Calls the overload
    sweg.draw(dt);
	for (var i = 0; i < sweg.modules.length; i++) { 
		sweg.modules[i].draw(dt);
	}

	var preimage = sweg.ctx.getImageData(0, 0, sweg.width, sweg.height);
	sweg.displayctx.putImageData(preimage, 0, 0);
};

// Clears the console 
sweg.clearConsole = function() {
	// Check if console is in use
	if (sweg.useConsole !== true) { return; }
	
	// Set the console's inner HTML to blank
    sweg.console.innerHTML = "";
};

// Graphics Functionality
sweg.clearScreen = function() {
	// Clears a rectangle of the canvas based on its dimensions
    sweg.ctx.clearRect(0, 0, sweg.width, sweg.height);
};

// User overloads
sweg.applyCustomCanvasStyles = function() { };
sweg.applyCustomConsoleStyles = function() { };
sweg.init = function() { };
sweg.tick = function() { };
sweg.update = function(dt) { };
sweg.draw = function(dt) { };

// Prepare to load the game
sweg.prepare = function() {
	// Create the HTML elements of the game
	sweg.createElements();
	// sweg.baseinit();
	
	// Make sure the game initializes when the window is ready
	window.onload = sweg.baseinit;
};






