const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findRepository(req, res, next) {
  const { id } = req.params;
  const repository = repositories.find(repository => repository.id == id);
  if (!repository)
    return res.status(400).json({ error: "Repository not found" });
  req.repository = repository;
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    likes: 0,
    title, url, techs,
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", findRepository, (request, response) => {
  const { title, url, techs } = request.body;
  request.repository.title = title;
  request.repository.url = url;
  request.repository.techs = techs;
  return response.json(request.repository);
});

app.delete("/repositories/:id", findRepository, (request, response) => {
  repositories.splice(repositories.indexOf(request.repository), 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", findRepository, (request, response) => {
  request.repository.likes++;
  return response.json(request.repository);
});

module.exports = app;
