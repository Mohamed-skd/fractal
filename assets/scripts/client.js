export class BrowserFn {
  local(key) {
    const get = () => {
      return JSON.parse(localStorage.getItem(key) ?? "[]");
    };
    const set = (val) => {
      localStorage.setItem(key, JSON.stringify(val));
    };
    return { get, set };
  }
}
export class DomFn {
  isElem(elem, type = HTMLElement) {
    return elem instanceof type;
  }

  select(tag) {
    return document.querySelector(tag);
  }

  selectAll(tag) {
    return Array.from(document.querySelectorAll(tag));
  }

  create(tag, attribs) {
    const elem = document.createElement(tag);
    if (!attribs) return elem;
    for (const [attr, value] of Object.entries(attribs)) {
      elem.setAttribute(attr, value);
    }
    return elem;
  }

  modClass(elem, className, mod = "add") {
    if (!this.isElem(elem)) throw new Error(`Invalid elem: ${elem}.`);

    const mods = {
      add: () => elem.classList.add(className),
      del: () => elem.classList.remove(className),
      tog: () => elem.classList.toggle(className),
    };
    if (!Object.keys(mods).includes(mod))
      throw new Error(`Invalid modifier: ${mod}`);

    mods[mod]();
  }

  go(to, from = window, margeX = 0, margeY = 0) {
    if (!this.isElem(to)) throw new Error(`Invalid elem: ${to}.`);
    from.scroll(to.offsetLeft - margeX, to.offsetTop - margeY);
  }

  removeChildren(parent) {
    if (!this.isElem(parent)) throw new Error(`Invalid parent: ${parent}.`);
    while (parent.firstElementChild) {
      parent.firstElementChild.remove();
    }
  }

  prependHtml(parent, html) {
    if (!this.isElem(parent)) throw new Error(`Invalid parent: ${parent}.`);
    parent.insertAdjacentHTML("afterbegin", html);
  }

  appendHtml(parent, html) {
    if (!this.isElem(parent)) throw new Error(`Invalid parent: ${parent}.`);
    parent.insertAdjacentHTML("beforeend", html);
  }
}
