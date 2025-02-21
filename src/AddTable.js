import React, { useState, useEffect } from "react";
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import TableBar from '@mui/icons-material/TableBar';

let baseURL = '';

  if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000';
  } else {
    baseURL = 'http://83.223.113.92:3000';
  }

function AddTable(){
  const navigator = useNavigate();
  const [user, setUser] = useState({addtable:'',status:'Available'});
  
  const handleChange = (e) =>{
      setUser({...user,[e.target.name]:e.target.value});
  }
  const handleSubmit = async(e) =>{
      e.preventDefault();
      //console.log(tableno)
      const {addtable,status} = user;
      const res = await fetch("https://resbackend-one.vercel.app/api/table",{
          method:'POST',
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({addtable,status})
      })
      const data = await res.json();
      console.log(data);
      navigator('/admin/table')
  }
return(
  <>
  <div className='home'>
 <Sidebar />
 <div className='homeContainer'>
   <Navbar />
   
   <div className="main-container">
   <div className="center">
   <div className='head_div'>
   <TableBar style={{fontSize:'30px'}} />
   <h4 class="text" >Add Table No.</h4>
   <button type="button" className="back_btn" onClick={()=>navigator('/admin/table')}>Back</button>
   </div>

   <div className="container_box" >
   <div className="row">
   <form onSubmit={handleSubmit} encType="multipart/form-data" method="POST">
 <div className="row">
   <div className="col-6 text_data">
     <h5>Add Table Number</h5>
   
   </div>

   <div className="col-6 text_data2">
     <label htmlFor="table">Table</label>
     <input type="text" class="form-control" id="table" name="addtable" 
     value={user.addtable} onChange={handleChange} aria-describedby="emailHelp"/>

<label htmlFor="status">Status</label>
     <input type="text" class="form-control" id="status" name="status" 
     value='Available' aria-describedby="emailHelp"/>

   </div>
 </div>

 <div className="card-footer">
   <div className="inline-flex">
     <button type="button" className="cancel_btn">
       Cancel
     </button>
     <button type="submit" className="save_btn">
       Save
     </button>
   </div>
 </div>
</form>
       </div>
   </div>
   </div>
       </div>
 </div>
 </div>
   
   </>
)
}
export default AddTable;