

//apartado 3
//No olvidar
//app.set("view engine", "ejs")
//app.set("views", path.join(__dirname, "views"));
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const bodyParser = require("body-parser");
const config = require("./config");
const daoTasks = require("./dao_tasks");
const DAOUsers = require("./dao_users");
const taskUtils = require("./task_utils");
const session = require("express-session");
const mysqlSession=require("express-mysql-session");

const mySQLStore=mysqlSession(session);

const sessionStore = new mySQLStore({
    database: "tareas",
    host: "localhost",
    user: "root",
    password: ""
});

const middlewareSession = session({
   saveUninitialized: false,
    secret: "agatajulia",
    resave: false,
    store: sessionStore
});



const app = express();
app.use(middlewareSession);
let pool = mysql.createPool({
    database: config.mysqlConfig.database,
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password
});

let daoT = new daoTasks.DAOTasks(pool);
let daoU = new DAOUsers.DAOUsers(pool);

const ficherosEstaticos = path.join(__dirname, "public");

app.use(
    express.static(ficherosEstaticos)
);
app.set("view engine", "ejs");


app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({extended: false}));

app.get("/login.html", (request, response)=>{
    let errorMsg = null;
    response.render("login", {errorMsg:errorMsg});
});

app.post("/login", (request, response)=>{
    daoU.isUserCorrect(request.body.mail, request.body.pass, (error, exito)=>{
        if(error){let errorMsg=error.message;
        response.render("login", {errorMsg:errorMsg});
        }else{
            if(!exito){
                response.render("login", {errorMsg:"Usuario y/o contraseña incorrectos"});
            } else{
                request.session.currentUser = request.body.mail;
                response.redirect("/tasks");
            }
        }
    });
});

function comprobar(request, response, next){
    if(request.session.currentUser){
        response.locals.userEmail = request.body.mail;
        next();
    }else{
        response.redirect("/login.html");
    }
}

app.use(comprobar);



app.post("/finish", (request, response)=> {
    let task = request.body.id;
    daoT.markTaskDone(Number(task), (error, tasks)=>{
        if(error){console.log(error); response.end();}
        else{
            response.redirect("/tasks");}
    })
    
});

app.post("/addTask", (request, response)=>{
    let task = taskUtils.createTask(request.body.taskText);
    task.done = 0;
    daoT.insertTask(request.session.currentUser, task, (error, tasks)=>{
        if(error){console.log(error); response.end();}
        else{
            response.redirect("/tasks");
            //console.log(requestBody);
        }
    })
})



app.get("/imagenUsuario", (request, response)=>{
    daoU.getUserImageName(request.session.currentUser, (error, imagen)=>{
        if(!error){
            if(!imagen){  response.sendFile(path.join(__dirname,"/img","/NoPerfil.png"));}
            else{response.sendFile(path.join(__dirname,"/profile_imgs",imagen));}
          }else{console.log(error);}
    });
})
app.get("/tasks", (request,response) => {
    //response.sendFile("tasks.html");
    daoT.getAllTasks(request.session.currentUser, (error, tasks)=>{
        if(error){console.log(error);response.end();
    }else{
        console.log(tasks);
        response.render("tasks", {taskList: tasks, userEmail:request.session.currentUser})
     }
    }
    )
});
app.get("/deleteCompleted", (request, response)=>{
    daoT.deleteCompleted(request.session.currentUser, (error)=>{
        if(error){ console.log(error); response.end();}
        else{
            response.redirect("/tasks");
        }
    });
})

app.listen(config.port, function (err) {
    if (err) {
        console.log("No se ha podido iniciar el servidor.")
        console.log(err);
    } else {
        console.log(`Servidor escuchando en puerto ${config.port}.`);
    }
});




app.get("/logout", (request, response)=>{
    request.session.destroy();
    response.redirect("/login.html");
});


