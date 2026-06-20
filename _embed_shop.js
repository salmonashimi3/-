const fs = require("fs"), crypto = require("crypto");
let html = fs.readFileSync("most-wanted-3d.html", "utf8");
const U = "/sessions/modest-focused-lovelace/mnt/uploads/";

function embed(id, file, afterId) {
  if (html.includes('id="' + id + '"')) { console.log(id + " already present"); return; }
  const glb = fs.readFileSync(U + file);
  const b64 = glb.toString("base64");
  const lines = html.split("\n");
  const idx = lines.findIndex(l => l.includes('id="' + afterId + '"'));
  if (idx < 0) { console.log("anchor " + afterId + " not found"); process.exit(1); }
  lines.splice(idx + 1, 0, '<script id="' + id + '" type="text/plain">' + b64 + '</script>');
  html = lines.join("\n");
  console.log(id, "embedded", glb.length, "bytes md5", crypto.createHash("md5").update(glb).digest("hex"));
}

embed("f40v2Data", "DREAM FERRARI F40 2.0.glb", "raceData");
embed("bananaData", "cartoon banana car.glb", "f40v2Data");

fs.writeFileSync("most-wanted-3d.html", html);
console.log("written.");
