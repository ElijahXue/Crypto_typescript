import { useEffect, useState } from 'react';
// import './App.css';
import axios from 'axios';
import CryptoSummary from './components/CryptoSummary';
import { Crypto } from './types/types';
import moment from 'moment';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

import React from 'react';
import { ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';



ChartJS.register(ArcElement, Tooltip, Legend);



function App() {

  const [selected, setSelected] = useState<Crypto[]>([]);
  const [data, setData] = useState<ChartData<'pie'>>();
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);

  const [range, setRange] = useState<string>('30');

  function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.2)`; // Adjust the alpha value as needed
  }

  useEffect(()=>{
    console.log('selected:',selected)
    if (selected.length===0) {return };
    const backgroundColors = selected.map(() => generateRandomColor());
    const borderColors = backgroundColors.map(color => color.replace('0.2', '1')); // Adjust the alpha for border

    setData(
      {
        labels: selected.map((s)=>{
          return s.name
        }),
        datasets: [
          {
            label: '# of Votes',
            data: selected.map((s)=>{
              return Number(s.owned)*  Number(s.current_price);
            }),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      }
    )
  },[selected])

  useEffect(() => {
    let url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en';
    // let url = '/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&pa ge=1&sparkline=false&locale=en';
    axios.get(url).then((response) => {
      setCryptos(response.data);
    }).catch((error) => {
      // Handle the error here
      console.error("Error fetching crypto data:", error);
      // Optionally, set some default state or error message in your component state
    })
  }, [])


  function updateOwned(crypto: Crypto, amount: number): void {
    console.log("updateOwned", crypto, amount)
    let temp = [...selected];
    let tempObj = temp.find((c) => c.id === crypto.id);
    // shallow copy, each tempObj is the element in the selected array 
    console.log('tempObj', tempObj);
    if (tempObj) {
      tempObj.owned = amount;
      setSelected(temp);
    }


  }
  return (
    <>
      <div className="App">

        <select onChange={(e) => {
          const c = cryptos?.find((x) => x.id === e.target.value) as Crypto;
          setSelected([...selected, c])
        }}
          defaultValue='default'
        >
          {cryptos ? cryptos.map((crypto) => {
            return <option
              key={crypto.id}
              value={crypto.id}>
              {crypto.name}
            </option>
          }) : null
          }
          <option value='default'>Choose an option</option>
        </select>

        {/* to modify the data in the selected list */}
        {selected.map((s) => {
          return <CryptoSummary crypto={s} updateOwned={updateOwned} />
        })}

        {data ? (
          <div>
            <Pie data = {data}/>
          </div>
        ) : null}

        {
          selected ? ('Your protfolio is worth: $' + selected.map((s) => {
            if (isNaN(s.owned)) {
              return 0;
            }
            console.log(s)
            console.log('s.current_price:', Number(s.current_price), Number(s.owned))
            return Number(s.current_price) * Number(s.owned);
          }).reduce((pre, current) => {
            return pre + current
          }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
            : null
        }
        {/* <Pie data={data} />; */}

      </div>
    </>

  )

}

export default App;


