/**
 * Dot Animation Script (Unpacked)
 * Creates animated dots that radiate from center and form connections
 */

var DEGREES = 360,
    STEP = 12,
    CANV = document.getElementById("cnv1"),
    CTX = CANV.getContext("2d"),
    G_DOTS = [];

// Returns random element from array
var randomizer = function(arr) {
    return arr[parseInt(Math.floor(Math.random() * arr.length))];
};

// Returns N random elements from array (removes them from source)
var randomizerSelectN = function(arr, count) {
    var result = [];
    count = count > 0 ? (count > arr.length ? arr.length : count) : 1;
    for (var i = 0; count > i; i++) {
        var idx = parseInt(Math.floor(Math.random() * arr.length));
        result.push(arr[idx]);
        arr.splice(idx, 1);
    }
    return result;
};

// Returns random value between min and max with step
var randomizerMinMax = function(min, max, step) {
    var arr = [];
    step = step > 0 ? step : 1;
    arr.push(min);
    for (var val = min + step; max >= val; val += step) {
        arr.push(val);
    }
    return randomizer(arr);
};

// Dot animation constructor
var Dot_f = function() {
    this.factor = 15;      // Spacing factor
    this.D = 30;           // Edge margin
    this.OX = 400;         // Origin X (center)
    this.OY = 300;         // Origin Y (center)
};

Dot_f.prototype = {
    special: 0,
    hasInitialized: false,
    dotColor: "#009431",      // Default dot color (green)
    lineColor: "#b3b3b3",     // Default line color (light gray)

    /**
     * Initialize dots - creates points in spiral pattern radiating from center
     * @param {number} dotCount - Number of dots to create
     * @param {number|Array} radius - Starting radius or array of predefined points
     * @param {number} radiusFactor - Factor to reduce radius each iteration
     * @param {Array} offsets - Random offset values
     * @param {string} color - Color for dots (hex color like "#009431")
     * @param {string} lineColor - Color for connection lines (optional, defaults to light gray)
     */
    init: function(dotCount, radius, radiusFactor, offsets, color, lineColor) {
        var points = [];
        
        // Set colors
        this.dotColor = color || "#009431";
        this.lineColor = lineColor || "#b3b3b3";
        
        if (radius instanceof Array) {
            points = radius;
            this.special = dotCount;
        } else {
            radiusFactor = radiusFactor > 0 ? radiusFactor : 1.2;
            for (var m = STEP; radius > -1;) {
                var startAngle = randomizerMinMax(1, 360);
                for (var angle = startAngle; angle < DEGREES + startAngle - this.factor; angle += m) {
                    var radians = Math.PI * angle / 180;
                    var x = this.OX + radius * Math.cos(radians);
                    var y = this.OY + radius * Math.sin(radians);
                    
                    points.push([x, y]);
                    
                    if (radius < this.factor) break;
                }
                m *= radiusFactor;
                radius -= this.factor;
            }
        }

        // Create dot objects from points
        for (var i = 0; dotCount > i && i < points.length; i++) {
            var point, dotData = [];
            var lineWidth = null;

            if (this.special > 0) {
                point = points[i];
            } else {
                var idx = randomizerMinMax(0, points.length - 1);
                point = points[idx];
                points.splice(idx, 1);
            }

            // Add random offset
            if (this.special > 0) {
                point[0] += randomizer(offsets);
                point[1] += randomizer(offsets);
                lineWidth = randomizer([0.2, 0.5]);
            } else {
                point[0] += randomizerMinMax(-3, 3, 1);
                point[1] += randomizerMinMax(-3, 3, 1);
                lineWidth = randomizerMinMax(0.2, 0.4, 0.1);
            }

            // Clamp to canvas bounds
            if (point[0] < this.D || point[0] > CANV.width - this.D || 
                point[1] < this.D || point[1] > CANV.height - this.D) {
                point[0] = point[0] >= CANV.width - this.D ? CANV.width - 200 : 
                           (point[0] <= 0 ? this.D : point[0]);
                point[1] = point[1] >= CANV.height - this.D ? CANV.height - 200 : 
                           (point[1] <= 0 ? this.D : point[1]);
            }

            // Dot data: [startX, startY, targetX, targetY, color, speed, isMoving, connections, lineWidth]
            dotData.push(this.OX, this.OY, point[0], point[1], this.dotColor, 
                        randomizerMinMax(0.6, 3.6, 0.1), true, randomizer([2, 3]), lineWidth);
            G_DOTS.push(dotData);
        }
        hasInitialized = true;
    },

    // Draw all dots
    paint: function() {
        for (var i = 0; i < G_DOTS.length; i++) {
            var dot = G_DOTS[i];
            CTX.beginPath();
            CTX.arc(dot[0], dot[1], 2.8, 0, 2 * Math.PI, false);
            CTX.fillStyle = dot[4];
            CTX.closePath();
            CTX.fill();
        }
    },

    // Calculate next frame positions (animate dots moving from center to target)
    calcNext: function() {
        for (var i = 0; i < G_DOTS.length; i++) {
            var dot = G_DOTS[i];
            if (dot[6]) {  // If still moving
                var reachedX = false, reachedY = false;
                
                if (dot[2] == this.OX || dot[3] == this.OY) {
                    // Moving along axis
                    if (dot[2] == this.OX) {
                        dot[1] += (this.OY > dot[3] ? -1 : 1) * dot[5];
                        reachedX = this.OX > dot[2] ? dot[0] <= dot[2] : dot[0] >= dot[2];
                    } else {
                        dot[0] += (this.OX > dot[2] ? -1 : 1) * dot[2];
                        reachedY = this.OY > dot[3] ? dot[1] <= dot[3] : dot[1] >= dot[3];
                    }
                } else {
                    // Moving diagonally
                    var oldY = parseFloat(dot[1]);
                    var slope = (dot[3] - this.OY) / (dot[2] - this.OX);
                    dot[1] += (this.OY > dot[3] ? -1 : 1) * dot[5];
                    dot[0] = (dot[1] - oldY) / slope + dot[0];
                    reachedX = this.OX > dot[2] ? dot[0] <= dot[2] : dot[0] >= dot[2];
                    reachedY = this.OY > dot[3] ? dot[1] <= dot[3] : dot[1] >= dot[3];
                }

                // Stop if reached target or hit bounds
                if (reachedX || reachedY || 
                    dot[0] < this.D || dot[0] > CANV.width - this.D || 
                    dot[1] < this.D || dot[1] > CANV.height - this.D) {
                    dot[0] = dot[2];
                    dot[1] = dot[3];
                    dot[6] = false;  // Stop moving
                }
            }
        }
    },

    // Prepare connection lines between dots
    prepareConnections: function() {
        for (var i = 0; i < G_DOTS.length; i++) {
            var dot = G_DOTS[i];
            var connectionCount = randomizerMinMax(2, dot[7]);
            var available = G_DOTS.slice(0);
            var connections = [];
            
            for (var j = 0; connectionCount > j; j++) {
                var idx = randomizerMinMax(0, available.length - 1);
                connections.push(available[idx]);
                available.splice(idx, 1);
            }
            dot[9] = connections;
        }
    },

    // Draw connection lines between dots
    drawConnections: function(skip) {
        var self = this;
        if (this.special > 0) {
            // Draw sequential connections (for outline shapes)
            for (var i = G_DOTS.length - 1; i > G_DOTS.length - 1 - (this.special - 1); i--) {
                var dot = G_DOTS[i];
                var prevDot = G_DOTS[i - 1];
                CTX.beginPath();
                CTX.moveTo(dot[0], dot[1]);
                CTX.lineTo(prevDot[0], prevDot[1]);
                CTX.lineWidth = dot[8];
                CTX.strokeStyle = self.lineColor;
                CTX.stroke();
                CTX.closePath();
            }
        } else {
            // Draw random connections
            skip = parseInt(skip > 1 ? skip : 1);
            for (var i = 0; i < G_DOTS.length; i++) {
                var dot = G_DOTS[i];
                for (var j = 0; j < Math.ceil(dot[9].length) / 2; j += skip) {
                    CTX.beginPath();
                    CTX.moveTo(dot[0], dot[1]);
                    CTX.lineTo(dot[9][j][0], dot[9][j][1]);
                    CTX.lineWidth = dot[8];
                    CTX.strokeStyle = self.lineColor;
                    CTX.stroke();
                    CTX.closePath();
                }
            }
        }
    },

    // Check if animation is complete
    isComplete: function() {
        for (var i = 0; i < G_DOTS.length; i++) {
            if (G_DOTS[i][6]) return false;
        }
        return hasInitialized;
    }
};

