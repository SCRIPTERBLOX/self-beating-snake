var sWidth = 600;
var sHeight = 600;

var snake = [
    [sWidth/2-25, sHeight/2]
];

var dir = "w";
var nextDir = "w";


var programCode = function(processingInstance) {
    with (processingInstance) {
        size(sWidth, sHeight);
        frameRate(5);

        //render
        draw = function() {
            if (nextDir == "w" && dir != "s") {dir = "w"}
            else if (nextDir == "s" && dir != "w") {dir = "s"}
            else if (nextDir == "a" && dir != "d") {dir = "a"}
            else if (nextDir == "d" && dir != "a") {dir = "d"}

            var head = snake[0];

            if (dir == "w") {head[1] -= 25}
            else if (dir == "s") {head[1] += 25}
            else if (dir == "a") {head[0] -= 25}
            else if (dir == "d") {head[0] += 25}

            if (head[0] >= sWidth) {head[0] = 0}
            else if (head[0] <= -1) {head[0] = sWidth-25}
            else if (head[1] >= sHeight) {head[1] = 25}
            else if (head[1] <= -1) {head[1] = sHeight-25}

            background(50, 50, 50);

            for (var i = 0; i < snake.length; i++) {
                if (i == 0) {
                    fill(0, 100, 0);
                } else {
                    fill(0, 255, 0);
                }

                noStroke();
                rect(snake[i][0], snake[i][1], 25, 25);
            };
        }
    }
}

var canvas = document.getElementById("display")
var processingInstance = new Processing(canvas, programCode);