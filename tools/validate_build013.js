const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const campaign = JSON.parse(fs.readFileSync(path.join(root, "campaign_88_missions.json"), "utf8"));
const status = JSON.parse(fs.readFileSync(path.join(root, "BUILD_013_STATUS.json"), "utf8"));
const errors = [];
if (campaign.mission_count !== 88 || campaign.missions.length !== 88) errors.push("Campaign is not exactly 88 missions.");
const ids = campaign.missions.map(m => m.id);
if (new Set(ids).size !== 88) errors.push("Mission IDs are not unique.");
campaign.missions.forEach((m, i) => {
  const expected = `M${String(i + 1).padStart(2, "0")}`;
  if (m.id !== expected) errors.push(`${expected} missing/out of order (found ${m.id}).`);
  if (!m.title || !m.protagonist || !m.location) errors.push(`${m.id} missing required mission metadata.`);
  for (const req of (m.required_previous_missions || [])) {
    if (!ids.includes(req)) errors.push(`${m.id} references missing prerequisite ${req}.`);
  }
});
if (status.build !== "013" || Number(status.phase) < 18) errors.push("Build/phase status mismatch.");
const jsDir = path.join(root, "js");
for (const f of fs.readdirSync(jsDir).filter(f => f.endsWith(".js"))) {
  // Syntax validation is performed by the shell runner below; this script only
  // validates project data contracts without requiring browser globals.
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`PASS: Build ${status.build} Phase ${status.phase}; ${campaign.missions.length} missions; IDs and prerequisites valid.`);
