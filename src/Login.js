import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL:", API_URL);

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
        const res = await fetch(API_URL+'/api/login',{
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