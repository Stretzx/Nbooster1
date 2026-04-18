async function loadBattery() {
  if (navigator.getBattery) {
    const battery = await navigator.getBattery();
    document.getElementById("battery").innerText =
      Math.floor(battery.level * 100) + "%";
  }
}

function loadRAM() {
  if (performance.memory) {
    let used = performance.memory.usedJSHeapSize / 1048576;
    document.getElementById("ram").innerText =
      used.toFixed(2) + " MB";
  }
}

window.onload = () => {
  checkShizuku();
  loadBattery();
  loadRAM();
  setInterval(loadRAM, 2000);
};