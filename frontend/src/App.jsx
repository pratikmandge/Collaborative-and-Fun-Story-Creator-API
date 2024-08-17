import './App.css'
import { Outlet } from "react-router-dom";

function App() {

  return (
    <>
      <p>Header</p>
        <Outlet />
      <p>Footer</p>
    </>
  )
}

export default App
