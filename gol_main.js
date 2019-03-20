// Cell size (pixels)
let cell_w = 13;
let cell_h = 13;
let Rows;
let Cols;
let grid = [];
let user_paused = 0;
let text_w = 0;
let state;
// Prepare empty 2D grid to be populated with Cell objects
function CreateEmpty2DGrid(row, col) {


	let gridempty = new Array(row);

	for (let r = 0; r < gridempty.length; r++) {
		for (let c = 0; c < col; c++) {

			gridempty[r] = new Array(col);

		}
	}

	return gridempty;
}

// Populate the Empty Grid with Cell Objects
function PopulateGrid(popgrid) {


	for (let c = 0; c < cols; c++) {
		for (let r = 0; r < rows; r++) {

			let x = c * cell_w;
			let y = r * cell_h;
			let ran = floor(random(4));
			if (ran === 2){
				popgrid[c][r] = new Cell(floor(random(2)), x, y, cell_w, cell_h);
			} else {
				popgrid[c][r] = new Cell(0, x, y, cell_w, cell_h);
			}


		}
	}

	return popgrid;
}


function keyPressed() {

	// bit-toggle pause variable
	if (keyCode == 32) { user_paused ^= 1; }


}

function mousePressed() {

	for (let c = 0; c < cols; c++) {
		for (let r = 0; r < rows; r++) {

			grid[c][r].UserModifyCellState(mouseX, mouseY);

		}
	}

}


// Not working that well
// To do: Make drag less sensitive
function mouseDragged() {


	for (let c = 0; c < cols; c++) {
		for (let r = 0; r < rows; r++) {

			grid[c][r].UserModifyCellState(mouseX, mouseY);

		}
	}

}

function setup() {

	createCanvas(1600 + 1, 950 + 1);
	//frameRate(10);
	text_w = (width / 2) - (width / 8);
	rows = floor((height - 21) / cell_h);
	cols = floor((width - 1) / cell_w);
	grid = CreateEmpty2DGrid(cols, rows);
	grid = PopulateGrid(grid);

	// Optimization. Only call stroke once in setup
	stroke(50, 100, 100);
}

// main()
function draw() {
	background(0);
	fill(255)
	textFont('Georgia');
	textSize(16);
	text("<SpaceBar>: Toggle Pause | Left Mouse: Toggle Cell", text_w, height - 5);

	// Draw Cells by stateSwap0 or stateSwap1
	// 1st Generation of cells starts at stat
	for (let c = 0; c < cols; c++) {
		for (let r = 0; r < rows; r++) {

			grid[c][r].DrawCell();

		}
	}

	// Pause bit is user set by spacebar
	if (user_paused === 0) {

		// Compute next cell.state
		for (let c = 0; c < cols; c++) {

			for (let r = 0; r < rows; r++) {

				if (grid[c][r].stateusing === 0) {
					state = grid[c][r].stateSwap0;
				} else if (grid[c][r].stateusing === 1) {
					state = grid[c][r].stateSwap1;
				} else {
					throw Error("Invalid Stateusing");
				}
				// Grab old states

				let neighbors = count(grid, c, r);

				// Game Rules
				if (state === 0 && neighbors === 3) {

					grid[c][r].faststore = 1;

				} else if (state === 1 && (neighbors < 2 || neighbors > 3)) {

					grid[c][r].faststore = 0;

				} else {

					grid[c][r].faststore = state;

				}

				// Swap states and toggle stateusing
				if (grid[c][r].stateusing === 0) {
					grid[c][r].stateSwap1 = grid[c][r].faststore;
				} else if (grid[c][r].stateusing === 1) {
					grid[c][r].stateSwap0 = grid[c][r].faststore;
				} else {
					throw Error("Invalid Stateusing");
				}

				// Toggle 
				grid[c][r].stateusing ^= 1;

			}

		}

	}
}

// Find neighbors
function count(gridx, col, row) {

	let mCols = 0;
	let mRows = 0;
	let neighbors = 0;
	for (let c = -1; c < 2; c++) {
		for (let r = -1; r < 2; r++) {

			mCols = (col + c + cols) % cols;
			mRows = (row + r + rows) % rows;

			if (grid[col][row].stateusing === 0) {

				neighbors += gridx[mCols][mRows].stateSwap0;

			} else {

				neighbors += gridx[mCols][mRows].stateSwap1;

			}

		}

	}
	if (grid[col][row].stateusing === 1) {
		neighbors -= gridx[col][row].stateSwap1;
	} else {
		neighbors -= gridx[col][row].stateSwap0;
	}

	return neighbors;
}