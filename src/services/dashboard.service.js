const projectRepository = require("../repositories/project.repository");
const deliverableRepository = require("../repositories/deliverable.repository");
const timeEntryRepository = require("../repositories/timeEntry.repository");
const settingRepository = require("../repositories/setting.repository");
const { withZone } = require("../utils/deliverableZone");

async function getDashboard() {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const [activeProjects, deliverables, hourAgg, recent, settings] = await Promise.all([
    projectRepository.countActive(),
    deliverableRepository.listAll(),
    timeEntryRepository.sumHours({ start: startOfMonth }),
    projectRepository.recent(5),
    settingRepository.getDefault(),
  ]);

  const thresholds = {
    yellowDays: settings?.yellowDays ?? 7,
    redDays: settings?.redDays ?? 0,
  };

  const zoned = deliverables.map((item) => {
    const obj = withZone(item, thresholds);
    obj.project = item.projectId;
    return obj;
  });

  return {
    activeProjects,
    red: zoned.filter((item) => item.zone === "red"),
    yellow: zoned.filter((item) => item.zone === "yellow"),
    greenCount: zoned.filter((item) => item.zone === "green").length,
    hoursThisMonth: hourAgg[0]?.total || 0,
    recentProjects: recent,
    atRisk: [...zoned.filter((item) => item.zone === "red"), ...zoned.filter((item) => item.zone === "yellow")].slice(
      0,
      8,
    ),
  };
}

async function getSettings() {
  const settings = await settingRepository.getDefault();
  return { yellowDays: settings?.yellowDays ?? 7, redDays: settings?.redDays ?? 0 };
}

function saveSettings(data) {
  const yellowDays = Number(data.yellowDays);
  const redDays = Number(data.redDays);
  if (!Number.isFinite(yellowDays) || yellowDays < 1) {
    const error = new Error("Yellow zone days must be at least 1");
    error.status = 400;
    throw error;
  }
  return settingRepository.upsert({ yellowDays, redDays: Number.isFinite(redDays) ? redDays : 0 });
}

module.exports = { getDashboard, getSettings, saveSettings };
