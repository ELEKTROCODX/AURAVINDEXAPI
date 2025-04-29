import express from 'express';
import cors from 'cors';
import { main_router } from './main.route.js';
import error_handler from './src/config/error_handler.js';
import passport from './src/config/passport/index.js';
import { app_config } from './src/config/app.config.js';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Serve static files from the 'public' directory
app.use('/images/', express.static(path.join(__dirname, 'public/images')));

// Configure Sessions (Optional)
app.use(
    session({
        secret: app_config.jwtSecret,
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/v1/', main_router);
// Default route
app.use('/', (req , res) => {
    res.json({"app": "Aura Vindex"});
} );

// Middleware from error handler
app.use(error_handler);

export default app;