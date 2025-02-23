const http = require('http');
const { Server } = require('socket.io');

// Create an HTTP server
const server = http.createServer();

// Attach Socket.IO to the server
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Maintain the current board state
let boardState = [];

// Listen for client connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send the full board state to the new client
    socket.emit('loadBoard', boardState);

    // Listen for drawing actions from clients
    socket.on('draw', (data) => {
        // Add the new drawing action to the board state
        boardState.push(data);
        // Broadcast the drawing action to all clients, including the sender
        io.emit('draw', data);
    });

    // Listen for clear board events
    socket.on('clearBoard', () => {
        // Reset the board state
        boardState = [];
        // Inform all clients to clear their boards
        io.emit('clearBoard');
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
