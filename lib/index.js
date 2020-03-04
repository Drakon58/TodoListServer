"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = 3000;
var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_bodyParser["default"].json());
var todoSchema = new _mongoose["default"].Schema({
  todo_description: String,
  todo_responsible: String,
  todo_priority: String,
  todo_completed: Boolean
});

_mongoose["default"].connect('mongodb://127.0.0.1:27017/todos', {
  useNewUrlParser: true
});

var connection = _mongoose["default"].connection;
connection.once('open', function () {
  console.log("MongoDB database connection established successfully!");
});

var TodoModel = _mongoose["default"].model('Todo', todoSchema);

module.exports = TodoModel;

var todoRoutes = _express["default"].Router();

todoRoutes.route('/').get(function (req, res) {
  TodoModel.find({}, function (err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});
todoRoutes.route('/:id').get(function (req, res) {
  var id = req.params.id;
  Todo.findById(id, function (err, todo) {
    res.json(todo);
  });
});
todoRoutes.route('/add').post(function (req, res) {
  var todo = new TodoModel(req.body);
  console.log("Got a create request for ".concat(JSON.stringify(req.body)));
  todo.save().then(function (todo) {
    res.status(200).json({
      'todo': 'todo added successfully'
    });
  })["catch"](function (err) {
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
      todo.save().then(function (todo) {
        res.json('Todo updated!');
      })["catch"](function (err) {
        res.status(400).send("Update not possible");
      });
    }
  });
});
app.use('/todos', todoRoutes);
app.listen(PORT, function () {
  console.log("Server is running on Port with: " + PORT);
});
//# sourceMappingURL=index.js.map