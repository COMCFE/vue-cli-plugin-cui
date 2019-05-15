export default {
  write(name, value, expires, path, domain, secure) {
    const cookie = [];

    cookie.push(name + "=" + encodeURIComponent(value));

    if ((expires = +expires)) {
      cookie.push("expires=" + new Date(expires).toGMTString());
    }

    if (path && typeof path === "string") {
      cookie.push("path=" + path);
    }

    if (domain && typeof domain === "string") {
      cookie.push("domain=" + domain);
    }

    if (secure === true) cookie.push("secure");

    document.cookie = cookie.join("; ");
  },

  read(name) {
    const pattern = new RegExp(`(^|;*)(${name})=([^;]*)`);
    const match = document.cookie.match(pattern);

    return match ? decodeURIComponent(match[3]) : null;
  },

  remove(name) {
    this.write(name, "", Date.now() - 864e4);
  }
};
