import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import aws_exports from './aws-exports';

import React, { useEffect, useState, Component, useReducer} from 'react'
import { listCoins } from './graphql/queries'
import { createCoin as CreateCoin } from './graphql/mutations'
import uuid from 'uuid/v4'

const CLIENT_ID = uuid()

const initialState = {
  name: '', price: '', symbol: '', coins: []
}

function reducer(state, action) {
  switch(action.type) {
    case 'SETCOINS':
      return { ...state, coins: action.coins }
    case 'SETINPUT':
      return { ...state, [action.key]: action.value }
    default:
      return state
  }
}

Amplify.configure(aws_exports);

function App() {
  const [coins, updateCoins] = useState([])

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    try {
      const coinData = await API.graphql(graphqlOperation(listCoins))
      console.log('data from API: ', coinData)
      updateCoins(coinData.data.listCoins.items)
    } catch (err) {
      console.log('error fetching data..', err)
    }
  }

  return (
    <div>
      {
        coins.map((c, i) => (
          <div key={i}>
            <h2>{c.name}</h2>
            <h4>{c.symbol}</h4>
            <p>{c.price}</p>
          </div>
        ))
      }
    </div>
  )
}

export default withAuthenticator(App, { includeGreetings: true })
// export default App