class Cell {

	constructor(state, x, y, rec_w, rec_h) {

		this.cell_w = cell_w; // Cell size
		this.cell_h = cell_h;
		this.stateusing = 0;
		this.faststore = 0;		// Quick memory for swapping
		this.stateSwap0 = state;	// Swaps back and forth states
		this.stateSwap1 = state;

		this.x = x;		// x,y cartisian point
		this.y = y;
	}


	DrawCell() {

		// 1st Generation of cells starts at startusing = 0

		if (this.stateusing === 0) {

			this.faststore = this.stateSwap0;

		} else if (this.stateusing === 1) {

			this.faststore = this.stateSwap1;
		}

		// Optimization: OFF squares use the background pixels but draw the stroke
		switch (this.faststore) {

			case 1:
				// On
				window.fill(255, 255, 255);
				window.rect(this.x, this.y, this.cell_w, this.cell_h);
				break;

			case 0:
				// off
				window.noFill();
				window.rect(this.x, this.y, this.cell_w, this.cell_h);
				break;

			default:
				throw Error("Unkown state given");

		}

	}

	UserModifyCellState(px, py) {

		// Determine what cell is clicked on
		if (px >= this.x && px <= this.x + this.cell_w && py >= this.y && py <= this.y + this.cell_h) {

			if (this.stateusing === 0) {

				this.stateSwap0 ^= 1;

			} else if (this.stateusing === 1) {

				this.stateSwap1 ^= 1;

			}

		}
	}


}