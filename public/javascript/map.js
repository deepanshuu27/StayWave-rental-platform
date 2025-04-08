

   
	mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: listing.geometry.coordinates,                       
        zoom: 8 // starting zoom
    });

    console.log(listing.geometry.coordinates);   // give array contains longitude and latitude



    const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(listing.geometry.coordinates)                   
        
       . setPopup( 
         new mapboxgl.Popup({offset:25 })  .setHTML(
                `<h4>${listing.title}</h4><p>Exact Location provided after Booking</p>`
       )

    )
    

        .addTo(map);
