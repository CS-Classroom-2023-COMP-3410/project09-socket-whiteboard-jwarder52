// Connect to the Socket.IO server
const socket = io('http://localhost:3000');

// Get references to DOM elements
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');

let drawing = false;
let currentColor = colorPicker.value;
let currentBrushSize = brushSize.value;

// Update color selection
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// Update brush size
brushSize.addEventListener('input', (e) => {
    currentBrushSize = e.target.value;
});

// Mouse events for drawing
canvas.addEventListener('mousedown', () => {
    drawing = true;
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;

    const x = e.offsetX;
    const y = e.offsetY;

    // Emit drawing data to the server
    socket.emit('draw', { x, y, color: currentColor, size: currentBrushSize });
});

// Function to draw on the canvas
function drawOnCanvas(x, y, color, size) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Listen for drawing events from the server
socket.on('draw', (data) => {
    drawOnCanvas(data.x, data.y, data.color, data.size);
});

// Clear board event
clearBtn.addEventListener('click', () => {
    // Emit clear event to the server
    socket.emit('clearBoard');
});

// Listen for clear board events from the server
socket.on('clearBoard', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Load the existing board state when connected
socket.on('loadBoard', (boardState) => {
    boardState.forEach((data) => {
        drawOnCanvas(data.x, data.y, data.color, data.size);
    });
});
