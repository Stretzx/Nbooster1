async function loadBattery() {
  const el = document.getElementById("battery");
  const bar = document.getElementById("batteryBar");

  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      const pct = Math.floor(battery.level * 100);
      el.textContent = pct + "%";
      if (bar) bar.style.width = pct + "%";

      battery.addEventListener("levelchange", () => {
        const p = Math.floor(battery.level * 100);
        el.textContent = p + "%";
        if (bar) bar.style.width = p + "%";
      });
      return;
    } catch (_) {}
  }

  const raw = execShellWithResult("dumpsys battery | grep level");
  if (raw) {
    const match = raw.match(/(\d+)/);
    if (match) {
      el.textContent = match[1] + "%";
      if (bar) bar.style.width = match[1] + "%";
    }
  }
}

function loadRAM() {
  const el = document.getElementById("ram");
  if (performance.memory) {
    const used = performance.memory.usedJSHeapSize / 1048576;
    const total = performance.memory.totalJSHeapSize / 1048576;
    el.textContent = used.toFixed(0) + "M";
    return;
  }

  const raw = execShellWithResult("cat /proc/meminfo | grep MemFree");
  if (raw) {
    const match = raw.match(/(\d+)/);
    if (match) {
      const freeMb = Math.floor(parseInt(match[1]) / 1024);
      el.textContent = freeMb + "M";
    }
  }
}

function loadRefreshRate() {
  const el = document.getElementById("refreshRate");
  const raw = execShellWithResult("settings get system peak_refresh_rate");
  if (raw && raw.trim() !== "null" && raw.trim() !== "") {
    const hz = parseFloat(raw.trim());
    if (!isNaN(hz)) {
      el.textContent = Math.round(hz) + "Hz";
      syncHzButtons(Math.round(hz));
      return;
    }
  }
  el.textContent = "--";
}

function syncHzButtons(hz) {
  document.querySelectorAll(".btn-hz").forEach(b => {
    const num = parseInt(b.querySelector(".hz-num").textContent);
    b.classList.toggle("active", num === hz);
  });
}

function loadCpuTemp() {
  const el = document.getElementById("cpuTemp");
  const paths = [
    "cat /sys/class/thermal/thermal_zone0/temp",
    "cat /sys/class/thermal/thermal_zone1/temp"
  ];

  for (const path of paths) {
    const raw = execShellWithResult(path);
    if (raw && raw.trim() !== "") {
      const val = parseInt(raw.trim());
      if (!isNaN(val) && val > 0) {
        const temp = val > 1000 ? val / 1000 : val;
        el.textContent = temp.toFixed(1) + "°";
        return;
      }
    }
  }
  el.textContent = "--";
}

function pollRealtime() {
  loadRAM();
  if (isShizukuAvailable()) {
    loadRefreshRate();
    loadCpuTemp();
  }
}

window.onload = () => {
  checkShizuku();
  loadBattery();
  loadRAM();
  loadRefreshRate();
  loadCpuTemp();
  setInterval(pollRealtime, 2000);
  setInterval(checkShizuku, 10000);
};
