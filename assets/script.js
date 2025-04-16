import { error } from "./scripts/base.js";
import { NumberFuncs, DomFuncs, FetchFuncs } from "./scripts/client.js";
import { Copyright, Canvas, Share, ThemeSetter } from "./scripts/lib.js";

// UTILS
const numFn = new NumberFuncs();
const domFn = new DomFuncs();
const fetchFn = new FetchFuncs();

// APP
new Copyright();
new ThemeSetter();
new Share("Partager", "Lien copié !");

// fractale
const url = new URL(location.href, location.origin);
const params = url.searchParams;
const domCvs = domFn.select("canvas");
const form = domFn.select("form");
const canvas = new Canvas(domCvs);
const center = [0, 0];
let depth = parseInt(params.get("layers") ?? 5);
let branches = parseInt(params.get("branches") ?? 5);
let size = parseInt(params.get("size") ?? 100);
let baseAngle = parseInt(params.get("base-angle") ?? 0);
let startTime;
let speed = parseInt(params.get("speed") ?? 0);
let direction = params.get("direction") === "true" ? true : false;

function init() {
  const formDepth = domFn.select(`input[name="layers"]`);
  const formBranches = domFn.select(`input[name="branches"]`);
  const formSize = domFn.select(`input[name="size"]`);
  const formBaseAngle = domFn.select(`input[name="base-angle"]`);
  const formSpeed = domFn.select(`input[name="speed"]`);
  const formDirection = domFn.select(`input[name="direction"]`);

  formDepth.value = depth;
  formBranches.value = branches;
  formSize.value = size;
  formBaseAngle.value = baseAngle;
  formSpeed.value = speed;
  formDirection.checked = direction;
}
/**
 * Draw a fractal of flakes
 * @param {[number, number]} center Origin point
 * @param {number} branches Number of flake branches
 * @param {number} size Branche size
 * @param {number} width Line width
 * @param {number} depth Number of repetition
 * @returns
 */
function fractale(center, branches, size, width, depth) {
  if (depth === 0) return;

  const angleSect = 360 / branches;
  const nexts = [];
  let angle = baseAngle;

  for (let i = 0; i < branches; i++) {
    canvas.ctxt.lineWidth = width;
    nexts.push(canvas.line(center, angle, size, [baseAngle, 100, 50]));
    angle += angleSect;
  }

  angle = baseAngle;
  size /= 2;
  width /= 2;
  depth--;
  nexts.forEach((f) => fractale(f, branches, size, width, depth));
}
/**
 * Animation loop
 * @param {DOMHighResTimeStamp} time Time stamp
 * @returns
 */
function loop(time) {
  try {
    if (!startTime) {
      startTime = time;
      return requestAnimationFrame(loop);
    }
    if (time < startTime + 20) return requestAnimationFrame(loop);
    startTime = time;

    canvas.clear();
    size = numFn.clamp(size, 0, Infinity);
    fractale(center, branches, size, 2, depth);
    speed = numFn.clamp(speed, 0, Infinity);
    baseAngle += direction ? speed * 0.5 : speed * 0.5 * -1;

    return requestAnimationFrame(loop);
  } catch (err) {
    return error(err);
  }
}
/**
 * Form Listener
 * @param {SubmitEvent} e Event
 */
function listener(e) {
  try {
    e.preventDefault();
    const data = new FormData(form);
    depth = parseInt(data.get("layers"));
    branches = parseInt(data.get("branches"));
    size = parseInt(data.get("size"));
    baseAngle = parseInt(data.get("base-angle"));
    speed = parseInt(data.get("speed"));
    direction = !!data.get("direction");

    const payload = {
      layers: depth,
      branches,
      size,
      "base-angle": baseAngle,
      speed,
      direction,
    };
    history.replaceState(null, null, `?${fetchFn.objToReq(payload)}`);
  } catch (err) {
    return error(err);
  }
}

init();
loop();
form.addEventListener("submit", listener);
