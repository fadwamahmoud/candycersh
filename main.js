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
  function getRandomImageURL() {
    const randomNum = Math.floor(Math.random() * candyColors.length);
    const randomColor = candyColors[randomNum];
    const imageUrl = `./images/${randomColor}-candy.png`;
    const io = `url(${imageUrl})`;
    console.log({ io });
    return io;
  }

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.style.backgroundImage = getRandomImageURL();
      console.log({ square });
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
    selectedColor = this.style.backgroundImage;
    selectedSquareId = parseInt(this.id);
    console.log(selectedSquareId);
  }
  function dragOver() {
    replacedColor = this.style.backgroundImage;
    replacedSquareId = parseInt(this.id);
  }

  function dragEnd() {
    const validMoves = calculateValidMoves(selectedSquareId);
    const isValidMove = validMoves.includes(replacedSquareId);
    const isBlank = replacedColor === "" || selectedColor === "";
    if (isValidMove && !isBlank) {
      squares[replacedSquareId].style.backgroundImage = selectedColor;
      squares[selectedSquareId].style.backgroundImage = replacedColor;
    }
  }

  function checkForMatchingRows() {
    let squaresInRowCount = 0;

    for (let i = 0; i <= width * width - 1; i++) {
      const endOfRow = (i + 1) % width === 0;
      const isBlank = squares[i].style.backgroundImage === "";
      const similarInRow = squares[i + 1]
        ? squares[i].style.backgroundImage ===
          squares[i + 1].style.backgroundImage
        : false;

      // console.log({ endOfRow }, { i });
      if (similarInRow && !isBlank && !endOfRow) {
        squaresInRowCount++;
      } else if (squaresInRowCount < 2) {
        squaresInRowCount = 0;
      }
      if (squaresInRowCount >= 2 && (!similarInRow || endOfRow)) {
        for (let j = i - squaresInRowCount; j <= i; j++) {
          squares[j].style.backgroundImage = "";
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
    for (let i = 0; i < width * width; i += width) {
      let resetColumn = i - width * (width - 1) === originalI;

      const isBlank = squares[i].style.backgroundImage === "";
      const similarInColumn = squares[i + width]
        ? squares[i].style.backgroundImage ===
          squares[i + width].style.backgroundImage
        : false;
      if (similarInColumn) {
        squaresInColumnCount++;
      } else if (squaresInColumnCount < 2) {
        squaresInColumnCount = 0;
      }
      if (squaresInColumnCount >= 2 && (resetColumn || !similarInColumn)) {
        // squaresInColumn - 1 in case of resetcolumn cause we're still in the square before last
        // in !similarIncolumn we're in the last square
        const newI = i;
        for (
          let j = newI - squaresInColumnCount * width;
          j <= newI;
          j += width
        ) {
          squares[j].style.backgroundImage = "";
        }
        squaresInColumnCount = 0;
      }

      if (resetColumn) {
        originalI++;
        // - widthh because next iteration will be i+=width
        // or else i would start from second row
        i = originalI - width;
        squaresInColumnCount = 0;
      }
    }
  }

  function moveAndGenerate() {
    for (let i = 0; i < width * (width - 1); i++) {
      moveDown(i);
      generateNew(i);
    }
  }
  function moveDown(i) {
    const isLowerBlank = squares[i + width].style.backgroundImage === "";
    if (isLowerBlank) {
      // console.log(squares[i].backgroundImage);
      squares[i + width].style.backgroundImage =
        squares[i].style.backgroundImage;
      squares[i].style.backgroundImage = "";
      generateNew(i);
    }
  }

  function generateNew(i) {
    const isBlank = squares[i].style.backgroundImage === "";
    const firstRow = [...Array(width).keys()];
    const isInFirstRow = firstRow.includes(i);

    if (isInFirstRow && isBlank) {
      squares[i].style.backgroundImage = getRandomImageURL();
    }
  }

  createEvents();
  window.setInterval(() => {
    moveAndGenerate();
    checkForMatchingRows();
    checkForMatchingColumns();
  }, 100);
});
