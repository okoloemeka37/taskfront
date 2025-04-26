import React from 'react'

export default function SubmitLoaders() {
  return (
    <button  className={`relative w-full inline-flex items-center justify-center px-6 py-3 text-white font-semibold transition bg-blue-600 rounded-xl hover:bg-blue-700 cursor-not-allowed opacity-70`} >
    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> <p>loading</p>  </button>
     
  )
}
