const fs = require("fs"), crypto = require("crypto");
const glb = fs.readFileSync("/sessions/modest-focused-lovelace/mnt/uploads/Kart.glb");
const b64 = glb.toString("base64");
let html = fs.readFileSync("most-wanted-3d.html", "utf8");

if (html.includes('id="kartData"')) { console.log("already present, aborting"); process.exit(0); }

const lines = html.split("\n");
const idx = lines.findIndex(l => l.includes('id="convData"'));
if (idx < 0) { console.log("convData line not found"); process.exit(1); }
const block = '<script id="kartData" type="text/plain">' + b64 + '</script>';
lines.splice(idx + 1, 0, block);
html = lines.join("\n");

const anchor = "{id:'convData',     name:'CONVERTIBLE',              gear:'CONVERTIBLE', rot:0},";
if (!html.includes(anchor)) { console.log("CAR_MODELS anchor not found"); process.exit(1); }
const add = anchor + "\n  {id:'kartData',     name:'GO-KART',                  gear:'KART', rot:0},";
html = html.replace(anchor, add);

fs.writeFileSync("most-wanted-3d.html", html);
console.log("done. kart bytes:", glb.length, "md5:", crypto.createHash("md5").update(glb).digest("hex"));
console.log("CAR_MODELS has kartData:", html.includes("id:'kartData'"));
