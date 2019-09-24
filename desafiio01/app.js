const express = require("express");

const server = express();
server.use(express.json());

let numberOfRequests = 0;
const projects = [];

/**
 * Middleware que dá log no número de requisições
 */
function logRequests(req, res, next) {
  numberOfRequests++; //incrementa o numero de requisição
  console.log(`Números de requisições: ${numberOfRequests}`);
  return next();
}

/**
 * Middleware que checa se o projeto existe, para atualização deleção e criação das tarefas
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params; //obtem o id do projeto
  const project = projects.find(p => p.id == id); //procura

  if (!project) {
    //verifica se houve retorno
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

/**
 * Usa o Middleware que monitóra a quantidade de acessos
 */
server.use(logRequests);

/**
 * Projects
 */

/** GET, OBTEM TODOS OS PROJETOS */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/** GET, OBTEM PROJETO POR ID */
server.get("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  return res.json(project);
});

/** POST, CADASTRA UM PROJETO */
server.post("/projects", (req, res) => {
  const { id, title } = req.body; //obtem atraves da destruturação o ID e o title do projeto

  const project = { id, title, task: [] };
  projects.push(project); //alimenta o array de projetos

  return res.json(project);
});

/** PUT, ATUALIZA A INFORMAÇÃO DO PROJETO */
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  //busca o projeto
  const project = projects.find(p => p.id == id);
  project.title = title; //atualiza o titulo

  return res.json(project);
});

/** DELETE, REMOVE UM PROJETO */
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  //busca o index do projeto
  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1); //remove o item

  return res.send();
});

/**
 * Tasks
 */

/** POST, CADASTRA UMA TAREFA PARA DETERMINADO PROJETO */
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  //busca o projeto
  const project = projects.find(p => p.id == id);
  project.task.push(title); // cadastra a tarefa no projeto

  return res.json(project);
});

/**
 * Server
 */
server.listen(3000, () => {
  console.log("Rodando");
});
