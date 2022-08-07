const maxLineLength = 75;

const displayElement = document.getElementById("display");

function a() {
  if (displayElement.innerText.length < maxLineLength)
    displayElement.innerText += "4";
}
