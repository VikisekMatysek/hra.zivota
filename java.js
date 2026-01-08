let rows = 15;
let cols = 15;
let playing = false;
let timer; // Pro automatické spouštění

document.addEventListener('DOMContentLoaded', () => {
    createTable();
    setupControlButtons();
});

function createTable() {
    let gridContainer = document.getElementById("gridContainer");
    let table = document.createElement("table");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            // Funkce pro kliknutí na buňku
            cell.onclick = function() {
                if (this.className === "dead") {
                    this.className = "alive";
                } else {
                    this.className = "dead";
                }
            };
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function setupControlButtons() {
    let startBtn = document.getElementById('start'); // Předpokládám, že máš v HTML <button id="start">
    if (startBtn) {
        startBtn.onclick = () => {
            playing = !playing;
            startBtn.innerHTML = playing ? "Stop" : "Start";
            if (playing) play();
        };
    }
}

function play() {
    if (!playing) return;
    computeNextGeneration();
    timer = setTimeout(play, 500); // Každých 0.5 sekundy nová generace
}

function computeNextGeneration() {
    let nextGrid = [];
    
    // Nejprve si vypočítáme, co se stane v dalším kroku
    for (let i = 0; i < rows; i++) {
        nextGrid[i] = [];
        for (let j = 0; j < cols; j++) {
            let neighbors = countNeighbors(i, j);
            let currentCell = document.getElementById(i + "_" + j).className;

            if (currentCell === "alive") {
                // Pravidla pro přežití
                nextGrid[i][j] = (neighbors === 2 || neighbors === 3) ? "alive" : "dead";
            } else {
                // Pravidlo pro zrození
                nextGrid[i][j] = (neighbors === 3) ? "alive" : "dead";
            }
        }
    }

    // Poté najednou překreslíme celou tabulku
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            document.getElementById(i + "_" + j).className = nextGrid[i][j];
        }
    }
}

function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue; // Nepočítáme sami sebe
            let r = row + i;
            let c = col + j;
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                if (document.getElementById(r + "_" + c).className === "alive") {
                    count++;
                }
            }
        }
    }
    return count;
}