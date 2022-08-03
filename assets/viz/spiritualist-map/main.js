var map = L.map('map').setView([39.953, -75.265], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

var geojsonMarkerOptions = {
    radius: 9,
    weight: 2,
    opacity: 2,
    fillOpacity: 0.2
};

var points = L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        let options = geojsonMarkerOptions;
        switch (feature.properties.pastor_gender) {
            case 'Female':
                options.color = "purple";
                options.fillColor = "purple";
                break;
            case 'Male':
                options.color = "blue";
                options.fillColor = "blue";
                break;
            case 'Unknown':
                options.color = "black";
                options.fillColor = "black";
                break;
    case 'None':
      options.color = 'red';
      options.fillcolor = 'red'
      break; 
        }
        return L.circleMarker(latlng, options);
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            `
            <div class="popup">
                <strong>Pastor:</strong> ${feature.properties.pastor_name}<br/>
                <strong>Gender:</strong> ${feature.properties.pastor_gender}<br/>
                <a href="${feature.properties.url}" target="_blank">Link to census schedule</a>
            </div>
            `
        );
    },
});
points.addTo(map);

map.fitBounds(points.getBounds());