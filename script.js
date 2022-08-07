const maxLineLength = 75;

let openBrackets = 0;

const displayElement = document.getElementById("display");

function addText(text) {
  if (displayElement.innerText.length < maxLineLength)
    displayElement.innerText += text;
  else displayElement.innerText = "Display limit reached";
}

function addBrackets() {
  if (/\d$|\)$/.test(displayElement.innerText) === false) {
    openBrackets++;
    addText("(");
    return;
  }

  if (openBrackets === 0) return;

  openBrackets--;
  addText(")");
  return;
}

function addPower() {
  if (/\d$|\)$/.test(displayElement.innerText) === false) return;

  openBrackets++;
  addText("^(");
}

function clearDisplay() {
  displayElement.innerText = "";
}

function deleteLast() {
  if (displayElement.innerText.length == 0) return;

  displayElement.innerText = displayElement.innerText.slice(
    0,
    displayElement.innerText.length - 1
  );
}

const keys = [
  { key: "0", handler: () => addText("0") },
  { key: "1", handler: () => addText("1") },
  { key: "2", handler: () => addText("2") },
  { key: "3", handler: () => addText("3") },
  { key: "4", handler: () => addText("4") },
  { key: "5", handler: () => addText("5") },
  { key: "6", handler: () => addText("6") },
  { key: "7", handler: () => addText("7") },
  { key: "8", handler: () => addText("8") },
  { key: "9", handler: () => addText("9") }
];

document.addEventListener(
  "keydown",
  (e) => {
    console.log(e.key);

    keys.forEach(({ key, handler }) => {
      if (key == e.key) handler();
    });
  },
  true
);
