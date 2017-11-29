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
const taskUtils = require("./task_utils");

const app = express();

let pool = mysql.createPool({
    database: config.mysqlConfig.database,
    host: config.mysqlConfig.host,
    user: config.mysqlConfig.user,
    password: config.mysqlConfig.password
});

let daoT = new daoTasks.DAOTasks(pool);
const ficherosEstaticos = path.join(__dirname, "public");

app.use(
    express.static(ficherosEstaticos)
);
app.set("view engine", "ejs");


app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({extended: false}));

app.get("/tasks", (request,response) => {
    //response.sendFile("tasks.html");
    daoT.getAllTasks("usuario@ucm.es", (error, tasks)=>{
        if(error){console.log(error);response.end();
    }else{
        console.log(tasks);
        response.render("tasks", {taskList: tasks})
     }
    }
    )
});

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
    daoT.insertTask("usuario@ucm.es", task, (error, tasks)=>{
        if(error){console.log(error); response.end();}
        else{
            response.redirect("/tasks");
            //console.log(requestBody);
        }
    })
})

app.get("/deleteCompleted", (request, response)=>{
    daoT.deleteCompleted("usuario@ucm.es", (error)=>{
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