function isShizukuAvailable() {
  return typeof window.Android !== "undefined";
}

function checkShizuku() {
  const el = document.getElementById("shizukuStatus");

  if (isShizukuAvailable()) {
    el.innerText = "✅ Connected (Bridge OK)";
  } else {
    el.innerText = "❌ Not Connected";
  }
}

function execShell(cmd) {
  if (!isShizukuAvailable()) {
    alert("Shizuku / Bridge not ready");
    return;
  }

  try {
    Android.exec(cmd);
  } catch (e) {
    console.error(e);
  }
}