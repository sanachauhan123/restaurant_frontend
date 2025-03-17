import React, { useEffect, useState } from 'react';
// import pizza from './pizza.jpg';
// import sandwich from './sandwich.jpg';
// import fries from './fries.jpg';

import './index.css'
import './index.css';
import NewCategory from './newcat';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';


const API_URL = process.env.REACT_APP_API_URL;

function Main() {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getItem = async (e) => {
      const result = await fetch("https://resbackend-three.vercel.app/api/menu");
      const res = await result.json();
      setTableData(res)

    }
    getItem();
  })




  return (
    <>
      {/* <div className="center">
        <h2 class="text-center" >Food Categories </h2>
        <div className="container">
          <div className="row">

            <form method="POST" class="border border-light" encType='multipart/form-data' >

              <SearchBar setTableData={setTableData} />
              <br /><br />
            
              <div style={{ backgroundColor: 'rgb(243 244 246 )' }}>
                <button className="btn btn-outline-primary" onClick={()=>navigate('/categories/new')} >Add</button>
              </div>
             
            </form>
          </div>
        </div>
      </div> */}

      <div className='home'>
      <NewCategory />
      <div className='homeContainer'>
        <Navbar />
      </div>
      </div>


    </>
  )
}
export default Main;