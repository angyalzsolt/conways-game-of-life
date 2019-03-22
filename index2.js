
// Set up the board
const ctx = document.getElementById('canvas').getContext('2d');
function setUpTheBoard(){
	ctx.fillStyle = 'lightgrey';
	ctx.fillRect(0,0, 800, 500);

	for(let i=0; i<800; i+=20){
		ctx.moveTo(i, 0);
		ctx.lineTo(i, 500);
		ctx.stroke();
	};

	for(let i=0; i<500; i+=20){
		ctx.moveTo(0, i);
		ctx.lineTo(800, i);
		ctx.stroke();
	};
}
setUpTheBoard();

// width and height to a cell
const box = {width:19, height:19};
// the bacic, starting pattern
let cellArrayOne = [
	{x:200, y:200},
	{x:200, y:220},
	{x:200, y:240},
	{x:180, y:240},
	{x:160, y:220}
		];
// empty array to store the changes		
let cellArrayTwo = [];		

// choose a pattern
document.getElementById('patterns').addEventListener('click', (e)=>{
	let pattern = e.target.id;
	if(pattern === 'blinker'){
		cellArrayOne = [
			{x:200, y:200},
			{x:200, y:220},
			{x:200, y:240}
		];
	} else if(pattern === 'toad'){
		cellArrayOne = [
			{x:200, y:220},
			{x:220, y:220},
			{x:240, y:220},
			{x:180, y:200},
			{x:200, y:200},
			{x:220, y:200}
		];
	} else if(pattern === 'glider'){
		cellArrayOne = [
			{x:200, y:200},
			{x:200, y:220},
			{x:200, y:240},
			{x:180, y:240},
			{x:160, y:220}
		];
	} else if (pattern === 'r_pentomino'){
		cellArrayOne = [
			{x:200, y:200},
			{x:200, y:220},
			{x:200, y:240},
			{x:180, y:220},
			{x:220, y:200}
		];
	} else if (pattern === 'penta_decathlon'){
		cellArrayOne = [
			{x:200, y:200},
			{x:220, y:200},
			{x:240, y:180},
			{x:240, y:220},
			{x:260, y:200},
			{x:280, y:200},
			{x:300, y:200},
			{x:320, y:200},
			{x:340, y:180},
			{x:340, y:220},
			{x:360, y:200},
			{x:380, y:200}
		];
	};
	setUpTheBoard();
	printLive(cellArrayOne);
})


// start the simulation
document.getElementById('startGame').addEventListener('click',(e)=>{
	runner = true;
	if(cellArrayOne.length > 0){
			start();
		} else {
			console.log('Choose a pattern');
		}
})

document.getElementById('resetGame').addEventListener('click',(e)=>{
	cellArrayOne = [];
	cellArrayTwo = [];
	runner = false;
	setUpTheBoard();
})

// boolean to stop the setTimeout
let runner = true;

printLive(cellArrayOne);


function start(){
	if(runner){
	setTimeout(function x(){
	// show the basic array
	printLive(cellArrayOne);
	// clear the storing array
	cellArrayTwo = [];
	// arrays to store the livingcell's dead neighbors
	let allDeadNeighbor = [];
	let filteredAllDeadNeighbor = [];
	// check every cell in the basic array
	cellArrayOne.forEach((cell)=>{
		// get a cell's all neighbors(8)
		let z = getNeighbors(cell.x, cell.y);
		// get only the living ones
		let livingNeighbors = getAliveNeighbors(z);
		// get the dead neighbors
		let deadNeighbors = getDeadNeighbors(z);
		// push all dead neighbors to an array
		allDeadNeighbor.push(deadNeighbors);
		// if a cell has 2 or 3 living neighbor goes to the new array, otherwise it dies
		if(livingNeighbors.length == 2 || livingNeighbors.length == 3){
			cellArrayTwo.push(cell);
		} else {
			printDead(cell.x, cell.y);
		};
	})
	// filter out the duplicates from the array which contains all dead neighbor
	filteredAllDeadNeighbor = allDeadNeighbor.flat();
	filteredAllDeadNeighbor = filteredAllDeadNeighbor.filter((thing, index, self)=>
		index === self.findIndex((cell)=> (
			cell.x === thing.x && cell.y === thing.y
		))
	);
	// check every cell's dead neighbor in the basic array(decide which going to born, or stay as it is)
	filteredAllDeadNeighbor.forEach((cell)=>{
		// get a cell all neighbors(8)
		let z = getNeighbors(cell.x, cell.y);
		// get only the living ones
		let livingNeighbors = getAliveNeighbors(z);
		// if a  dead cell has exactly 3 living neighbor, it born(become alive)
		if(livingNeighbors.length == 3){
			cellArrayTwo.push(cell);
		};
	});
	// print out the the new array
	// setTimeout(printLive.bind(null, cellArrayTwo), 1000);
	printLive(cellArrayTwo);
	// overwrite the first array with the second one
	cellArrayOne = cellArrayTwo;
	start();
	}, 100);
} else {
	console.log('the game is stopped');
}
}

// print live cells
function printLive(array){
	ctx.fillStyle='blue';
	array.forEach((cell)=>{
		ctx.fillRect(cell.x, cell.y, box.width, box.height);
	});
}

// print the dead cells
function printDead(x,y){
	ctx.fillStyle = 'red';
	ctx.fillRect(x,y,box.width,box.height);
};

// get the all neighbors
function getNeighbors(x, y){
	let nextCells = [
		{x:x-20, y:y},
		{x:x-20, y:y-20},
		{x:x, y:y-20},
		{x:x+20, y:y-20},
		{x:x+20, y:y},
		{x:x+20, y:y+20},
		{x:x, y:y+20},
		{x:x-20, y:y+20}
	];
	return nextCells
};


// get the dead neighbors
function getDeadNeighbors(array){
	let result = array.filter((cell)=>{
		return !cellArrayOne.some((cell2)=>{
			return cell.x === cell2.x && cell.y === cell2.y;
		});
	});
	return result;
};
// get a cell all alive neighbors
function getAliveNeighbors(array){
	let result = array.filter((cell)=>{
		return cellArrayOne.some((cell2)=>{
			return cell.x === cell2.x && cell.y === cell2.y;
		});
	});
	return result;
};

