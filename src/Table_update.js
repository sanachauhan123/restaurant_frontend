import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from './Navbar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from "axios";
import { useNavigate, useParams, useLocation  } from "react-router-dom";

let baseURL = '';

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:5000';
} else {
  baseURL = 'http://83.223.113.92:3000';
}

function Table_update() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');  // Get the 'id' parameter
  const pageNumber = queryParams.get("page") || 1;
 // console.log(id);  // Log the ID for verification
  const [formInputData, setFormInputData] = useState({
    addtable: '',
  });

  // Fetch current item data and menu categories
  useEffect(() => {
 // Fetch the existing item data by its ID
    const fetchItemData = async () => {
      try {
        const response = await axios.get(`https://resbackend-two.vercel.app/api/table`);
        const result = response.data.data;
       // console.log(result)
        const foundItem = result.find(item => item._id === id);
        //console.log(foundItem)
        if (foundItem) {
            setFormInputData({ addtable: foundItem.addtable || '' }); // Ensure proper structure
        }
        //console.log(foundItem)
        // console.log(`${baseURL}/${foundItem.file}`)
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };

    fetchItemData();
  }, [id]);
 // console.log(formInputData)

 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInputData((prev) => ({ ...prev, [name]: value }));
};
  

  const updateData = async (e) => {
    e.preventDefault();
    const {addtable} = formInputData;
    // Create FormData to send file along with other fields
    // const formData = new FormData();
    // formData.append("addtable", formInputData.addtable);
    // console.log(formData)
    try {
        const res = await fetch(`https://resbackend-two.vercel.app/api/table/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ addtable })
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Update successful:", data);
        navigate(`/admin/table?page=${pageNumber}`, { replace: true });
    } catch (error) {
        console.error("Error updating data:", error.message);
    }
};

  return (
    <>
    <div className='home'>
   <Sidebar />
   <div className='homeContainer'>
     <Navbar />
     
     <div className="main-container">
     <div className="center">
     <div className='head_div'>
 <AddCircleIcon style={{fontSize:'30px'}} />
     <h4 class="text" >Update Categories </h4>
     <button type="button" className="back_btn" onClick={()=>navigate(`/admin/table?page=${pageNumber}`)}>Back</button>
     </div>

     <div className="container_box" >
     <div className="row">
     <form onSubmit={updateData} encType="multipart/form-data" method="POST">
   <div className="row">
     <div className="col-6 text_data">
       <h5>Category Information</h5>
       <p>Enter information for update product category.</p>
     </div>

     <div className="col-6 text_data2">
       <label htmlFor="addtable">TableNo.</label>
       <input
         type="text"
         name="addtable"
         id="addtable"
         value={formInputData.addtable || ''}
         onChange={handleChange}
         placeholder="tableNo."
         style={{ width: '100%' }}
         
       />

     </div>
   </div>

   <div className="card-footer">
     <div className="inline-flex">
       <button type="button" className="cancel_btn" onClick={()=>navigate(`/admin/table?page=${pageNumber}`)}>
         Cancel
       </button>
       <button type="submit" className="save_btn">
         Update
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
  );
}

export default Table_update;
