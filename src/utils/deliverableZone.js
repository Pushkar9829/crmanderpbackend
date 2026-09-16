function daysUntilDue(dueDate, today = new Date()) {
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const now = new Date(today);
  now.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - now.getTime()) / 86_400_000);
}

function getDeliverableZone(deliverable, thresholds = { yellowDays: 7, redDays: 0 }, today = new Date()) {
  if (deliverable.status === "completed") return "done";
  if (!deliverable.isImportant) return "none";

  const daysLeft = daysUntilDue(deliverable.dueDate, today);
  if (daysLeft <= thresholds.redDays) return "red";
  if (daysLeft <= thresholds.yellowDays) return "yellow";
  return "green";
}

function withZone(deliverable, thresholds) {
  const item = typeof deliverable.toObject === "function" ? deliverable.toObject() : { ...deliverable };
  item.zone = getDeliverableZone(item, thresholds);
  return item;
}

module.exports = { daysUntilDue, getDeliverableZone, withZone };
