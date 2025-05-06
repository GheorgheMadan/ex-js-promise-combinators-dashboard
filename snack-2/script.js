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
        const data = await Promise.allSettled([cityRes, weatherRes, airportRes])

        // faccio il destructuring dei dati reicevuti dalla promessa
        const [destinationsResult, weathersResult, airportsResult] = data
        // console.log(city, weathers, airports);

        const obj = {}

        // Verifico se destinations è andato a buon fine, quindi prima vedo se lo status va in rejected 
        if (destinationsResult.status === 'rejected') {
            // allora stampo l'errore
            console.error('Problema in destinations', destinationsResult.reason);
            // setto i dati a null
            obj.city = null
            obj.country = null
        } else {
            // invece se va a buon fine allora prendo i dati e li assegno
            const destination = destinationsResult.value[0];

            // verifico se i dati ci sono veramente senno li setto a null ?? null
            obj.city = destination?.name ?? null
            obj.country = destination?.country ?? null
        }

        // Verifico se weathers è andato a buon fine, quindi prima vedo se lo status va in rejected 
        if (weathersResult.status === 'rejected') {
            // allora stampo l'errore
            console.error('Problema in weathers: ', weathersResult.reason);

            // setto i dati a null
            obj.temperature = null
            obj.weather = null
        } else {
            // invece se va a buon fine allora prendo i dati e li assegno
            const weather = weathersResult.value[0]

            // verifico se i dati ci sono veramente senno li setto a null ?? null
            obj.temperature = weather?.temperature ?? null
            obj.weather = weather?.weather_description ?? null
        }

        if (airportsResult.status === 'rejected') {
            // allora stampo l'errore
            console.error('Problema in airports: ', airportsResult.reason);

            // setto i dati a null
            obj.airport = null
        } else {
            // invece se va a buon fine allora prendo i dati e li assegno
            const airport = airportsResult.value[0]

            // verifico se i dati ci sono veramente senno li setto a null ?? null
            obj.airport = airport.name
        }
        console.log(destinationsResult, weathersResult, airportsResult);

        return obj
    } catch (error) {
        // nel caso di errore ritorno un errore personalizzato + il messaggio
        throw new Error('Errore nel fetch' + error.message)
    }
}

(async () => {
    try {
        // assegno i dati ricevuti dalla funzione a city
        const city = await getDashboardData('Vienna')

        // creo la variabile frase dove andrò ad assegnarle le frase 
        let frase = ''

        // prima di assegnarle verifico se i dati ricevuti ritornano un valore diverso da null
        if (city.city !== null && city.country !== null) {
            // se ritornano un valore diverso da null allora lo aggiungo alla variabile frase.  e cosi per tutte
            frase += `${city.city} is in ${city.country}.`
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
        console.error(error.message, error.reason);
    }
})()