import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import CryptoSummary from './components/CryptoSummary';

import { Crypto } from './types/types';

function App() {
  const [selected, setSelected] = useState<Crypto | null>(null);
  const [crypots, setCrypots] = useState<Crypto[] | null>(null);
  useEffect(() => {

    let url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en';
    axios.get(url).then((response) => {
      setCrypots(response.data);
    })

  }, [])


  return (
    <>
      <div className="App">

        <select onChange={(e) => {
          const c = crypots?.find((x) => x.id === e.target.value) || null;
          console.log(c);
          setSelected(c)
        }}
          defaultValue='default'
        >
          {crypots ? crypots.map((crypto) => {
            return <option key={crypto.id} value={crypto.id}>
              {crypto.name}
            </option>

          }) : null
          }
          <option value='default'>Choose an option</option>
        </select>

        {selected && <CryptoSummary crypto={selected} />}


      </div>
    </>

  )

}

export default App;


