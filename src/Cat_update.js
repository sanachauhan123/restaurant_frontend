import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from './Navbar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from "axios";
import { useNavigate, useParams, useLocation  } from "react-router-dom";

// let baseURL = '';

// if (process.env.NODE_ENV === 'development') {
//   baseURL = 'http://localhost:5000';
// } else {
//   baseURL = 'http://83.223.113.92:3000';
// }

function Cat_update() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');  // Get the 'id' parameter
  const pageNumber = queryParams.get("page") || 1;

 // console.log(id);  // Log the ID for verification
  const [formInputData, setFormInputData] = useState({
    cat_name: '',
    file: null,
  });

  const [menuItems, setMenuItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch current item data and menu categories
  useEffect(() => {
 // Fetch the existing item data by its ID
    const fetchItemData = async () => {
      try {
        const response = await axios.get(`https://resbackend-three.vercel.app/api/categories`);
        const result = response.data.data
        const foundItem = result.find(item => item._id === id);
        setFormInputData(foundItem); // Set default form values
        //console.log(foundItem)
        // console.log(`${baseURL}/${foundItem.file}`)
        setPreviewImage(foundItem.file); // Set preview image if needed
        //console.log(previewImage)
        setSelectedOption(foundItem.cat); // Set selected category
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };

    fetchItemData();
  }, [id]);
 // console.log(formInputData)

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the form input data
    const updatedData = { ...formInputData, [name]: value };

    setFormInputData(updatedData);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormInputData({ ...formInputData, file: e.target.files[0] });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const updateData = async (e) => {
    e.preventDefault();

    // Create FormData to send file along with other fields
    const formData = new FormData();
    formData.append("cat_name", formInputData.cat_name);
    console.log("Selected File:", formInputData.file); // Debugging log
    // Append the file only if a new one is selected
    if (formInputData.file) {
      if (formInputData.file instanceof File) {
        formData.append("file", formInputData.file); // Upload new file
        console.log("Uploading new file...");
      } else if (typeof formInputData.file === "string") {
        formData.append("existingFile", formInputData.file); // Send existing file if no new file is selected
        console.log("Using existing file:", formInputData.file);
      }
    }

    try {
        await axios.put(`https://resbackend-three.vercel.app/api/categories/${id}`, formData).then((res) => {
            console.log(res);
            navigate(`/admin/categories?page=${pageNumber}`);
        });
    } catch (error) {
        console.error("Error updating data:", error);
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
     <button type="button" className="back_btn" onClick={()=>navigate(`/admin/categories?page=${pageNumber}`)}>Back</button>
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
       <label htmlFor="cat_name">Name</label>
       <input
         type="text"
         name="cat_name"
         id="cat_name"
         value={formInputData.cat_name}
         onChange={handleChange}
         placeholder="Name"
         style={{ width: '100%' }}
         required
       />

       <label>Image</label>
       <div className="image-container" onClick={() => document.getElementById('file').click()}>
         {previewImage ? (
           <div className="image-preview">
             <img
               src={previewImage}
               alt="Preview"
               style={{
                 width: '100%',
                 height: 'auto',
                 borderRadius: '4px',
                 cursor: 'pointer',
               }}
               
             />
           </div>
         ) : (
           <div style={{height:'100px'}}>
           <div className="image-placeholder" style={{ textAlign: 'center', cursor: 'pointer',marginTop:'100px' }}>
             <p style={{ fontSize: '14px', color: '#aaa' }}>
               Drag and drop or click to upload an image
             </p>
           </div>
           </div>
         )}
       </div>

       <input
         id="file"
         type="file"
         name="file"
         accept="image/png, image/jpeg"
         style={{ display: 'none' }}
         onChange={handlePhoto}
       />
     </div>
   </div>

   <div className="card-footer">
     <div className="inline-flex">
       <button type="button" className="cancel_btn" onClick={()=>navigate(`/admin/categories?page=${pageNumber}`)}>
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

export default Cat_update;
