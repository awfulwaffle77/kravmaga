function initMap() {
    var krav = { lat: 44.420171, lng: 26.095080 };
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 16, center: krav });
    var marker = new google.maps.Marker({ position: krav, map: map });
}