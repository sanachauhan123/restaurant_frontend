import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from './Navbar';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useNavigate } from "react-router-dom";

// let baseURL = '';

//   if (process.env.NODE_ENV === 'development') {
//     baseURL = 'http://localhost:5000';
//   } else {
//     baseURL = 'http://83.223.113.92:3000';
//   }

export default function Gst(){
    const navigator = useNavigate()
    const [data,setData] = useState([]);
    const[loading,setLoading] = useState(false);
    useEffect(()=>{
        const getData = async() =>{
            setLoading(true)
            await axios.get('https://resbackend-two.vercel.app/gst-rates').then((res)=>{
                //console.log(res.data)
                setData(res.data)
               // setLoading(false)
            })
        }
        getData();
    },[loading]);



    //const cgstRate = data.length > 0 && data[0].cgstRate ? data[0].cgstRate : "cgstRate not found.";

   // const sgstRate = data[0].sgstRate ? data[0].sgstRate : "sgstRate not found.";

    
    return(
        <>
       <div className='home'>
 <Sidebar />
 <div className='homeContainer'>
   <Navbar />
   
   <div className="main-container">
   <div className="center">
   <div className='head_div'>
   <RateReviewIcon style={{fontSize:'30px'}} />
   <h4 class="text" >GST Rates</h4>
   <button type="button" className="back_btn" onClick={()=>navigator('/admin/home')}>Back</button>
   </div>

   <div className="container_box" >
   <div className="row">

    <div>
        <h2 style={{textAlign:'center'}}>Current GST Rates for ‘restaurant service’ </h2>
        <p style={{textAlign:'center'}}> Current CGST Rate: {data.length > 0 && `${data[0].cgstRate}%`}</p>
        <p style={{textAlign:'center'}}> Current SGST Rate: {data.length > 0 && `${data[0].sgstRate}%`}</p>
    </div>
  
       </div>
   </div>
   </div>
       </div>
 </div>
 </div>
        </>
    )
  
}