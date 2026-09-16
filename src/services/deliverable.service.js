const deliverableRepository = require("../repositories/deliverable.repository");
const settingRepository = require("../repositories/setting.repository");
const { withZone } = require("../utils/deliverableZone");

async function getThresholds() {
  const settings = await settingRepository.getDefault();
  return { yellowDays: settings?.yellowDays ?? 7, redDays: settings?.redDays ?? 0 };
}

async function list(zone) {
  const [items, thresholds] = await Promise.all([deliverableRepository.listAll(), getThresholds()]);
  const mapped = items.map((item) => {
    const obj = withZone(item, thresholds);
    obj.project = item.projectId;
    return obj;
  });
  return zone ? mapped.filter((item) => item.zone === zone) : mapped;
}

async function create(data) {
  if (!data.projectId || !data.name || !data.dueDate) {
    const error = new Error("Project, name, and due date are required");
    error.status = 400;
    throw error;
  }
  const created = await deliverableRepository.create({
    ...data,
    isImportant: Boolean(data.isImportant),
  });
  return withZone(created, await getThresholds());
}

async function update(id, data) {
  const updated = await deliverableRepository.update(id, data);
  if (!updated) {
    const error = new Error("Deliverable not found");
    error.status = 404;
    throw error;
  }
  return withZone(updated, await getThresholds());
}

function remove(id) {
  return deliverableRepository.remove(id);
}

module.exports = { list, create, update, remove, getThresholds };
