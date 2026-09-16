const accountRepository = require("../repositories/account.repository");

function list(query) {
  return accountRepository.list(query);
}

function create(data) {
  if (!data.type || !data.date || !data.party || data.amount == null) {
    const error = new Error("Type, date, party, and amount are required");
    error.status = 400;
    throw error;
  }
  return accountRepository.create({
    ...data,
    amount: Number(data.amount),
    gstAmount: Number(data.gstAmount || 0),
    projectId: data.projectId || undefined,
  });
}

function remove(id) {
  return accountRepository.remove(id);
}

function toCsv(entries) {
  const header = ["Date", "Type", "Party", "Project", "Category", "Amount", "GST", "Notes"];
  const rows = entries.map((entry) =>
    [
      new Date(entry.date).toISOString().slice(0, 10),
      entry.type,
      csv(entry.party),
      csv(entry.projectId?.name || ""),
      csv(entry.category || ""),
      entry.amount,
      entry.gstAmount || 0,
      csv(entry.notes || ""),
    ].join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

function csv(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

module.exports = { list, create, remove, toCsv };
