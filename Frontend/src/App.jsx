import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Screen } from './Components/Screen';
import { Room } from './Components/Room';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path='/' element={<Screen/>}/>
        <Route path='/room/:roomId' element={<Room/>}/>
      </Routes>
    </>
  )
}

export default App
