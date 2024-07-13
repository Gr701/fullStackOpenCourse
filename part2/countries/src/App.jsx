import {useState, useEffect} from 'react'
import countriesService from './services/countries'
import weatherService from './services/weather'

const WeatherContent = ({country}) => {

  const [weatherInfo, setWeatherInfo] = useState(null)

  useEffect(() => {
    console.log('weather effect')
    weatherService
      .getWeather(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1])
      .then(data => setWeatherInfo({
        temperature: (data.main.temp - 273.15).toFixed(2), 
        windSpeed: data.wind.speed,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      }))
  }, [])

  console.log('weather content')
  if (weatherInfo === null) {
    return null
  }
  return (
    <>
      <h2>Weather in {country.capital}</h2>
      <div>temperature {weatherInfo.temperature} Celcius</div>
      <img src={weatherInfo.iconUrl} alt='weatherPicture' width={100}/>
      <div>wind {weatherInfo.windSpeed} m/s</div>
    </>
  )
}

const CountryContent = ({country}) => {
  if (country === undefined) {return}
  
  return (
    <div>
      <h1>{country.name.common}</h1>
      capital {country.capital}
      <div>area {country.area}</div>
      <h3>languages: </h3>
      <ul>
        {Object.entries(country.languages).map(([k, v]) => <li key={k}>{v}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.png} width={200}/>
      <WeatherContent country={country} />
    </div>
  )
}

const CountryListItem = ({country, onShow}) => {
  return (
    <div>
      {country.name.common} {' '}
      <button onClick={() => onShow(country.name.common)}>show</button>
    </div>
  )
}

const Content = ({countries, filterValue, setInputValue}) => {
  const filterCountry = (c) => c.name.common.toUpperCase().includes(filterValue.toUpperCase())

  const filteredCountries = countries.filter(filterCountry)

  if (filteredCountries.length === 1) {
    return <CountryContent country={filteredCountries[0]}/>
  }
  else if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  return (
    <>
      {filteredCountries.map(c => 
        <CountryListItem key={c.name.common} country={c} onShow={setInputValue}/>
      )}
    </>
  )
}

const App = () => {
  const [inputValue, setInputValue] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    countriesService
      .getAll()
      .then(allCountries => setCountries(allCountries))
  }, [])

  return (
    <>
      <form>
        find countries
        <input value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
      </form>
      <Content countries={countries} filterValue={inputValue} setInputValue={setInputValue}/>
    </>
  )
}

export default App