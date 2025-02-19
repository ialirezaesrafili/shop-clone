const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { AllRoutes } = require('./router/index.router');

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
            return res.status(404).json({
                statusCode: 404,
                message: 'Nothing found!'
            });
        });

        this.#app.use((error, req, res, next) => {
            const statusCode = error.status || 500;
            const message = error.message || 'Internal Server Error';
            return res.status(statusCode).json({
                statusCode,
                message
            });
        });
    }
};