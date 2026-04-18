function isShizukuAvailable() {
  return typeof window.Android !== "undefined";
}

function checkShizuku() {
  const badge = document.getElementById("shizukuBadge");
  const label = document.getElementById("shizukuLabel");

  if (isShizukuAvailable()) {
    try {
      const granted = typeof Android.isShizukuGranted === "function"
        ? Android.isShizukuGranted()
        : true;

      if (granted) {
        badge.className = "badge badge--connected";
        label.textContent = "SHIZUKU OK";
      } else {
        badge.className = "badge badge--checking";
        label.textContent = "REQUESTING";
        Android.exec("echo permission_request");
      }
    } catch (e) {
      badge.className = "badge badge--connected";
      label.textContent = "BRIDGE OK";
    }
  } else {
    badge.className = "badge badge--disconnected";
    label.textContent = "NO BRIDGE";
  }
}

function execShell(cmd) {
  if (!isShizukuAvailable()) {
    showToast("Bridge not ready", "error");
    return false;
  }
  try {
    Android.exec(cmd.trim());
    return true;
  } catch (e) {
    console.error("execShell error:", e);
    showToast("Exec failed", "error");
    return false;
  }
}

function execShellWithResult(cmd) {
  if (!isShizukuAvailable()) return null;
  try {
    if (typeof Android.execWithResult === "function") {
      return Android.execWithResult(cmd.trim());
    }
  } catch (e) {
    console.error("execShellWithResult error:", e);
  }
  return null;
}

let _toastTimer = null;

function showToast(msg, type) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = "toast show" + (type ? " " + type : "");
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = "toast"; }, 2200);
}
