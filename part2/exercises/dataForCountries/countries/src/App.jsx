import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'


const Display = ({ list, ShowHandler }) => {
  if (list.length > 10) {
    return (
      <p>
        Too many matches, specify another filter
      </p>
    )
  }

  if (list.length === 1) {
    const country = list[0]
    return (
      <Detail country={country} />
    )
  }

  return (
    <ul>
      {list.map((item) => (
        <li key={item.name.common}>{item.name.common}
          <button onClick={(e) => ShowHandler(item.name.common)}>Show</button>
        </li>
      ))}
    </ul>
  )
}

const Detail = ({ country }) => {
  const languages = Object.values(country.languages)
  const [capInfo, setCapInfo] = useState(null)

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&appid=${import.meta.env.VITE_SOME_KEY}&units=metric`)
      .then(response => {
        console.log(response.data.length)
        setCapInfo(response.data)
      })
  }, [])

  if (!capInfo) return (<div>Loading Weather...</div>)

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>{country.capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>
      {languages.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
      <img src={country.flags.svg} alt={country.flags.alt} />
      <h2>Weather in {country.capital}</h2>
      <div>Current Temperature {capInfo.main.temp} Fahrenheit</div>
      <img src={`https://openweathermap.org/img/wn/${capInfo.weather[0].icon}@2x.png`}
        alt={capInfo.weather[0].description} />
      <p>Wind {capInfo.wind.speed} m/s</p>
    </div>
  )
}


function App() {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    console.log('fetching all country data...')
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
        console.log(response.data.length)
      })
  }, [])

  const changeHandler = (event) => {
    setValue(event.target.value)
  }

  const ShowHandler = (event, countryName) => {
    setValue(countryName)
  }

  // debugger
  const curr = countries.filter((node) => node.name.common.toLowerCase().includes(value.toLowerCase()))

  return (
    <div>
      Find Countries: <input value={value} onChange={changeHandler} />
      <Display list={curr} ShowHandler={ShowHandler} />
    </div>
  )
}

export default App
