const express = require("express"); // to create http server
const bodyParser = require("body-parser"); // to parse the body
const fs = require("fs"); // to read and write file
const { findSourceMap } = require("module");
const path = require('path');
const cors = require('cors')

const app = express();

app.use(bodyParser.json()); // middleware
app.use(cors());

// findIndex of an element using the ID
function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

// Remove an element at a given index
function removeAtIndex(arr, index) {
  let newArray = [];
  for (let i = 0; i < arr.length; i++) {
    if (i !== index) newArray.push(arr[i]);
  }
  return newArray;
}

// post the data in the file
app.post("/todos", (req, res) => {
  // create a newTodo to push to todos array
  const newTodo = {
    id: Math.floor(Math.random() * 1000000), // Generate a random id
    title: req.body.title, // Get tile from json body in file
    description: req.body.description, // Get description from json body in the file
  };

  // read data from the file and put it in todos array
  fs.readFile("record.json", "utf8", (err, data) => {
    if (err) throw err;
    // JSON.parse() converts the string into json format
    const todos = JSON.parse(data); // ("[]") => []
    todos.push(newTodo);
    // write the newTodo to the existing file
    //   json.stringify converts the json object to string format
    fs.writeFile("record.json", JSON.stringify(todos), (err) => {
      if (err) throw err;
      res.status(201).json(newTodo);
    });
  });
});

// Get all the available todos in the file
app.get("/todos", (req, res) => {
  // Read file for all the todos
  fs.readFile("record.json", "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// Get a todo from a specific ID
app.get("/todos/:id", (req, res) => {
  fs.readFile("record.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    // Using findIndex function to get the index of the element from the id
    const todoIndex = findIndex(todos, parseInt(req.params.id)); // parseInt converts an string to an integer
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      res.json(todos[todoIndex]);
    }
  });
});

// Deleting an element from the file using ID
app.delete("/todos/:id", (req, res) => {
  fs.readFile("record.json", "utf8", (err, data) => {
    if (err) throw err;
    const todos = JSON.parse(data);
    const todoIndex = findIndex(todos, parseInt(req.params.id));
    if (todoIndex === -1) {
      res.status(404).send();
    } else {
      todos = removeAtIndex(todos, todoIndex);
      fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
        if (err) throw err;
        res.status(200).send();
      });
    }
  });
});


app.get("/",(req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})

// Middleware to return 404 status code for all the other routes
app.use((req, res, next) => {
  res.status(404).send();
});

// Listening on 3000 port
app.listen(3000);
