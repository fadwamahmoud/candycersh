function createBoard(grid, squares, width, candyColors) {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    const randomColor = Math.floor(Math.random * candyColors.length);
    square.style.backgroundColor = candyColors[randomColor];
    square.setAttribute("draggable", true);
    square.setAttribute("id", i);

    grid.appendChild(square);

    squares.push(square);
  }
}

export { createBoard };
