import projects from "../models/project.js";
let _projects = projects;

export function getProjects(req, res, err) {
  let body = {};
  if (req.query.id) body = _projects[req.query.id];
  else body = _projects;
  res.send(body);
}

export function addProject(req, res, err) {
  const project = req.body.project;
  _projects.push(project);
  console.log(`new project: ${project}`);
  const pid = { project_id: _projects.length - 1 };
  res.send(pid);
}

export function editProject(req, res, err) {
  const pid = req.query.id;
  _projects[pid] = req.body.project;
  res.send(_projects[pid]);
}

export function deleteProject(req, res, err) {
  const pid = req.query.id;
  console.log(`pid: ${pid}`);
  
  res.sendStatus(200);
}
