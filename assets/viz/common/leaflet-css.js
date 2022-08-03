export const leafletCSS = function (version) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
  link.href = `//unpkg.com/leaflet@${version}/dist/leaflet.css`;
};
