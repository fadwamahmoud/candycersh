document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const width = 8;
  const squares = [];
  const candyColors = ["red", "blue", "green", "yellow", "orange", "purple"];
  let selectedColor;
  let selectedSquareId;
  let replacedColor;
  let replacedSquareId;

  createBoard();

  function calculateValidMoves(id) {
    return [id + 1, id + width, id - 1, id - width];
  }

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      const randomColor = Math.floor(Math.random() * candyColors.length);
      square.style.backgroundColor = candyColors[randomColor];
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);

      grid.appendChild(square);

      squares.push(square);
    }
  }
  function createEvents() {
    squares.forEach((s) => {
      s.addEventListener("dragstart", dragStart);
      s.addEventListener("dragend", dragEnd);
      //   s.addEventListener("dragstop");

      s.addEventListener("dragover", dragOver);

      //   s.addEventListener("dragenter");

      //   s.addEventListener("dragleave");
      //   s.addEventListener("drop");
    });
  }
  function dragStart() {
    selectedColor = this.style.backgroundColor;
    selectedSquareId = parseInt(this.id);
    console.log(selectedSquareId);
  }
  function dragOver() {
    replacedColor = this.style.backgroundColor;
    replacedSquareId = parseInt(this.id);
  }

  function dragEnd() {
    const validMoves = calculateValidMoves(selectedSquareId);
    const isValidMove = validMoves.includes(replacedSquareId);
    const isBlank = replacedColor === "" || selectedColor === "";
    if (isValidMove && !isBlank) {
      squares[replacedSquareId].style.backgroundColor = selectedColor;
      squares[selectedSquareId].style.backgroundColor = replacedColor;
    }
  }

  function checkForMatchingRows() {
    let squaresInRowCount = 0;

    for (let i = 0; i < width * width - 1; i++) {
      const isMultipleOfWidth = (i + 1) % width === 0;
      const isBlank = squares[i].style.backgroundColor === "";
      const similarInRow =
        squares[i].style.backgroundColor ===
        squares[i + 1].style.backgroundColor;

      if (similarInRow && !isBlank && !isMultipleOfWidth) {
        squaresInRowCount++;
      } else if (squaresInRowCount < 2) {
        squaresInRowCount = 0;
      } else {
        for (let j = i - squaresInRowCount; j <= i; j++) {
          squares[j].style.backgroundColor = "";
        }
        squaresInRowCount = 0;
      }
    }
  }
  function checkForMatchingColumns() {
    let squaresInColumnCount = 0;
    // original  to reset the i count everytime it finishes a column
    let originalI = 0;
    // width -2 to stop it at the 6th row
    for (let i = 0; i < width * (width - 1); i += width) {
      // console.log({ i });
      const resetColumn = i - width * (width - 2) === originalI;
      const lastRow = i + width === originalI + (width * width - 1);

      const isBlank = squares[i].style.backgroundColor === "";
      const similarInColumn = squares[i + width]
        ? squares[i].style.backgroundColor ===
          squares[i + width].style.backgroundColor
        : false;

      console.log({ resetColumn }, { i });
      if (similarInColumn && !isBlank) {
        squaresInColumnCount++;
        // console.log({ i });
      } else if (squaresInColumnCount < 2) {
        squaresInColumnCount = 0;
      }
      if (squaresInColumnCount >= 2 && (resetColumn || !similarInColumn)) {
        // squaresInColumn - 1 in case of resetcolumn cause we're still in the square before last
        // in !similarIncolumn we're in the last square
        for (let j = i - squaresInColumnCount * width; j <= i; j += width) {
          // console.log({ i });
          // console.log({ j });
          // console.log({ squaresInColumnCount });
          // console.log({ resetColumn });
          squares[j].style.backgroundColor = "";
        }
        squaresInColumnCount = 0;
      }

      // console.log({ resetColumn }, i);
      if (resetColumn) {
        // console.log({ i }, { originalI });
        originalI++;
        // - widthh because next iteration will be i+=width
        i = originalI - width;
      }
    }
  }

  createEvents();
  window.setInterval(checkForMatchingRows, 5000);
  window.setInterval(checkForMatchingColumns, 5000);
});
