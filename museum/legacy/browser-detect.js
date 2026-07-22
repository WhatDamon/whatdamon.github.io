function getBrowserInfo() {
  var ua = navigator.userAgent;
  var name = null;
  var ver = "";
  var type = "old";

  // 1. Internet Explorer
  var m = ua.match(/MSIE\s+([\d.]+)/i);
  if (m) {
    name = "Internet Explorer";
    ver = m[1];
  }
  // 2. Opera
  else if (ua.indexOf("Opera") !== -1) {
    name = "Opera";
    m = ua.match(/Opera[/\s]([\d.]+)/i);
    if (m) ver = m[1];
  }
  // 3. Nordstjernen
  else if (ua.indexOf("Nordstjernen") !== -1) {
    name = "Nordstjernen";
    m = ua.match(/Nordstjernen\/([\d.]+)/i);
    if (m) ver = m[1];
    type = "quirks";
  }
  // 4. Goanna-based
  else if (/Goanna\//i.test(ua)) {
    m = ua.match(/(PaleMoon|K-Meleon|Basilisk)\/([\d.]+)/i);
    if (m) {
      name = m[1] === "PaleMoon" ? "Pale Moon" : m[1];
      ver = m[2];
      type = "quirks";
    } else {
      return null;
    }
  }
  // 5. Gecko-based
  else if (/Gecko\//i.test(ua)) {
    m = ua.match(
      /(Firefox|Phoenix|Firebird|SeaMonkey|Camino|RetroZilla)\/([\d.]+)/i
    );
    if (m) {
      name = m[1];
      ver = m[2];
      var major = parseInt(ver, 10);
      if (
        (name === "Firefox" && major > 3) ||
        (name === "SeaMonkey" && major >= 2)
      ) {
        return null;
      }
    } else {
      // No product name -> likely Mozilla Suite
      m = ua.match(/rv:([\d.]+)/i);
      if (m) {
        name = "Mozilla Suite";
        ver = m[1];
      } else {
        return null;
      }
    }
  }
  // 6. Netscape Navigator 2~4
  else if (
    /^Mozilla\/([2-4]\.\d+)/.test(ua) &&
    ua.indexOf("compatible") === -1
  ) {
    name = "Netscape";
    m = ua.match(/^Mozilla\/([\d.]+)/);
    if (m) ver = m[1];
  }
  // 7. Konqueror (KDE 3.x)
  else if (ua.indexOf("Konqueror") !== -1) {
    m = ua.match(/Konqueror\/([\d.]+)/i);
    if (m) {
      name = "Konqueror";
      ver = m[1];
      if (parseInt(ver, 10) > 3) return null;
    } else {
      return null;
    }
  }
  // 8. Chrome/Chromium 0.x or 1.x
  else if (/Chrome\//i.test(ua) || /Chromium\//i.test(ua)) {
    m = ua.match(/(Chrome|Chromium)\/([\d.]+)/i);
    if (m) {
      name = m[1];
      ver = m[2];
      if (parseInt(ver, 10) > 1) return null;
    } else {
      return null;
    }
  }
  // 9. Safari <= 3.x
  else if (/Safari\//i.test(ua) && /AppleWebKit\//i.test(ua)) {
    m = ua.match(/Version\/([\d.]+)/i);
    if (m) {
      name = "Safari";
      ver = m[1];
      if (parseInt(ver, 10) > 3) return null;
    } else {
      // No version tag -> Safari 1.x or 2.x
      name = "Safari";
      ver = "";
    }
  }
  // 10. Ladybird
  else if (/Ladybird\//i.test(ua)) {
    m = ua.match(/Ladybird\/([\d.]+)/i);
    if (m) {
      name = "Ladybird";
      ver = m[1];
      type = "quirks-cjk";
    } else {
      return null;
    }
  } else {
    return null;
  }

  return { name: name, version: ver, type: type };
}
