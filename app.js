//base
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

//drawing & color option
const textInput = document.getElementById("text");
const lineWidth = document.getElementById("line-width");
const colorOption = Array.from(document.getElementsByClassName("color-option"));
const color = document.getElementById("color");

//font Tool
const fontType = document.getElementById("fontType");
const fontSize = document.getElementById("fontSize");
const fontWeight = document.getElementById("fontWeight");
const textStyleBtn = document.getElementById("textStyle");

// Tool button(pencil, circle, rectangle, text, fill, clean, eraser)
const pencilBtn = document.getElementById("pencil-btn");
const modeBtn = document.getElementById("mode-btn");
const rectangleBtn = document.getElementById("rectangle-btn");
const circleBtn = document.getElementById("circle-btn");
const eraserBtn = document.getElementById("eraser-btn");
const destroyBtn = document.getElementById("destroy-btn");
const textBtn = document.getElementById("text-btn");
const toolBtn = document.getElementsByClassName("tool-btn");
const btns = Array.from(document.getElementsByClassName("tool-btn"));

// save option
const fileInput = document.getElementById("file");
const saveBtn = document.getElementById("save");

const CANVAS_WIDTH = 750;
const CANVAS_HEIGHT = 1000;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

let isPainting = false;
let isFilling = false;
let isFillStyle = false;
let isStrokeStyle = false;
let rectX = 0;
let rectY = 0;

let mode = 0;

function startPainting(event) {
  isPainting = true;
  if (mode === 2) {
    rectX = event.offsetX;
    rectY = event.offsetY;
    ctx.beginPath();
  } else if (mode == 3) {
    rectX = event.offsetX;
    rectY = event.offsetY;
  }
}

function cancelPainting() {
  isPainting = false;
  ctx.beginPath();
}

function onLineWidthChanging(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}

function onColorClick(event) {
  if (mode !== 4) {
    const colorValue = event.target.dataset.color;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue;
  }
}

function onMove(event) {
  if (isPainting) {
    if (mode === 0 || mode === 4) {
      // 0 = pen , 4 = eraser
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
      return;
    } else if (mode === 2) {
      const x = event.offsetX;
      const y = event.offsetY;
      const width = x - rectX;
      const height = y - rectY;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.fillRect(rectX, rectY, width, height);
    } else if (mode === 3) {
      const circleX = event.offsetX;
      const circleWidth = circleX - rectX;
      ctx.arc(rectX, rectY, circleWidth, 0, Math.PI * 2, true);
      ctx.fill();
    }
  }
  ctx.moveTo(event.offsetX, event.offsetY);
}

function onCanvasClick(event) {
  if (mode === 1) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (mode === 5) {
    if (window.confirm("If you choose yes, every work is canceled")) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else if (mode === 6) {
    const text = textInput.value;
    const textFont = fontType.value;
    const textSize = fontSize.value;
    const textWeight = fontWeight.value;
    if (text !== "") {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.font = `${textWeight} ${textSize}px ${textFont}`;
      if (isFillStyle === true) {
        isStrokeStyle === false;
        ctx.fillText(text, event.offsetX, event.offsetY);
      } else {
        isStrokeStyle === true;
        ctx.strokeText(text, event.offsetX, event.offsetY);
      }
      ctx.restore();
    }
  }
}

function onPencilClick(event) {
  mode = 0;
}

function onModeClick() {
  mode = 1;
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onRectangleClick() {
  mode = 2;
  canvas.style.cursor = "crosshair";
}

function onCircleClick() {
  mode = 3;
  canvas.style.cursor = "crosshair";
}

function onEraserClick() {
  mode = 4;
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}

function onDestroyClick() {
  mode = 5;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onTextClick() {
  mode = 6;
}

function onFileChange(event) {
  mode = 7;
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    fileInput.value = null;
  };
}

function onSaveClick() {
  const url = canvas.toDataURL();
  const a = document.createElement("a");
  a.href = url;
  a.download = "MyDrawing.png";
  a.click();
}

const onTextStyleClick = (event) => {
  const text = event.target.innerText;
  if (text === "Stroke") {
    isFillStyle = false;
    isStrokeStyle = true;
    textStyleBtn.innerText = "Fill";
  } else {
    isFillStyle = true;
    isStrokeStyle = false;
    textStyleBtn.innerText = "Stroke";
  }
  console.log(event.target.innerText);
};

function handleToolBtnClick(event) {
  if (event.target.classList[1] === "activated") {
    event.target.classList.remove("activated");
  } else {
    for (i = 0; i < toolBtn.length; i++) {
      toolBtn[i].classList.remove("activated");
    }

    event.target.classList.add("activated");
  }
}

if (canvas) {
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", cancelPainting);
  canvas.addEventListener("mouseleave", cancelPainting);
  canvas.addEventListener("click", onCanvasClick);
}

lineWidth.addEventListener("change", onLineWidthChanging);
color.addEventListener("change", onColorChange);
colorOption.forEach((color) => color.addEventListener("click", onColorClick));
Array.from(btns).forEach((btn) =>
  btn.addEventListener("click", handleToolBtnClick)
);

pencilBtn.addEventListener("click", onPencilClick);
modeBtn.addEventListener("click", onModeClick);
rectangleBtn.addEventListener("click", onRectangleClick);
circleBtn.addEventListener("click", onCircleClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
textBtn.addEventListener("click", onTextClick);
fileInput.addEventListener("change", onFileChange);

saveBtn.addEventListener("click", onSaveClick);
textStyleBtn.addEventListener("click", onTextStyleClick);
