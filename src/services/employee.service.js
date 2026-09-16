const employeeRepository = require("../repositories/employee.repository");
const assignmentRepository = require("../repositories/assignment.repository");
const timeEntryRepository = require("../repositories/timeEntry.repository");
const workItemRepository = require("../repositories/workItem.repository");

function list() {
  return employeeRepository.list();
}

function listActive() {
  return employeeRepository.list({ activeOnly: true });
}

async function getById(id) {
  const employee = await employeeRepository.findById(id);
  if (!employee) {
    const error = new Error("Employee not found");
    error.status = 404;
    throw error;
  }

  const [assignments, timeEntries] = await Promise.all([
    assignmentRepository.listByEmployee(id),
    timeEntryRepository.listByEmployee(id),
  ]);

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const byProject = {};
  const byWork = {};

  timeEntries.forEach((entry) => {
    const project = entry.workItemId?.projectId;
    const projectId = project?._id?.toString() || "unknown";
    const projectName = project?.name || "Unknown";
    byProject[projectId] = byProject[projectId] || { name: projectName, hours: 0 };
    byProject[projectId].hours += entry.hours;

    const workId = entry.workItemId?._id?.toString();
    byWork[workId] = byWork[workId] || {
      name: entry.workItemId?.name,
      project: projectName,
      hours: 0,
    };
    byWork[workId].hours += entry.hours;
  });

  return {
    ...employee.toObject(),
    assignments,
    timeEntries,
    totalHours,
    byProject: Object.values(byProject),
    byWork: Object.values(byWork),
  };
}

function create(data) {
  if (!data.name || !data.trade) {
    const error = new Error("Name and trade are required");
    error.status = 400;
    throw error;
  }
  return employeeRepository.create(data);
}

async function assign(employeeId, workItemId) {
  const [employee, work] = await Promise.all([
    employeeRepository.findById(employeeId),
    workItemRepository.findById(workItemId),
  ]);
  if (!employee || !work) {
    const error = new Error("Employee or work not found");
    error.status = 404;
    throw error;
  }
  return assignmentRepository.create({ employeeId, workItemId });
}

function unassign(assignmentId) {
  return assignmentRepository.remove(assignmentId);
}

module.exports = { list, listActive, getById, create, assign, unassign };
