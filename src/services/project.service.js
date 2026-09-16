const projectRepository = require("../repositories/project.repository");
const deliverableRepository = require("../repositories/deliverable.repository");
const workItemRepository = require("../repositories/workItem.repository");
const assignmentRepository = require("../repositories/assignment.repository");
const timeEntryRepository = require("../repositories/timeEntry.repository");
const accountRepository = require("../repositories/account.repository");
const settingRepository = require("../repositories/setting.repository");
const { withZone } = require("../utils/deliverableZone");

async function list(query) {
  return projectRepository.list(query);
}

async function getById(id) {
  const project = await projectRepository.findById(id);
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  const [deliverables, workItems, accounts, settings] = await Promise.all([
    deliverableRepository.listByProject(id),
    workItemRepository.listByProject(id),
    accountRepository.list({ projectId: id }),
    settingRepository.getDefault(),
  ]);

  const thresholds = {
    yellowDays: settings?.yellowDays ?? 7,
    redDays: settings?.redDays ?? 0,
  };

  const works = await Promise.all(
    workItems.map(async (work) => {
      const [assignments, timeEntries] = await Promise.all([
        assignmentRepository.listByWorkItem(work._id),
        timeEntryRepository.listByWorkItem(work._id),
      ]);
      const hours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
      return { ...work.toObject(), assignments, hours };
    }),
  );

  const totalHours = works.reduce((sum, work) => sum + work.hours, 0);

  return {
    ...project.toObject(),
    client: project.clientId,
    deliverables: deliverables.map((item) => withZone(item, thresholds)),
    workItems: works,
    accounts,
    totalHours,
  };
}

function normalizeProject(data) {
  const payload = { ...data };
  if (!payload.code) payload.code = undefined;
  if (!payload.budget) payload.budget = undefined;
  if (!payload.startDate) payload.startDate = undefined;
  if (!payload.endDate) payload.endDate = undefined;
  return payload;
}

function create(data, managerId) {
  if (!data.name || !data.clientId) {
    const error = new Error("Name and client are required");
    error.status = 400;
    throw error;
  }
  return projectRepository.create({ ...normalizeProject(data), managerId });
}

async function update(id, data) {
  const project = await projectRepository.update(id, normalizeProject(data));
  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }
  return project;
}

async function remove(id) {
  await deliverableRepository.deleteMany({ projectId: id });
  const works = await workItemRepository.listByProject(id);
  const workIds = works.map((work) => work._id);
  await assignmentRepository.deleteMany({ workItemId: { $in: workIds } });
  await timeEntryRepository.deleteMany({ workItemId: { $in: workIds } });
  await workItemRepository.deleteMany({ projectId: id });
  await accountRepository.deleteMany({ projectId: id });
  await projectRepository.remove(id);
}

function listLite() {
  return projectRepository.listLite();
}

module.exports = { list, getById, create, update, remove, listLite };
