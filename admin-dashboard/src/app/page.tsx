'use client'
import React from 'react'
import useAuthStore from './store/useAuthStore'

const Home = () => {
  const { userData } = useAuthStore()

  return (
    <div>
      <h1>Welcome, {userData?.email}</h1>
    </div>
  )
}

export default Home