const io = require("socket.io-client");

const socket = io("http://localhost:5000"); // Replace with your server URL

socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server:", socket.id);
    
    // Join a room
    socket.emit("join_room", "general");
    console.log("📢 Sent join_room event for 'general' room");

    // Listen for messages
    socket.on("receive_message", (message) => {
        console.log("📩 New Message Received:", message);
    });

    // Send a test message after joining
    setTimeout(() => {
        socket.emit("send_message", {
            senderId: "67cfb2297a7f31769c5c3543",
            room: "general",
            content: "Hello, this is a test message!"
        });
        console.log("📤 Sent a test message");
    }, 2000);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
});
