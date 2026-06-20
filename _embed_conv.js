const fs = require("fs");
const glb = fs.readFileSync("/sessions/modest-focused-lovelace/mnt/uploads/Convertible-2.glb");
const b64 = glb.toString("base64");
let html = fs.readFileSync("most-wanted-3d.html", "utf8");

if (html.includes('id="convData"')) { console.log("already present, aborting"); process.exit(0); }

// 1) insert embedded GLB block right after the carModelData block
const lines = html.split("\n");
const idx = lines.findIndex(l => l.includes('id="carModelData"'));
if (idx < 0) { console.log("carModelData line not found"); process.exit(1); }
const block = '<script id="convData" type="text/plain">' + b64 + '</script>';
lines.splice(idx + 1, 0, block);
html = lines.join("\n");

// 2) add to CAR_MODELS array after the camaro entry
const anchor = "gear:'CAMARO ZL1', rot:2, fine:-0.55}, // 180° + fine tweak (auto-orient was crabbing)";
if (!html.includes(anchor)) { console.log("CAR_MODELS anchor not found"); process.exit(1); }
const add = anchor + "\n  {id:'convData',     name:'CONVERTIBLE',              gear:'CONVERTIBLE', rot:0},";
html = html.replace(anchor, add);

fs.writeFileSync("most-wanted-3d.html", html);
console.log("done. convData bytes:", glb.length, "b64 len:", b64.length);
console.log("CAR_MODELS has convData:", html.includes("id:'convData'"));
