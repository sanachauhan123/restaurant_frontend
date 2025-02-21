import axios from 'axios';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

// let baseURL = '';

//   if (process.env.NODE_ENV === 'development') {
//     baseURL = 'http://localhost:5000';
//   } else {
//     baseURL = 'http://83.223.113.92:3000';
//   }

function Login(){
    const Navigate = useNavigate();
    const [user,setUser] = useState({username:'',password:''});
    const [err,setErr] = useState('');
    const [success,setSuccess] = useState('');
    const handleChange = (e) =>{
        setUser({...user, [e.target.name]:e.target.value});
    }
 
    // const production = process.env.NODE_ENV === 'production' ? 
    // process.env.REACT_APP_API_URL : 'http://localhost:5000'
    

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const {username,password} = user
        // axios.post(baseURL+'/api/login',{
        //     user,password
        // }).then(res=>{
           
        //     if(res.status === 422){
        //             setErr("Login Failed");
        //         }else{
        //             localStorage.setItem('role', res.username);
        //             localStorage.setItem('loginuser', res.auth);
        //            setSuccess("Login SuccessFully");
        //             setTimeout(()=> Navigate('/menu?page=1'),1000);
        //         }
        // })
        // console.log(localStorage.getItem('role'))
        const res = await fetch('https://resbackend-two.vercel.app/api/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                username,password
            })
        })
        const data = await res.json();
        console.log(data);
        if(res.status === 422 || !data){
            setErr("Login Failed");
        }else{
            localStorage.setItem('role', data.auth);
            localStorage.setItem('loginuser', data.userId);
           setSuccess("Login SuccessFully");
            setTimeout(()=> Navigate('/admin/home'),1000);
        }
    }
    return(
        <>
           <div>
        <h3 class="text-center">Login Form</h3>
        <form class="menuform" method="POST" action='/login' style={{width:"35%"}} onSubmit={(e)=>handleSubmit(e)}>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" value={user.username} name="username" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleChange} autoComplete='off' />
    
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" value={user.password} name="password" class="form-control" id="exampleInputPassword1" onChange={handleChange} autoComplete='off' />
  </div>
 
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
    </div>

    <h3 className='success text-center'>{success}</h3>
    <h3 className='err text-center'>{err}</h3>
        </>
    )
}

export default Login;