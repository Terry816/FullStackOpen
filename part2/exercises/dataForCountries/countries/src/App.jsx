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
          <button onClick={(e, con) => ShowHandler(e, item.name.common)}>Show</button>
        </li>
      ))}
    </ul>
  )
}

const Detail = ({ country }) => {
  const languages = Object.values(country.languages)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>{country.capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {languages.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <img src={country.flags.svg} alt={country.flags.alt} />
    </div>
  )
}


function App() {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

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
