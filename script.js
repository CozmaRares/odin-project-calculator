const maxLineLength = 75;

let openBrackets = 0;
let deleteOnNextEntry = false;

const displayElement = document.getElementById("display");

function addText(text) {
  if (deleteOnNextEntry) {
    displayElement.innerText = "";
    deleteOnNextEntry = false;
  }

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

function evaluateEquation() {
  const str = displayElement.innerText;

  let currentChar;

  const advance = (() => {
    let idx = 0;

    return () => (currentChar = idx < str.length ? str[idx++] : null);
  })();

  advance();

  const binaryOperation = (fn, ops) => {
    const left = fn();

    if (left.error) return { error: left.error };

    let result = left.number;

    while (currentChar !== null) {
      if (!ops.some((op) => op === currentChar)) break;

      const op = currentChar;

      advance();

      const right = fn();

      if (right.error) return { error: right.error };

      result = evaluateOperation(result, right.number, op);
    }

    return { number: result };
  };

  // order of operations (most significant on top):
  // base = number or (term)
  // power =  base ^ base
  // factor = power ( * or / ) power
  // term = factor ( + or - ) factor

  const getNumber = () => {
    let number = "";

    // currentChar is a digit
    while (/\d/.test(currentChar)) {
      number += currentChar;
      advance();
    }

    if (number === "") return { error: true };

    if (currentChar !== ".") return { number: parseInt(number, 10) };

    number += ".";
    advance();

    // currentChar is a digit
    while (/\d/.test(currentChar)) {
      number += currentChar;
      advance();
    }

    // decimal point must be followed by a digit
    if (number[number.length - 1] === ".") return { error: true };

    return { number: parseFloat(number) };
  };

  const base = () => {
    if (/\d/.test(currentChar)) return getNumber();

    if (currentChar === "(") {
      advance();

      const result = evaluateTerm();

      if (currentChar !== ")") return { error: true };

      return result;
    }

    return { error: true };
  };

  const evaluatePower = () => binaryOperation(base, ["^"]);
  const evaluateFactor = () => binaryOperation(evaluatePower, ["*", "/"]);
  const evaluateTerm = () => binaryOperation(evaluateFactor, ["+", "-"]);

  const evaluateOperation = (left, right, op) => {
    switch (op) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
      case "^":
        return Math.pow(left, right);
    }
  };

  debugger;
  const result = evaluateTerm();

  clearDisplay();
  addText(result.error ? "Invalid expression" : result.number);
  deleteOnNextEntry = result.error;
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
