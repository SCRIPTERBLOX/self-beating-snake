let bg1 = [75, 75, 75];
let bg2 = [0, 200, 0];

let currentBg = bg1;
let currentSnakeCol = bg2;

let boardWidth = 30;
let boardHeight = 30;

let defSnake = [[Math.floor(boardWidth / 2), Math.floor(boardHeight / 2)], [Math.floor(boardWidth / 2), Math.floor(boardHeight / 2) + 1], [Math.floor(boardWidth / 2), Math.floor(boardHeight / 2) + 2]];
let snake = defSnake; // [[x, y], [x, y]]

let snakeSize = 20;

let dir = "s";

let food = [Math.floor(Math.random() * boardWidth), Math.floor(Math.random() * boardHeight)];

let task = "down";
let longTermTask = "start";

let speed = 100;

function setup() {
    createCanvas(boardWidth*snakeSize, boardHeight*snakeSize);
    background(currentBg);
    noStroke();
}

function draw() {
    frameRate(speed);

    // Snake AI
    ai()

    // Move in dir
    if (dir === "w") {
        snake.pop();
        let newSnake = [...snake].reverse();
        newSnake.push([snake[0][0], snake[0][1]-1]);
        snake = newSnake.reverse();
    } else if (dir === "s") {
        snake.pop();
        let newSnake = [...snake].reverse();
        newSnake.push([snake[0][0], snake[0][1]+1]);
        snake = newSnake.reverse();
    } else if (dir === "a") {
        snake.pop();
        let newSnake = [...snake].reverse();
        newSnake.push([snake[0][0]-1, snake[0][1]]);
        snake = newSnake.reverse();
    } else if (dir === "d") {
        snake.pop();
        let newSnake = [...snake].reverse();
        newSnake.push([snake[0][0]+1, snake[0][1]]);
        snake = newSnake.reverse();
    }

    // Check if the snake covers the entire screen
    if (snake.length >= boardWidth * boardHeight) {
        // Reset the Snake
        snake = [[Math.floor(boardWidth / 2), Math.floor(boardHeight / 2)], [Math.floor(boardWidth / 2), Math.floor(boardHeight / 2) + 1]];
        longTermTask = "start";
        task = "down";
        currentSnakeCol = bg1;
        currentBg = bg2;
    }

    // Check if snake is out of bounds
    if (snake[0][0] < 0 || snake[0][0] >= boardWidth || snake[0][1] < 0 || snake[0][1] >= boardHeight) {
        // Reset the Snake
        snake = [[Math.floor(boardWidth / 2), Math.floor(boardHeight / 2)], [Math.floor(boardWidth / 2), Math.floor(boardHeight / 2) + 1]];
        longTermTask = "start";
        task = "down";
    }

    // Check if snake has eaten food
    if (snake[0][0] === food[0] && snake[0][1] === food[1]) {
        gen_food()
    }

    background(currentBg);
    fill(currentSnakeCol);

    for (let i = 0; i < snake.length; i++) {
        // Check for consecutive vertical alignment
        let start = i;
        while (i + 1 < snake.length && snake[i][0] === snake[i + 1][0] && snake[i][1] + 1 === snake[i + 1][1]) {
            i++;
        }
        // Draw a single rectangle for the vertical alignment
        if (i > start) {
            rect(snake[start][0] * snakeSize, snake[start][1] * snakeSize, snakeSize, snakeSize * (i - start + 1));
        } else {
            rect(snake[i][0] * snakeSize, snake[i][1] * snakeSize, snakeSize, snakeSize);
        }
    }

    // Draw food
    fill(255, 0, 0);
    rect(food[0]*snakeSize, food[1]*snakeSize, snakeSize, snakeSize);
}

let gen_food = function() {
    // Add to the snake
    snake.push([snake[snake.length-1][0], snake[snake.length-1][1]]);

    // Generate new food anywhere where there is no snake
    let newFood = [Math.floor(Math.random() * boardWidth), Math.floor(Math.random() * boardHeight)];
    while (snake.find(function(e) {
        return e[0] === newFood[0] && e[1] === newFood[1];
    })) newFood = [Math.floor(Math.random() * boardWidth), Math.floor(Math.random() * boardHeight)];

    food = newFood;
}

let navigatingToBottomRight = false;

let updatePos = function() {
    if (task === "down") dir = "s";
    else if (task === "up") dir = "w";
    else if (task === "left") dir = "a";
    else if (task === "right") dir = "d";
}

let ai = function() {
    /*if (snake[0][1] === boardHeight - 1) {
        if (snake[0][0] === 0) {

        } else {
            task = "left";
            updatePos();
            return;
        }
    }
    if (snake[0][0] === boardWidth - 1 && snake[0][1] === boardHeight - 2) {
        task = "down";
        updatePos();
        return;
    }*/

    if (longTermTask === "start") {
        if (snake[0][0] === 1 && snake[0][1] === boardHeight - 1) {
            // Reached the start
            longTermTask = "collect";
        } else {
            if (snake[0][1] === boardHeight - 1) {
                task = "left";
            }
        }
    } else if (longTermTask === "collect") {
        if (snake[0][0] === 0 && snake[0][1] === boardHeight - 1) {
            task = "up";
        } else {
            if (snake[0][1] === 0) {
                if (snake[0][0] % 2 !== 0) {
                    task = "down";
                } else {
                    task = "right";
                }
            } else if (snake[0][1] === boardHeight - 2) {
                if (snake[0][0] % 2 === 0) {
                    task = "up";
                } else {
                    if (snake[0][0] < food[0]) {
                        task = "right";
                    } else {
                        // Return to the start
                        if (navigatingToBottomRight !== true) {
                            if (snake.length < (boardHeight-1)*5) {
                                task = "down";
                                longTermTask = "start";
                            } else {
                                if (snake[0][0] > boardWidth - 5) {
                                    navigatingToBottomRight = true;
                                    ai();
                                } else {
                                    task = "down";
                                    longTermTask = "start";
                                }
                            }
                        } else {
                            if (snake[0][0] === boardWidth - 1) {
                                task = "down";
                                longTermTask = "start";
                            } else {
                                if (snake[0][0] === boardWidth - 1 && snake[0][1] === boardHeight - 1) {
                                    task = "left"
                                    longTermTask = "start";
                                } else {
                                    if (snake[0][0] % 2 === 0) {
                                        if (snake[0][1] === boardHeight - 1) task = "right";
                                        else task = "down";
                                    } else {
                                        if (snake[0][1] === boardHeight - 1) task = "down";
                                        else task = "right";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    } /*else if (longTermTask === "bottom-right") {
        if (snake[0][0] === boardWidth - 1) {
            if (snake[0][1] === boardHeight + 2) {
                // Reached the bottom right
                longTermTask = "start";
                task = "left";
            }
        } else {
            if (snake[0][1] === 0) {
                if (snake[0][0] % 2 !== 0) {
                    task = "down";
                } else {
                    task = "right";
                }
            } else if (snake[0][1] === boardHeight - 2) {
                if (snake[0][0] % 2 === 0) {
                    task = "up";
                } else {
                    task = "right";
                }
            }
        }
    }*/
    updatePos();
}