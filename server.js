// Package definitions
    
    require("dotenv").config();
    const express = require("express");
    const session = require("express-session");
    const store = new session.MemoryStore();
    const fs = require("fs");
    const bcrypt = require("bcrypt");
    let users = require("./users.json");


// App configuration

    const app = express();
    app.use(express.json());
    app.disable("x-powered-by");
    app.use(express.urlencoded({
        extended: false
    }));
    app.use(session({
        secret: process.env.ExpressSessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {},
        store
    }));


// Variables

    const saltRounds = 10;

    const frontendFolder = __dirname + "/frontend";


// Event listeners

    // Login and signup

        app.get("/api/session", (request, response) => {
            response.status(200).send(request.session);
        });

        app.post("/api/login", async (request, response) => {
            const {username, password} = request.body;
            if(
                !username
                || !password
            ){
                response.status(400).send({
                    message: "Request body missing username or password."
                });
                return;
            }
            if(!getUserByUsername(username)){
                response.status(404).send({
                    message: "User could not be found."
                });
                return;
            }
            if(
                !(
                    await bcrypt.compare(
                        password,
                        getUserByUsername(username).password
                    )
                )
            ){
                response.status(401).send({
                    message: "Invalid credentials."
                });
                return;
            }
            let user = structuredClone(getUserByUsername(username));
            if(user.hasOwnProperty("password")) delete user.password;
            request.session.user = user;
            response.status(200).send({
                message: "Successful login."
            });
            console.log(user.username + " logged in");
        });

        app.post("/api/signup", async (request, response) => {
            const {email, username, fullName, password} = request.body;
            if(
                !email
                || !username
                || !fullName
                || !password
            ){
                response.status(400).send({
                    message: "Request body missing email, username, full name or password."
                });
                return;
            }
            if(getUserByEmail(email)){
                response.status(400).send({
                    message: "User with this email already exists."
                });
                return;
            }
            if(getUserByUsername(username)){
                response.status(400).send({
                    message: "User with this username already exists."
                });
                return;
            }
            users.push({
                id: users.length,
                email,
                username,
                fullName,
                password: await bcrypt.hash(password, saltRounds)
            });
            fs.writeFileSync(
                "./users.json",
                JSON.stringify(
                    users,
                    null,
                    4
                )
            )
            response.status(200).send({
                message: "User successfully registered."
            });
        });

        app.get("/api/logout", (request, response) => {
            if(request.session.hasOwnProperty("user")) delete request.session.user;
            response.status(200).send({
                message: "User successfully logged out."
            });
        });

    // Fallback & frontend

        app.get("/", (request, response) => {
            response.status(200).sendFile(frontendFolder + "/index.html");
        });

        app.all("*", (request, response) => {
            if(fs.existsSync(frontendFolder + request.url)){
                response.status(200).sendFile(frontendFolder + request.url);
                return;
            }
            if(fs.existsSync(frontendFolder + request.url + ".html")){
                response.status(200).sendFile(frontendFolder + request.url + ".html");
                return;
            }
            response.status(200).sendFile(frontendFolder + "/page-not-found.html");
        });

    // Hosting

        const port = 4000;
        app.listen(port, "0.0.0.0", () => {
            console.log("Server is online!");
        });
    

// Functions

    // User fetch

        function getUserByUsername(query){
            if(users.some(user => user.username == query)) return users.find(user => user.username == query);
            return false;
        }

        function getUserByEmail(query){
            if(users.some(user => user.email == query)) return users.find(user => user.email == query);
            return false;
        }