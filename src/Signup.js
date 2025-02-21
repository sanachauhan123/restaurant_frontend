import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

let baseURL = '';

  if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:5000';
  } else {
    baseURL = 'http://83.223.113.92:3000';
  }

function Signup(){
  
  const Navigate = useNavigate();
    const [user,setUser] = useState({username:'',password:''});
    const [err,setErr] = useState('');
    const [success,setSuccess] = useState('');
    const handleChange = (e) =>{
        setUser({...user, [e.target.name]: e.target.value})
    }
    

    
    const handleSubmit = async(e) =>{
        e.preventDefault();
      const {username,password} = user;

  // axios.post(baseURL+'/api/signup',{
  //         username,password
  //       })  .then((res) => {
  //         console.log("Server response: ", res);
  //         setSuccess("signup successfully");
  //         setTimeout(()=> Navigate('/login'),1000)
  //     })
  //     .catch((err) => {
  //         console.log("Server respondend with error: ", err);
  //     })


        
        const res = await fetch("https://resbackend-two.vercel.app/api/signup/",{
          method:"POST",
          headers:{
            "Content-type":"application/json",
            // "Access-Control-Allow-Origin": "http://yourapp.com"
          },
          body: JSON.stringify({
            username,password
          })
        })

        const data = await res.json();
        console.log(data) 

        if(res.status === 422 || !data ){
          setErr('username already exists');
        }else{
          setSuccess("signup successfully");
          setTimeout(()=> Navigate('/login'),1000)
        }
    }

   return(
    <>
    <div>
        <h3 class="text-center">Signup Form</h3>
        <form class="menuform" method="POST" style={{width:"35%"}} onSubmit={handleSubmit}>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" value={user.username} name="username" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleChange} autoComplete='off' />
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" value={user.password} name="password" class="form-control" id="exampleInputPassword1" onChange={handleChange} autoComplete='off' />
  </div>
  <div>
   <p>Already have an account <NavLink to='/login'> Signin</NavLink></p> 
  </div>
 
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
    </div>
    <h3 className='success text-center'>{success}</h3>
    <h3 className='err text-center'>{err}</h3>
    </>
   )
}

export default Signup;