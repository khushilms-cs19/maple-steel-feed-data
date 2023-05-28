import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomButton = ({text, redirect})=>{
  const navigate = useNavigate();
  return(
    <div className="bg-red-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded md:w-3/6 w-full min-h-[100px] cursor-pointer text-center flex justify-center items-center" onClick={()=>navigate(redirect)}>
      <p className="w-full h-full  text-2xl">
      {text}
      </p>
    </div>
  )
}

function Home() {
  return (
    <div className="w-screen h-screen bg-blue-900 p-10">
      <p className="text-2xl text-red-400 font-bold w-full text-center ">Welcome to admin site.</p>
      <div className="flex md:flex-row flex-col gap-5 justify-evenly sm:p-10 px-2 py-5 items-center">
        <CustomButton text={"Add Product"} redirect={'/add-product'}/>
        <CustomButton text={"Edit Product"} redirect={'/edit-product'}/>
      </div>
    </div>
  )
}

export default Home;