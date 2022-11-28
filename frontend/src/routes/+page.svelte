<script>
    import {onMount} from 'svelte'
    import axios from 'axios'
    import { bind, each,} from 'svelte/internal';
    
    let countries = [];
    let cities = [];
    let closest_city = '';
    let lat = '';
    let long = '';
    let measurements = [];
    
    onMount(async () => {	
        const response = await fetch('https://api.openaq.org/v1/countries?limit=200&page=1&offset=0&sort=asc&order_by=country').then(x => x.json());	
        countries = response.results;
    });
    
    const get_cities =  async (country) => {   
        let response = axios.get(`https://api.openaq.org/v1/latest?limit=200&page=1&offset=0&sort=desc&radius=1000&country=${country.code}&order_by=lastUpdated&dumpRaw=false`);
        cities = response.data.results;
    };
    
    const get_measurements = async (city) => {
        let response = axios.get(`https://api.openaq.org/v1/latest?limit=100&page=1&offset=0&sort=desc&radius=1000&country=${city.country}&city=${city.city}&order_by=lastUpdated&dumpRaw=false`)
        measurements = response.data.results[0].measurements[0];
        // measurements = {
        //     para meter: measurements.parameter,
         //     value: measurements.value
        // }
    }
    const get_latlong = async (lat, long) => {
        let response = axios.get(`https://api.openaq.org/v1/latest?limit=100&page=1&offset=0&sort=desc&coordinates=${lat}%2C${long}&radius=100000&order_by=lastUpdated&dumpRaw=false`)
        let results = response.data.results;
        let smallest = Infinity;
        for (let result of results){
            let y = result.coordinates.latitude;
            let x = result.coordinates.longitude;
            let a = lat - y;
            let b = long - x;
            let c = (a*a) + (b*b);
            let square_root = Math.sqrt(c);
            if (square_root < smallest) {
                smallest = square_root;
                closest_city = result;
            };
        };   
    };
    </script>
    <div>
        <input type=text bind:value={lat}>
        <input type=text bind:value={long}>
        <button on:click={( ) => get_latlong(lat, long)}>submit</button>
        {JSON.stringify(closest_city)}
    </div>
    
    <div>
        {#each countries as country}
            <a class=button on:click={( ) => get_cities(country)}>{country.name}</a>
        {/each}
    </div>
    <div>
        {#each cities as city}
            <a class=button on:click={( ) => get_measurements(city)}>{city.city}</a>
            
        {/each}
    </div>
    <div>
        {#each Object.entries(measurements) as [key, value]}
            {#if key !== 'averagingPeriod'}
                <p>{key}: {value} </p>
            {/if}
        {/each}
    </div>
    <style>
    .button {
        border: solid 1px; 
        cursor: pointer;
    }
    </style>