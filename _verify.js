const fs = require("fs"), vm = require("vm"), crypto = require("crypto");
const html = fs.readFileSync("most-wanted-3d.html", "utf8");
let h = html.replace(/<script[^>]*type="text\/plain"[^>]*>[\s\S]*?<\/script>/g, "");
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
let m, n = 0, err = 0;
while ((m = re.exec(h))) { n++; try { new vm.Script(m[1]); } catch (e) { err++; console.log("ERR", e.message); } }
console.log("inline scripts:", n, "errors:", err);
const mb = html.match(/id="convData"[^>]*>([A-Za-z0-9+/=]+)<\/script>/);
const buf = Buffer.from(mb[1], "base64");
console.log("embedded convData md5:", crypto.createHash("md5").update(buf).digest("hex"));
console.log("matches upload e60734a5...:", crypto.createHash("md5").update(buf).digest("hex") === "e60734a519571daa0fda9cda38fcc545");
const ids = [...html.matchAll(/\{id:'([a-zA-Z0-9]+)',\s+name:'([^']+)'/g)].map(x => x[1] + "=" + x[2]);
console.log("CAR_MODELS (" + ids.length + "):", ids.join(" | "));
