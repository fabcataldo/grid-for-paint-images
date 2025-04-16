const COLORS = ["black", "red", "cyan", "purple", "green"];
const DEFAULT_COLOR = "white";
let colorItemCanvasChanged = false;
let activeColor = COLORS[0];
let activeItemsCanvas = [];

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalColorChooser");
  let mainCanvas = document.getElementById("containerCanvas");

  function createAndDrawCanvas() {
    const canvasWidth = mainCanvas.clientWidth;
    const canvasHeight = mainCanvas.clientHeight;
    const itemCanvasSize = 10;
    const itemCanvasBorderSize = 1;
    const itemCanvasTotalSize = itemCanvasSize + 2 * itemCanvasBorderSize;
    const columns = Math.floor(canvasWidth / itemCanvasTotalSize);
    const rows = Math.floor(canvasHeight / itemCanvasTotalSize);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        let itemICanvas = createItemCanvas(i, j);
        mainCanvas.appendChild(itemICanvas);
        setItemCanvasHandlers(itemICanvas);
      }
    }

    mainCanvas.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      if (e.target.classList.contains("item-canvas")) {
        openModalColorChooser(e.target, e.clientX, e.clientY);
      }
    });
  }

  function setItemCanvasHandlers(itemCanvas) {
    itemCanvas.addEventListener("click", () => {
      changeItemCanvasColor(itemCanvas);
    });
  }

  function createItemCanvas(pointX, pointY) {
    const itemCanvas = document.createElement("div");
    itemCanvas.id = `btnItemCanvas${pointX}${pointY}`;
    itemCanvas.className = "item-canvas";
    return itemCanvas;
  }

  function changeItemCanvasColor(itemCanvas) {
    if (
      itemCanvas.style.backgroundColor === DEFAULT_COLOR ||
      !itemCanvas.style.backgroundColor
    ) {
      itemCanvas.style.backgroundColor = activeColor;
      activeItemsCanvas.push(itemCanvas);
    } else {
      const activeItem = activeItemsCanvas.findIndex(
        (item) => item.id.split("s")[1] === itemCanvas.id.split("s")[1]
      );
      activeItemsCanvas[activeItem].style.backgroundColor = DEFAULT_COLOR;
      activeItemsCanvas.splice(activeItem, 1);
    }
  }

  function openModalColorChooser(btnItemCanvas, cursorX, cursorY) {
    modal.style.position = "absolute";
    modal.style.display = "block";
    modal.style.left = `${cursorX}px`;
    modal.style.top = `${cursorY}px`;

    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };

    let hideModalTimeout;
    modal.addEventListener("mouseleave", (e) => {
      hideModalTimeout = setTimeout(() => {
        modal.style.display = "none";
      }, 200);
    });
    modal.addEventListener("mouseenter", () => {
      clearTimeout(hideModalTimeout);
      hideModalTimeout = null;
    });

    for (let i = 0; i < 5; i++) {
      setBtnColorModalChooser(i, btnItemCanvas);
    }

    if (colorItemCanvasChanged) {
      colorItemCanvasChanged = false;
    }
  }

  function setBtnColorModalChooser(indexBtn, btnItemCanvas) {
    let colorBtn = document.getElementById(`color${indexBtn}`);
    colorBtn.onclick = function (e) {
      activeColor = COLORS[indexBtn];
      paintActiveCells();
      modal.style.display = "none";
    };
  }

  function paintActiveCells() {
    for (const cell of activeItemsCanvas) {
      cell.style.backgroundColor = activeColor;
    }
  }

  requestAnimationFrame(() => {
    createAndDrawCanvas();
  });
});
