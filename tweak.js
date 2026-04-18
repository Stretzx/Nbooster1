let _activeHz = null;

function setHz(val) {
  const cmd = `settings put system min_refresh_rate ${val}\nsettings put system peak_refresh_rate ${val}`;
  if (execShell(cmd)) {
    _activeHz = val;
    document.querySelectorAll(".btn-hz").forEach(b => b.classList.remove("active"));
    const btns = document.querySelectorAll(".btn-hz");
    btns.forEach(b => {
      if (b.textContent.includes(val)) b.classList.add("active");
    });
    showToast(`REFRESH RATE → ${val} Hz`, "success");
  }
}

function setPerfMode(mode) {
  const cmds = {
    performance: `settings put global low_power 0\nsettings put global always_finish_activities 0\nsettings put global animator_duration_scale 0.5\nsettings put global transition_animation_scale 0.5\nsettings put global window_animation_scale 0.5`,
    balanced: `settings put global low_power 0\nsettings put global always_finish_activities 0\nsettings put global animator_duration_scale 1.0\nsettings put global transition_animation_scale 1.0\nsettings put global window_animation_scale 1.0`,
    powersave: `settings put global low_power 1\nsettings put global always_finish_activities 0`
  };
  const labels = { performance: "PERFORMANCE MODE ON", balanced: "BALANCED MODE", powersave: "POWER SAVE ON" };
  if (execShell(cmds[mode])) {
    showToast(labels[mode], "success");
  }
}

function setFontScale(scale) {
  if (execShell(`settings put system font_scale ${scale}`)) {
    showToast(`FONT SCALE → ${scale}`, "success");
  }
}

function toggleAnimations(enabled) {
  const val = enabled ? "1.0" : "0";
  const cmd = `settings put global window_animation_scale ${val}\nsettings put global transition_animation_scale ${val}\nsettings put global animator_duration_scale ${val}`;
  if (execShell(cmd)) {
    showToast(enabled ? "ANIMATIONS RESTORED" : "ANIMATIONS KILLED", "success");
  }
}

function setDisplaySize(dpi) {
  if (execShell(`wm density ${dpi}`)) {
    showToast(`DENSITY → ${dpi} DPI`, "success");
  }
}

function resetDisplaySize() {
  if (execShell("wm density reset")) {
    showToast("DENSITY RESET", "success");
  }
}

function setWifiScan(enabled) {
  const val = enabled ? "1" : "0";
  if (execShell(`settings put global wifi_scan_always_enabled ${val}`)) {
    showToast(enabled ? "BG WIFI SCAN ON" : "BG WIFI SCAN OFF", "success");
  }
}

function forceMobileData() {
  if (execShell(`svc data enable`)) {
    showToast("MOBILE DATA FORCED ON", "success");
  }
}

function resetNetworkPolicy() {
  if (execShell(`settings put global mobile_data 1`)) {
    showToast("NETWORK POLICY RESET", "success");
  }
}
