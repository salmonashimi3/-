const fs = require("fs"), crypto = require("crypto");
const glb = fs.readFileSync("/sessions/modest-focused-lovelace/mnt/uploads/Racing car.glb");
const b64 = glb.toString("base64");
let html = fs.readFileSync("most-wanted-3d.html", "utf8");

if (html.includes('id="raceData"')) { console.log("already present, aborting"); process.exit(0); }

const lines = html.split("\n");
const idx = lines.findIndex(l => l.includes('id="rangeData"'));
if (idx < 0) { console.log("rangeData line not found"); process.exit(1); }
const block = '<script id="raceData" type="text/plain">' + b64 + '</script>';
lines.splice(idx + 1, 0, block);
html = lines.join("\n");

const anchor = "{id:'rangeData',    name:'RANGE ROVER',              gear:'RANGE ROVER', rot:0},";
if (!html.includes(anchor)) { console.log("CAR_MODELS anchor not found"); process.exit(1); }
const add = anchor + "\n  {id:'raceData',     name:'RACING CAR',               gear:'RACE', rot:0},";
html = html.replace(anchor, add);

fs.writeFileSync("most-wanted-3d.html", html);
console.log("done. racing car bytes:", glb.length, "md5:", crypto.createHash("md5").update(glb).digest("hex"));
console.log("CAR_MODELS has raceData:", html.includes("id:'raceData'"));
