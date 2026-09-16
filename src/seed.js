require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connectDb } = require("./config/db");
const { getEnv } = require("./config/env");
const userRepository = require("./repositories/user.repository");
const clientRepository = require("./repositories/client.repository");
const projectRepository = require("./repositories/project.repository");
const deliverableRepository = require("./repositories/deliverable.repository");
const workItemRepository = require("./repositories/workItem.repository");
const employeeRepository = require("./repositories/employee.repository");
const assignmentRepository = require("./repositories/assignment.repository");
const timeEntryRepository = require("./repositories/timeEntry.repository");
const accountRepository = require("./repositories/account.repository");
const settingRepository = require("./repositories/setting.repository");

function daysFromNow(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

async function seed() {
  const env = getEnv();
  await connectDb(env.mongodbUri);

  await Promise.all([
    timeEntryRepository.deleteMany(),
    assignmentRepository.deleteMany(),
    accountRepository.deleteMany(),
    deliverableRepository.deleteMany(),
    workItemRepository.deleteMany(),
    employeeRepository.deleteMany(),
    projectRepository.deleteMany(),
    clientRepository.deleteMany(),
    userRepository.deleteMany(),
    settingRepository.deleteMany(),
  ]);

  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await userRepository.create({
    email: "admin@local",
    name: "Admin",
    passwordHash,
    role: "admin",
  });

  await settingRepository.upsert({ yellowDays: 7, redDays: 0 });

  const acme = await clientRepository.create({
    name: "Ramesh Patel",
    company: "Acme Warehouses Pvt Ltd",
    email: "ramesh@acme.example",
    phone: "9876500001",
    address: "Andheri East, Mumbai",
  });

  const greenfield = await clientRepository.create({
    name: "Sana Khan",
    company: "Greenfield Residences",
    email: "sana@greenfield.example",
    phone: "9876500002",
    address: "Whitefield, Bengaluru",
  });

  const warehouse = await projectRepository.create({
    name: "Acme Warehouse electrical",
    code: "JOB-104",
    clientId: acme._id,
    location: "Bhiwandi, Maharashtra",
    startDate: daysFromNow(-20),
    endDate: daysFromNow(25),
    budget: 1850000,
    status: "active",
    description: "Full electrical fit-out for the new warehouse bay.",
    contactName: "Ramesh Patel",
    contactPhone: "9876500001",
    managerId: admin._id,
  });

  const apartments = await projectRepository.create({
    name: "Greenfield Tower B",
    code: "JOB-118",
    clientId: greenfield._id,
    location: "Whitefield, Bengaluru",
    startDate: daysFromNow(-10),
    endDate: daysFromNow(40),
    budget: 920000,
    status: "active",
    description: "Lighting, DBs, and earthing for Tower B common areas.",
    contactName: "Sana Khan",
    managerId: admin._id,
  });

  const clinic = await projectRepository.create({
    name: "Clinic panel upgrade",
    code: "JOB-121",
    clientId: acme._id,
    location: "Pune",
    startDate: daysFromNow(-5),
    endDate: daysFromNow(12),
    budget: 240000,
    status: "active",
    description: "Replace old DB and add inspection report.",
    managerId: admin._id,
  });

  await deliverableRepository.create({
    projectId: warehouse._id,
    name: "Single-line diagram",
    dueDate: daysFromNow(14),
    isImportant: true,
    status: "in_progress",
  });
  await deliverableRepository.create({
    projectId: warehouse._id,
    name: "Panel wiring completion",
    dueDate: daysFromNow(3),
    isImportant: true,
    status: "in_progress",
  });
  await deliverableRepository.create({
    projectId: apartments._id,
    name: "Earthing test certificate",
    dueDate: daysFromNow(-2),
    isImportant: true,
    status: "in_progress",
  });
  await deliverableRepository.create({
    projectId: clinic._id,
    name: "Inspection report",
    dueDate: daysFromNow(1),
    isImportant: true,
    status: "completed",
  });
  await deliverableRepository.create({
    projectId: apartments._id,
    name: "As-built photos",
    dueDate: daysFromNow(20),
    isImportant: false,
    status: "not_started",
  });

  const works = await Promise.all([
    workItemRepository.create({ projectId: warehouse._id, name: "Panel wiring", status: "in_progress" }),
    workItemRepository.create({ projectId: warehouse._id, name: "Lighting fit-out", status: "in_progress" }),
    workItemRepository.create({ projectId: apartments._id, name: "Earthing", status: "in_progress" }),
    workItemRepository.create({ projectId: clinic._id, name: "DB installation", status: "planned" }),
    workItemRepository.create({ projectId: apartments._id, name: "Final inspection", status: "planned" }),
    workItemRepository.create({ projectId: warehouse._id, name: "Cable pulling", status: "planned" }),
  ]);

  const rajesh = await employeeRepository.create({
    name: "Rajesh Kumar",
    trade: "Electrician",
    phone: "9898900001",
    email: "rajesh@crew.local",
  });

  const meena = await employeeRepository.create({
    name: "Meena Joshi",
    trade: "Helper",
    phone: "9898900002",
  });

  await Promise.all([
    ...works.slice(0, 5).map((work) => assignmentRepository.create({ employeeId: rajesh._id, workItemId: work._id })),
    assignmentRepository.create({ employeeId: meena._id, workItemId: works[1]._id }),
  ]);

  await timeEntryRepository.create({ employeeId: rajesh._id, workItemId: works[0]._id, date: daysFromNow(-6), hours: 8, notes: "Main panel" });
  await timeEntryRepository.create({ employeeId: rajesh._id, workItemId: works[0]._id, date: daysFromNow(-5), hours: 7.5 });
  await timeEntryRepository.create({ employeeId: rajesh._id, workItemId: works[1]._id, date: daysFromNow(-4), hours: 6, notes: "Bay lighting" });
  await timeEntryRepository.create({ employeeId: rajesh._id, workItemId: works[2]._id, date: daysFromNow(-3), hours: 8 });
  await timeEntryRepository.create({ employeeId: rajesh._id, workItemId: works[3]._id, date: daysFromNow(-2), hours: 5 });
  await timeEntryRepository.create({ employeeId: rajesh._id, workItemId: works[4]._id, date: daysFromNow(-1), hours: 4, notes: "Pre-inspection" });
  await timeEntryRepository.create({ employeeId: meena._id, workItemId: works[1]._id, date: daysFromNow(-4), hours: 8 });

  await accountRepository.create({
    type: "invoice",
    date: daysFromNow(-8),
    party: "Acme Warehouses Pvt Ltd",
    amount: 450000,
    gstAmount: 81000,
    projectId: warehouse._id,
    category: "Milestone 1",
  });
  await accountRepository.create({
    type: "receipt",
    date: daysFromNow(-3),
    party: "Acme Warehouses Pvt Ltd",
    amount: 200000,
    projectId: warehouse._id,
    category: "Advance",
  });
  await accountRepository.create({
    type: "expense",
    date: daysFromNow(-5),
    party: "Copper House Electricals",
    amount: 38500,
    gstAmount: 6930,
    projectId: warehouse._id,
    category: "Materials",
  });
  await accountRepository.create({
    type: "payment",
    date: daysFromNow(-1),
    party: "Rajesh Kumar",
    amount: 12000,
    projectId: warehouse._id,
    category: "Labour",
  });

  console.log("Seed complete. Login: admin@local / admin123");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
