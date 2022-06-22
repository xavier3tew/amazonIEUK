let cols = 10; 
let rows = 10; 

let grid = new Array(cols);
let openSet = []; 
let closedSet = []; 
let obstacles=[];
let start;
let end; 
let path = [];

function heuristic(position0, position1) {
  let d1 = Math.abs(position1.x - position0.x);
  let d2 = Math.abs(position1.y - position0.y);

  return d1 + d2;
}

function GridPoint(x, y) {
  this.x = x; 
  this.y = y; 
  this.f = 0; 
  this.g = 0; 
  this.h = 0; 
  this.neighbors = []; 
  this.parent = undefined; 
  this.obstacle =false;
   
  this.updateNeighbors = function (grid) {
    let i = this.x;
    let j = this.y;
    if (i < cols - 1 && !grid[i+1][j].obstacle) {
      this.neighbors.push(grid[i + 1][j]);
      if (j < rows - 1  && !grid[i+1][j+1].obstacle) {
        this.neighbors.push(grid[i+1][j + 1]);
      }
      if (j > 0  && !grid[i+1][j-1].obstacle) {
        this.neighbors.push(grid[i+1][j - 1]);
      }
    }
    if (i > 0  && !grid[i-1][j].obstacle) {
      this.neighbors.push(grid[i - 1][j]);
      if (j < rows - 1  && !grid[i-1][j+1].obstacle) {
        this.neighbors.push(grid[i-1][j + 1]);
      }
      if (j > 0  && !grid[i-1][j-1].obstacle) {
        this.neighbors.push(grid[i-1][j - 1]);
      }
    }
    if (j < rows - 1  && !grid[i][j+1].obstacle) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0  && !grid[i][j-1].obstacle) {
      this.neighbors.push(grid[i][j - 1]);
    }
  };
}

function init() {

  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  while (obstacles.length<40){
    let x=Math.floor(Math.random() * (rows-1));
    let y=Math.floor(Math.random() * (cols-1));
    if (x==0 && y ==0){
        continue
    }
    if (x==rows-1 && y ==cols-1){
        continue
    }
    for(let i =0; i < obstacles.length; i ++){
        if(obstacles[i*2]==x){
            if (obstacles[i*2+1]==y){
                continue
            }
        }
    }
    obstacles.push(x,y)
}
  console.log(obstacles)
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new GridPoint(i, j);
    }
}
for(let i =0; i < obstacles.length/2; i ++){
  grid[obstacles[i*2]][obstacles[i*2+1]].obstacle=true;
}

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].updateNeighbors(grid);
    }
  }

  start = grid[0][0];
  end = grid[cols - 1][rows - 1];

  openSet.push(start);

  console.info(grid);
}


function search() {
  init();
  while (openSet.length > 0) {
  
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    let current = openSet[lowestIndex];

    if (current === end) {
      let temp = current;
      path.push(temp);
      while (temp.parent) {
        path.push(temp.parent);
        temp = temp.parent;
      }
      console.log("DONE!");
      return path.reverse();
    }

    openSet.splice(lowestIndex, 1);
    closedSet.push(current);

    let neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor)) {
        let possibleG = current.g + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (possibleG >= neighbor.g) {
          continue;
        }

        neighbor.g = possibleG;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
      }
    }
  }

  return [];
}

let solution=search();
if (solution){
  solution.forEach(e => console.log("("+e.x +"," +e.y+"),"))
}else {
  console.log("no solution possible")
}
