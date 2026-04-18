function setHz(val) {

  let cmd = `
    settings put system min_refresh_rate ${val}
    settings put system peak_refresh_rate ${val}
  `;

  execShell(cmd);
}