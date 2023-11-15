import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

export type Crypto = {

  id: string,
  symbol: string,
  name: string,
  current_price: number,
  market_cap: number,
  total_volume: number,
  high_24h: number,
  low_24h: number,
  total_supply: number,

}

function App() {

  const [crypots, setCrypots] = useState<Crypto[] | null>();
  useEffect(() => {

    let url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en';
    axios.get(url).then((response) => {
      setCrypots(response.data);
    })

  }, [])


  return <div className="App">

    {crypots ? crypots.map((crypto) => {
      return <p>{crypto.name + '$ ' + crypto.current_price}  </p>
    }) : null
    }
  </div>;
  ;
}

export default App;


