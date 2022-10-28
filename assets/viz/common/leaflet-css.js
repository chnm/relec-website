export const leafletCSS = function () {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  document.head.appendChild(link);
  link.href = `/css/leaflet.css`;
};
