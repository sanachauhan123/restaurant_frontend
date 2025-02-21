import React from "react";
import Sidebar from "./Sidebar";
import Navbar from './Navbar';
import HomeIcon from '@mui/icons-material/Home';
import Logo from './image/ki.jpg';

function Home(){
return(
    <>
     <div className='home'>
      <Sidebar />
      <div className='homeContainer'>
        <Navbar />
    
        <div className="center">
    <div className='head_div'>
    <HomeIcon style={{fontSize:'40px'}} />
        <h2 class="text" >Welcome</h2>
        </div>

        <img src={Logo} style={{height: 'auto',
    maxWidth: '100%'}} />
        </div>


      </div>
      </div>

    </>
)
}

export default Home;