import { NumberFuncs, DomFuncs, FetchFuncs } from "./client.js";
import { error } from "./base.js";

const numFn = new NumberFuncs();
const domFn = new DomFuncs();
const fetchFn = new FetchFuncs();

export class Notification {
  /**
   * Notification DOM elem
   * @param {string} content Notification
   * @param {string} type Notification type
   * @param {number} delay Delay (in seconds) before removing the notification
   */
  constructor(content, type, delay = 2) {
    try {
      const notifications = domFn.select("#notifications");
      if (!domFn.isElem(notifications))
        throw new Error(`Invalid DOM root: ${notifications}.`);

      const p = domFn.create("p");
      this.content = content;
      this.type = type;
      this.delay = delay;

      if (this.type) domFn.modClass(p, this.type);
      p.textContent = this.content;
      notifications.append(p);
      setTimeout(() => {
        p.remove();
      }, 1000 * this.delay);
    } catch (err) {
      error(err);
    }
  }
}
export class ThemeSetter {
  static isSet = false;

  /**
   * Set Dark Theme button
   * @param {HTMLElement[]} elems
   */
  constructor(elems = null) {
    try {
      if (ThemeSetter.isSet) throw new Error("Already Set.");
      ThemeSetter.isSet = true;

      const themeDom = domFn.select("#theme");
      if (!domFn.isElem(themeDom))
        throw new Error(`Invalid DOM root: ${themeDom}.`);

      const mediaScheme = matchMedia("(prefers-color-scheme:dark)");
      const button = domFn.create("button", { title: "THEME" });
      this.elems = elems;
      this.histTheme = fetchFn.local("dark-theme");
      this.darkTheme = this.histTheme.get() ?? mediaScheme.matches;

      this.setTheme();
      themeDom.append(button);
      button.addEventListener("click", this.togTheme.bind(this));
      mediaScheme.addEventListener("change", () => {
        this.darkTheme = mediaScheme.matches;
        this.setTheme();
      });
    } catch (err) {
      error(err);
    }
  }

  setTheme() {
    if (this.darkTheme) {
      document.documentElement.style.colorScheme = "dark";
      if (this.elems?.length) {
        for (let i = 0; i < this.elems.length; i++) {
          domFn.modClass(this.elems[i], "dark");
        }
      }
    } else {
      document.documentElement.style.colorScheme = "light";
      if (this.elems?.length) {
        for (let i = 0; i < this.elems.length; i++) {
          domFn.modClass(this.elems[i], "dark", "del");
        }
      }
    }
    this.histTheme.set(this.darkTheme);
  }

  togTheme() {
    this.darkTheme = !this.darkTheme;
    this.setTheme();
  }
}
export class SectionsSetter {
  static isSet = false;

  constructor() {
    try {
      if (SectionsSetter.isSet) throw new Error("Already set.");
      SectionsSetter.isSet = true;

      const navPage = domFn.select("#nav-page");
      let liste;
      if (navPage) {
        liste = domFn.create("ul", { class: "flex" });
        navPage.append(liste);
      }

      const sections = domFn.selectAll("main > section");
      if (!sections.length) throw new Error(`No sections: ${sections}.`);

      for (const sect of sections) {
        if (!domFn.isElem(sect)) continue;

        const id = sect.id.trim();
        if (!id) continue;

        const name = id[0].toUpperCase() + id.replace("-", " ").slice(1);
        const title = domFn.create("h2");
        title.textContent = name;
        sect.prepend(title);

        if (domFn.isElem(liste)) {
          const listElem = domFn.create("li");
          const link = domFn.create("a", {
            class: "link",
            href: `#${id}`,
            target: "_self",
          });
          link.textContent = name;
          listElem.append(link);
          liste.append(listElem);
        }
      }
    } catch (err) {
      error(err);
    }
  }
}
export class Copyright {
  static isSet = false;

  /**
   * Copyright DOM elem
   * @param {string} content Copyright info
   * @param {{ref:string, content:string}} link Copyright link
   * @param {number} startDate Start of dating frame
   */
  constructor(
    content = "Par ",
    link = { ref: "https://moh-sd.free.nf/", content: "Moh. SD" },
    startDate
  ) {
    try {
      if (Copyright.isSet) throw new Error("Already set.");
      Copyright.isSet = true;

      const copyright = domFn.select("#copyright");
      if (!domFn.isElem(copyright))
        throw new Error(`Invalid DOM root: ${copyright}.`);

      const date = new Date();
      this.content = content;
      this.link = link;

      copyright.textContent = "";
      if (!this.content && !this.link) {
        copyright.textContent = `© ${
          startDate ? startDate + " -" : ""
        } ${date.getFullYear()}`;
      } else if (!this.link) {
        copyright.append(
          this.content,
          ` © ${startDate ? startDate + " -" : ""} ${date.getFullYear()}`
        );
      } else {
        const anchor = domFn.create("a", {
          href: this.link.ref,
          class: "link",
        });
        anchor.textContent = this.link.content;
        copyright.append(
          this.content,
          anchor,
          ` © ${startDate ? startDate + " -" : ""} ${date.getFullYear()}`
        );
      }
    } catch (err) {
      error(err);
    }
  }
}
export class TopButton {
  static isSet = false;

  constructor() {
    try {
      if (TopButton.isSet) throw new Error("Already set.");
      TopButton.isSet = true;

      const topBt = domFn.select("#to-top");
      if (!domFn.isElem(topBt)) throw new Error(`Invalid DOM root: ${topBt}.`);

      topBt.addEventListener("click", () => scroll(0, 0));
    } catch (err) {
      error(err);
    }
  }
}
export class Canvas {
  /**
   * Boosted Canvas elem
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    try {
      if (!(canvas instanceof HTMLCanvasElement))
        throw new Error(`Invalid canvas element: ${canvas}.`);

      this.canvas = canvas;
      this.ctxt = canvas.getContext("2d");
      this.ctxt.translate(this.canvas.width / 2, this.canvas.height / 2);
    } catch (err) {
      error(err);
    }
  }

  /**
   * Clear canvas
   * @param {[number, number]} point Origin point
   * @param {number} size Size of clearing zone
   */
  clear(
    point = [0, 0],
    size = Math.max(this.canvas.width, this.canvas.height)
  ) {
    this.ctxt.clearRect(
      point[0] - size / 2 - 10,
      point[1] - size / 2 - 10,
      size + 20,
      size + 20
    );
  }

  /**
   * Return ccs style color
   * @param {number} h Hue
   * @param {number} s Saturation
   * @param {number} l Lightness
   * @param {number} a Alpha
   * @returns
   */
  getColor(h, s, l, a = 1) {
    a = numFn.clamp(a, 0, 1);
    return `hsl(${h}, ${s}%, ${l}%, ${a})`;
  }

  /**
   * Return canvas linear gradient
   * @param {[number, number]} src Origin point
   * @param {number} angle Angle in degree
   * @param {number} size Gradient size
   * @param {{offset:number, color:[number, number, number]}[]} styles Gradient colors layers
   * @returns
   */
  getLinearGradient(src, angle, size, styles) {
    const dest = numFn.destPosition(src, angle, size);
    const gradient = this.ctxt.createLinearGradient(
      src[0],
      src[1],
      dest[0],
      dest[1]
    );

    for (let i = 0; i < styles.length; i++) {
      gradient.addColorStop(
        styles[i].offset,
        this.getColor(...styles[i].color)
      );
    }
    return gradient;
  }

  /**
   * Draw a line
   * @param {[number, number]} point Origin point
   * @param {number} angle Angle in degree
   * @param {number} length Line size
   * @param {[number, number, number]} style Hsl color
   * @returns
   */
  line(point = [0, 0], angle = 0, length = 50, style = [0, 0, 0]) {
    const [toX, toY] = numFn.destPosition(point, angle, length);
    this.ctxt.strokeStyle = this.getColor(...style);
    this.ctxt.beginPath();
    this.ctxt.moveTo(point[0], point[1]);
    this.ctxt.lineTo(toX, toY);
    this.ctxt.stroke();
    this.ctxt.closePath();

    return [toX, toY];
  }

  /**
   * Draw a triangle
   * @param {[number, number]} point Origin point
   * @param {number} size Triangle base size
   * @param {[number, number, number]} style Hsl color
   * @returns
   */
  triangle(point = [0, 0], size = 50, style = [0, 0, 0]) {
    const height = Math.tan(numFn.degToRad(60) * Math.PI) * (size / 2);
    const summits = [];
    let angle = 0;

    point = [point[0] - size / 2, point[1] + height / 2];
    this.ctxt.strokeStyle = this.getColor(...style);
    this.ctxt.beginPath();
    this.ctxt.moveTo(point[0], point[1]);
    for (let i = 0; i < 3; i++) {
      const [x, y] = numFn.destPosition(point, angle, size);
      this.ctxt.lineTo(x, y);
      point[0] = x;
      point[1] = y;
      angle += -120;
      summits.push([x, y]);
    }
    this.ctxt.stroke();
    this.ctxt.closePath();

    return summits;
  }

  /**
   * Draw a square
   * @param {[number, number]} point Origin point
   * @param {number} size Square base size
   * @param {[number, number, number]} style Hsl color
   * @returns
   */
  square(point = [0, 0], size = 50, style = [0, 0, 0]) {
    this.ctxt.strokeStyle = this.getColor(...style);
    this.ctxt.beginPath();
    this.ctxt.rect(point[0] - size / 2, point[1] - size / 2, size, size);
    this.ctxt.stroke();
    this.ctxt.closePath();

    return [
      [point[0] - size / 2, point[1] - size / 2],
      [point[0] + size / 2, point[1] - size / 2],
      [point[0] + size / 2, point[1] + size / 2],
      [point[0] - size / 2, point[1] + size / 2],
    ];
  }

  /**
   * Draw a circle
   * @param {[number, number]} point Origin point
   * @param {number} size Radius size
   * @param {[number, number, number]} style Hsl color
   */
  circle(point = [0, 0], size = 50, style = [0, 0, 0]) {
    this.ctxt.strokeStyle = this.getColor(...style);
    this.ctxt.beginPath();
    this.ctxt.arc(
      point[0],
      point[1],
      size / 2,
      0,
      numFn.degToRad(360) * Math.PI
    );
    this.ctxt.stroke();
    this.ctxt.closePath();
  }

  /**
   * Draw a path
   * @param {[number, number][]} points Path points
   * @param {[number, number, number]} style Hsl color
   */
  path(points, style = [0, 0, 0]) {
    this.ctxt.strokeStyle = this.getColor(...style);
    this.ctxt.beginPath();
    for (let i = 0; i < points.length; i++) {
      this.ctxt.lineTo(points[i][0], points[i][1]);
    }
    this.ctxt.stroke();
    this.ctxt.closePath();
  }
}
export class Share {
  static isSet = false;
  link;
  notification;

  /**
   * Share buttons (copy link to clipboard)
   * @param {string} btText Buttons text content
   * @param {string} notification Notification to display when buttons are clicked
   * @param {string} link The link to share
   */
  constructor(btText, notification, link) {
    try {
      if (Share.isSet) throw new Error("Already Set.");
      Share.isSet = true;

      this.link = link;
      this.notification = notification;
      const bts = domFn.selectAll(".share");
      bts.forEach((bt) => {
        domFn.modClass(bt, "bt");
        bt.textContent = btText;
        bt.addEventListener("click", this.listener.bind(this));
      });
    } catch (err) {
      error(err);
    }
  }

  async listener() {
    try {
      this.link = this.link ? this.link : location.href;
      await navigator.clipboard.writeText(this.link);
    } catch (err) {
      return error(err);
    }
    if (this.notification) new Notification(this.notification, "success");
  }
}
