import { NumberFn, FetchFn } from "./scripts/lib.js";
import { DomFn } from "./scripts/client.js";
import { errorLog } from "./scripts/base.js";

// UTILS
const numFn = new NumberFn();
const fetchFn = new FetchFn();
const domFn = new DomFn();

// APP
const url = new URL(location.href, location.origin);
const params = url.searchParams;
const canvas = domFn.select("canvas");
const context = canvas.getContext("2d");
const form = domFn.select("form");
const center = [0, 0];
const lineWidth = 10;
const clearSize = Math.max(canvas.width, canvas.height) + 20;
let depth = parseInt(params.get("layers") ?? 5);
let branches = parseInt(params.get("branches") ?? 3);
let size = parseInt(params.get("size") ?? 200);
let baseAngle = parseInt(params.get("base-angle") ?? -90);
let startTime;
let speed = parseInt(params.get("speed") ?? 1);
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
  context.translate(canvas.width / 2, canvas.height / 2);
}
/**
 * Draw a fractal of flakes
 * @param {[number, number]} center Origin point
 * @param {number} branches Number of flake branches
 * @param {number} size Branche size
 * @param {number} width Line width
 * @param {number} depth Number of repetition
 */
function fractale(center, branches, size, width, depth) {
  if (depth === 0) return;

  const angleSect = 360 / branches;
  const nexts = [];
  let angle = baseAngle;

  context.beginPath();
  for (let i = 0; i < branches; i++) {
    const dest = numFn.destPosition(center, angle, size);

    context.lineWidth = width;
    context.strokeStyle = `hsl(${baseAngle}, 100%, 50%)`;
    context.moveTo(center[0], center[1]);
    context.lineTo(dest[0], dest[1]);

    nexts.push(dest);
    angle += angleSect;
  }
  context.stroke();
  context.closePath();

  angle = baseAngle;
  size /= 2;
  width /= 2;
  depth--;
  nexts.forEach((f) => fractale(f, branches, size, width, depth));
}
/**
 * Animation loop
 * @param {DOMHighResTimeStamp} time Time stamp
 */
function loop(time) {
  try {
    if (!startTime) {
      startTime = time;
      return requestAnimationFrame(loop);
    }
    if (time < startTime + 40) return requestAnimationFrame(loop);
    startTime = time;

    context.clearRect(
      -clearSize / 2 - 10,
      -clearSize / 2 - 10,
      clearSize,
      clearSize
    );

    branches = numFn.clamp(branches, 1, 20);
    size = numFn.clamp(size, 50, 1000);
    depth = numFn.clamp(depth, 1, 10);
    fractale(center, branches, size, lineWidth, depth);
    speed = numFn.clamp(speed, 0, 30);
    baseAngle += speed * 0.3 * (direction ? 1 : -1);

    return requestAnimationFrame(loop);
  } catch (err) {
    return errorLog(err);
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
    history.replaceState(null, null, fetchFn.objToHttpReq(payload));
  } catch (err) {
    return errorLog(err);
  }
}

init();
loop();
form.addEventListener("submit", listener);
