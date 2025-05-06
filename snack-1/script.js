// In questo esercizio, utilizzerai Promise.all() per creare la funzione getDashboardData(query), che accetta una città come input e recupera simultaneamente:

//  Nome completo della città e paese da  /destinations?search=[query]
// (result.name, result.country, nelle nuove proprietà city e country).
// Il meteo attuale da / weathers ? search = { query }
// (result.temperature e result.weather_description nella nuove proprietà temperature e weather).
// Il nome dell’aeroporto principale da / airports ? search = { query }
// (result.name nella nuova proprietà airport).

// Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati. 
// `http://localhost:5000/destinations?search=${query}` `http://localhost:5000/weathers?search=${query}` `http://localhost:5000/airports?search=${query}`

// Creo la funzione chge trasforma le risposte in dati leggibili e la utilizzo sotto al posto del fetch
async function fetchJSON(url) {
    const res = await fetch(url)
    const obj = res.json()
    return obj
}


async function getDashboardData(query) {
    try {
        const cityRes = fetchJSON(`http://localhost:5000/destinations?search=${query}`)
        const weatherRes = fetchJSON(`http://localhost:5000/weathers?search=${query}`)
        const airportRes = fetchJSON(`http://localhost:5000/airports?search=${query}`)

        // creo la promise all 
        const data = await Promise.all([cityRes, weatherRes, airportRes])

        // faccio il destructuring dei dati reicevuti dalla promessa
        const [city, weathers, airports] = data

        // dato che è una chiamata fatta ad una search allora ritornerà sempre un array di oggetti perciò vado a ricavere il primo oggetto 
        const destination = city[0]
        const weather = weathers[0]
        const airport = airports[0]

        // Creo l'oggetto personalizzato con i dati che mi servono 
        // es destination?.name (verifico se ce prima) se non ce ritorno null quindi ?? null, lo eseguo per tutte
        const cityObj = {
            name: destination?.name ?? null,
            country: destination?.country ?? null,
            weather: weather?.weather_description ?? null,
            temperature: weather?.temperature ?? null,
            airport: airport?.name ?? null
        }
        // ritorno l'oggetto completo
        return cityObj
    } catch (error) {
        // nel caso di errore ritorno un errore personalizzato + il messaggio
        throw new Error('Errore nel fetch' + error.message)
    }
}

(async () => {
    try {
        // assegno i dati ricevuti dalla funzione a city
        const city = await getDashboardData('London')

        // creo la variabile frase dove andrò ad assegnarle le frase 
        let frase = ''

        // prima di assegnarle verifico se i dati ricevuti ritornano un valore diverso da null
        if (city.name !== null && city.country !== null) {
            // se ritornano un valore diverso da null allora lo aggiungo alla variabile frase.  e cosi per tutte
            frase += `${city.name} is in ${city.country}.`
        }
        if (city.temperature !== null && city.weather !== null) {
            frase += `Today there are ${city.temperature} degrees and the weather is ${city.weather}.`
        }
        if (city.airport !== null) {
            frase += `The main airport is ${city.airport}`
        }
        // Stampo la frase in console
        console.log(frase);
    } catch (error) {
        console.error(error.message);
    }
})()