import React from "react";
import Sidebar from "./Sidebar";
import Navbar from './Navbar';
import CookieIcon from '@mui/icons-material/Cookie';
import Logo from './image/dashboard.jpg'

function Dashboard(){
return(
    <>
     <div className='home'>
      <Sidebar />
      <div className='homeContainer'>
        <Navbar />
    
        <div className="center">
    <div className='head_div'>
    <CookieIcon style={{fontSize:'40px'}} />
        <h2 class="text" >Dashboard</h2>
        </div>
        </div>
        <img src={Logo} style={{height: 'auto',
    maxWidth: '100%',marginLeft:200}} />

      </div>
      </div>

    </>
)
}

export default Dashboard;