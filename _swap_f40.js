const fs = require("fs"), crypto = require("crypto");
const glb = fs.readFileSync("/sessions/modest-focused-lovelace/mnt/uploads/Ferrari F40.glb");
const b64 = glb.toString("base64");
let html = fs.readFileSync("most-wanted-3d.html", "utf8");

// 1) replace the f40Data embedded base64
const re = /(<script id="f40Data" type="text\/plain">)[A-Za-z0-9+/=]+(<\/script>)/;
if (!re.test(html)) { console.log("f40Data block not found"); process.exit(1); }
html = html.replace(re, "$1" + b64 + "$2");

// 2) reset F40 orientation to auto (new model has proper wheel naming)
const oldEntry = "{id:'f40Data',      name:'FERRARI F40',              gear:'F40', rot:2},          // 180°: front was facing camera";
const newEntry = "{id:'f40Data',      name:'FERRARI F40',              gear:'F40', rot:0},          // new model: wheel auto-orient";
if (html.includes(oldEntry)) html = html.replace(oldEntry, newEntry);
else console.log("WARN: f40 CAR_MODELS entry not matched (rot left as-is)");

fs.writeFileSync("most-wanted-3d.html", html);
console.log("done. new F40 bytes:", glb.length, "md5:", crypto.createHash("md5").update(glb).digest("hex"));
