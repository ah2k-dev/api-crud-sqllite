import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
const InnerLayout = () => {
  return (
    <div style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        flexDirection: "column",
    }}>
        <Header />
        <Outlet />
    </div>
  )
}

export default InnerLayout