const fs = require("fs"), crypto = require("crypto");
const glb = fs.readFileSync("/sessions/modest-focused-lovelace/mnt/uploads/Police Car-2.glb");
const b64 = glb.toString("base64");
let html = fs.readFileSync("most-wanted-3d.html", "utf8");

const re = /(<script id="policeModelData" type="text\/plain">)[A-Za-z0-9+/=]+(<\/script>)/;
if (!re.test(html)) { console.log("policeModelData block not found"); process.exit(1); }
html = html.replace(re, "$1" + b64 + "$2");

fs.writeFileSync("most-wanted-3d.html", html);
console.log("done. new police bytes:", glb.length, "md5:", crypto.createHash("md5").update(glb).digest("hex"));
