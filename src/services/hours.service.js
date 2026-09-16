const workItemRepository = require("../repositories/workItem.repository");
const assignmentRepository = require("../repositories/assignment.repository");
const timeEntryRepository = require("../repositories/timeEntry.repository");
const employeeRepository = require("../repositories/employee.repository");

function list() {
  return workItemRepository.listAll();
}

function create(data) {
  if (!data.projectId || !data.name) {
    const error = new Error("Project and name are required");
    error.status = 400;
    throw error;
  }
  return workItemRepository.create(data);
}

async function logTime(data, user) {
  if (!data.employeeId || !data.workItemId || !data.date || !data.hours) {
    const error = new Error("Employee, work, date, and hours are required");
    error.status = 400;
    throw error;
  }

  if (user.role === "staff") {
    const linked = await employeeRepository.findByUserId(user.id);
    if (!linked || linked._id.toString() !== data.employeeId) {
      const error = new Error("You can only log hours for your own profile");
      error.status = 403;
      throw error;
    }
  }

  const tagged = await assignmentRepository.findPair(data.employeeId, data.workItemId);
  if (!tagged) {
    const error = new Error("This employee is not tagged to that work");
    error.status = 400;
    throw error;
  }

  return timeEntryRepository.create({
    ...data,
    hours: Number(data.hours),
    date: new Date(data.date),
  });
}

async function summary({ range, from, to }) {
  const now = new Date();
  let start = new Date(now.getFullYear(), now.getMonth(), 1);
  let end = now;

  if (range === "week") {
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start = new Date(now);
    start.setDate(now.getDate() + diff);
    start.setHours(0, 0, 0, 0);
  }
  if (range === "all") start = new Date(2000, 0, 1);
  if (range === "custom") {
    if (from) start = new Date(from);
    if (to) {
      end = new Date(to);
      end.setHours(23, 59, 59, 999);
    }
  }

  const entries = await timeEntryRepository.listInRange({ start, end });
  const byEmployee = {};

  entries.forEach((entry) => {
    const id = entry.employeeId?._id?.toString();
    if (!id) return;
    byEmployee[id] = byEmployee[id] || {
      id,
      name: entry.employeeId.name,
      trade: entry.employeeId.trade,
      hours: 0,
      works: new Set(),
    };
    byEmployee[id].hours += entry.hours;
    byEmployee[id].works.add(entry.workItemId?.name);
  });

  return Object.values(byEmployee)
    .map((row) => ({ ...row, works: row.works.size }))
    .sort((a, b) => b.hours - a.hours);
}

module.exports = { list, create, logTime, summary };
