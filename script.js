const equationsHistory = [];
const historyElement = document.getElementById("history");

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

  const result = evaluateTerm();

  clearDisplay();
  addText(result.error ? "Invalid expression" : result.number);
  deleteOnNextEntry = result.error;

  //update history
  equationsHistory.push({ equation: str, result: result.number });

  if (equationsHistory.length > 10) equationsHistory.unshift();

  historyElement.innerHTML = "";
  equationsHistory.forEach(
    (entry, idx) =>
      (historyElement.innerHTML += `<li onclick="setFromHistory(${idx})"><p>${entry.equation}</p> = ${entry.result}</li>`)
  );
}

function setFromHistory(idx) {
  clearDisplay();
  addText(equationsHistory[idx].equation);
}

const keys = [
  { key: "c", buttonId: "clear" },
  { key: "C", buttonId: "clear" },
  { key: "(", buttonId: "brackets" },
  { key: ")", buttonId: "brackets" },
  { key: "Backspace", buttonId: "backspace" },
  { key: "^", buttonId: "power" },
  { key: "/", buttonId: "divide" },
  { key: "*", buttonId: "multiply" },
  { key: "-", buttonId: "subtract" },
  { key: "+", buttonId: "plus" },
  { key: "=", buttonId: "equals" },
  { key: "Enter", buttonId: "equals" },
  { key: "0", buttonId: "zero" },
  { key: "1", buttonId: "one" },
  { key: "2", buttonId: "two" },
  { key: "3", buttonId: "three" },
  { key: "4", buttonId: "four" },
  { key: "5", buttonId: "five" },
  { key: "6", buttonId: "six" },
  { key: "7", buttonId: "seven" },
  { key: "8", buttonId: "eight" },
  { key: "9", buttonId: "nine" },
  { key: ".", buttonId: "decimal" },
  { key: "h", buttonId: "history-btn" }
];

document.addEventListener(
  "keydown",
  (e) => {
    keys.forEach(({ key, buttonId }) => {
      if (key !== e.key) return;

      const btn = document.getElementById(buttonId);

      btn.classList.add("active");

      setTimeout(() => {
        btn.classList.remove("active");
      }, 50);

      btn.click();
    });
  },
  true
);

function toggleHistory() {
  document.getElementById("history").classList.toggle("active");
}
