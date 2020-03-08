import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose, { Schema } from 'mongoose';
import morgan from 'morgan';

const PORT = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

const todoSchema = new mongoose.Schema({
    todo_description: String,
    todo_responsible: String,
    todo_priority: String,
    todo_completed: Boolean
});

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully!");
})

const TodoModel = mongoose.model('Todo', todoSchema);

module.exports = TodoModel;

const todoRoutes = express.Router();

todoRoutes.route('/').get((req, res) => {
    TodoModel.find({}, function (err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    TodoModel.findById(id, function (err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/add').post(function (req, res) {
    let todo = new TodoModel(req.body);
    console.log(`Got a create request for ${JSON.stringify(req.body)}`);
    todo.save()
        .then(todo => {
            res.status(200).json({ 'todo': 'todo added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

todoRoutes.route('/update/:id').post(function (req, res) {
    TodoModel.findById(req.params.id, function (err, todo) {
        if (!todo) {
            res.status(404).send("data is not found");
        } else {
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
        }
    });
});

todoRoutes.route('/remove/:id').post(function (req, res) {
    TodoModel.findById(req.params.id, function (err, todo) {
        if (!todo) {
            res.status(404).send("data is not found");
        } else {
            todo.remove().then(todo => {
                res.json('Todo removed!');
            })
                .catch(err => {
                    res.status(400).send("Remove not possible");
                });
        }
    });
});

app.use('/todos', todoRoutes);

app.listen(PORT, function () {
    console.log("Server is running on Port with: " + PORT);
});