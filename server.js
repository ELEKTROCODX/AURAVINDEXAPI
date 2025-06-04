// Import packages and configs
import app from './app.js';
import { app_config } from './src/config/app.config.js';
import 'dotenv/config';
import {connectToDatabase, disconnectFromDatabase} from './src/config/database_connection.js';
import http from 'http';
import {Server} from 'socket.io';
//import {socketMiddleware} from ''

// HTTP server
const server = http.createServer(app);

// New Socket.IO instance
const io = new Server(server, {
    cors: {
        origin: '*' // Allow request from any origin
    }
});

// Socket middleware
//socketMiddleware(io);

const startServer = async () => {
    try {
        await connectToDatabase();

        server.listen(app_config.port, () => {
            console.log(`Server is running on port ${app_config.port}`);
            
        });

        process.on('SIGINT', async () => {
            console.log("Gracefully shutting down");
            await disconnectFromDatabase();
            server.close(() => {
                console.log("Server closed");
                process.exit(0);
            });
        });
    } catch (error) {
        console.log("Failed to start server: ", error);
        process.exit(1);
    }
}
startServer();