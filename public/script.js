let map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let marker;
const socket = new WebSocket("wss://cryberlabs.vercel.app/ws");

document.getElementById("shareLocation").addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.watchPosition(
        position => {
            const { latitude, longitude } = position.coords;
            socket.send(JSON.stringify({ latitude, longitude }));

            const location = [latitude, longitude];
            if (!marker) {
                marker = L.marker(location).addTo(map);
            } else {
                marker.setLatLng(location);
            }
            map.setView(location, 13);
        },
        error => {
            alert("Error getting location: " + error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
});

socket.onmessage = event => {
    const { latitude, longitude } = JSON.parse(event.data);
    const location = [latitude, longitude];

    if (!marker) {
        marker = L.marker(location).addTo(map);
    } else {
        marker.setLatLng(location);
    }

    map.setView(location, 13);
};
