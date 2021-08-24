const Board = require("../models/board");
const mongoose = require("mongoose");
const fs = require("fs"); 
const path = require("path");
const moment = require("moment");

const saveTask = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send("Process failed : Incomplete data");

  const board = new Board({
    userId: req.user._id,
    name: req.body.name,
    description: req.body.description,
    taskStatus: "to-do",
  });
  

  const result = await board.save();
  if (!result)
    return res.status(400).send("Process failed: Failed to register task");
  return res.status(200).send({ result });
};

const listTask = async (req, res) => {
  const board = await Board.find({ userId: req.user._id });
  if (!board || board.length === 0)
    return res.status(400).send("Process faildes: No task");
  return res.status(200).send({ board });
};

const saveTaskImg = async (req, res) =>{}

const updateTask = async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.taskStatus ||
    !req.body.description
  )
    return res.status(400).send("Process failed: Incomplete data");

    let board = await Board.findByIdAndUpdate(req.body._id, {
      userId: req.user._id,
      name: req.body.name,
      description: req.body.description,
      taskStatus: req.body.taskStatus
    });

    if(!board) return res.status(400).send("Process failed: Task not found");
    return res.status(200).send({ board }); 

};

const deleteTask = async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(400).send("Process failed: Invalid id");

  const board = await Board.findByIdAndDelete(req.params._id);
  if (!board) return res.status(400).send("Process failed: Task not found");
  return res.status(200).send("Task deleted");
};

module.exports = { saveTask, listTask, updateTask, deleteTask ,saveTaskImg};
