const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { AllRoutes } = require('./router/index.router');
const morgan = require('morgan');
const createError = require('http-errors');

module.exports = class Application {
    #app = express();
    #DB_URI;
    #PORT;

    constructor(PORT, DB_URI) {
        this.#PORT = PORT;
        this.#DB_URI = DB_URI;
        this.configApplication();
        this.connectToMongoDB();
        this.createServer();
        this.createRoutes();
        this.errorHandling();
    }

    configApplication() {
        this.#app.use(morgan("dev"));
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use(express.static(path.join(__dirname, '..', 'public')));
    }

    createServer() {
        const http = require('http');
        http.createServer(this.#app)
            .listen(this.#PORT, () => {
                console.log(`[RUN] http://localhost:${this.#PORT}`);
            });
    }

    async connectToMongoDB() {
        
            const connections = await mongoose.connect(this.#DB_URI)
            .then(()=> console.log(`Connected to MONGODB!`))
            .catch((err)=> console.error(`Error during connecting to MONGODB ${err.message}`))
            
            return connections;
        
       
    }

    createRoutes() {
        this.#app.use(AllRoutes);
    }

    errorHandling() {
        this.#app.use((req, res, next) => {
            next(createError.NotFound('Nothing found!'));
        });

        this.#app.use((error, req, res, next) => {
            const serverError = createError.InternalServerError();
            const statusCode = error.status || serverError.status;
            const message = error.message;
            return res.status(statusCode).json({
                error: {
                    statusCode,
                    message
                }
            });
        });
    }
};