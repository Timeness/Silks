let map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker;
const socket = new WebSocket("wss://cryberLabs.vercel.app/ws");

document.getElementById("shareLocation").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            socket.send(JSON.stringify({ latitude, longitude }));
        });
    }
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
