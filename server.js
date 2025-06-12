// Import packages and configs
import app from './app.js';
import { app_config } from './src/config/app.config.js';
import { apiLogger } from './src/config/util.js';
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
            apiLogger.info(`Server is running on port ${app_config.port}`);
            
        });

        process.on('SIGINT', async () => {
            apiLogger.info("Gracefully shutting down");
            await disconnectFromDatabase();
            server.close(() => {
                apiLogger.info("Server closed");
                process.exit(0);
            });
        });
    } catch (error) {
        apiLogger.error("Failed to start server: " + error);
        process.exit(1);
    }
}
startServer();