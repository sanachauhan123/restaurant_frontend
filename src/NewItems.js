import React,{useState,useEffect} from "react";
import Sidebar from "./Sidebar";
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

function NewItems(){
    const navigator = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [data,setData] = useState([]);
    const[loading,setLoading] = useState(false);
    useEffect(()=>{
        const getData = async() =>{
            setLoading(true)
            await axios.get(API_URL+'/gst-rates').then((res)=>{
                //console.log(res.data)
                setData(res.data)
               // setLoading(false)
            })
        }
        getData();
    },[loading]);

    const cgstRate = data.length > 0 && data[0].cgstRate && data[0].cgstRate ;
      //console.log(cgstRate)
      const sgstRate = data.length > 0 && data[0].sgstRate && data[0].sgstRate ;

    const [formInputData, setformInputData] = useState(
      {
      cat_name:'',
      file:'',
      Categories:'',
      price:'',
      cgstRate: cgstRate, // Default GST percentage
      sgstRate: sgstRate,
      priceWithGST: "", // Calculated total price including GST
     }
  );

  const [menuItems, setMenuItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange2 = (event) => {
    const selectedId = event.target.value;
    const selectedCategory = menuItems.find(item => item._id === selectedId);
  console.log(selectedCategory.cat_name)
    setSelectedOption(selectedId); // Save the ID as the selected option
    setformInputData({
      ...formInputData,
      Categories: selectedCategory.cat_name , // Save the name
    });
  };

// Handle image file selection

useEffect(() => {
  // Fetch the data from the API
  const fetchMenuData = async () => {
    try {
      const response = await fetch(API_URL+'/api/categories');
      const data = await response.json();
      setMenuItems(data.data); // Store the fetched data
      //console.log(data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchMenuData();
}, []); 
//console.log(menuItems)
 
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the form input data
    const updatedData = { ...formInputData, [name]: value };

    // Calculate price with GST if price is updated
    if (name === "price") {
      // Convert CGST and SGST rates to numbers (assuming they are in percentage form as strings)
      const cgstPercentage = parseFloat(cgstRate) || 0; // fallback to 0 if parsing fails
      const sgstPercentage = parseFloat(sgstRate) || 0; // fallback to 0 if parsing fails
      
      // Sum CGST and SGST to get the total GST percentage
      const gstPercentage = cgstPercentage + sgstPercentage;
    
      // Ensure price is a valid number
      const price = parseFloat(value) || 0; // default to 0 if parsing fails
    
      // Calculate the price with GST
      const priceWithGST = price + (price * gstPercentage) / 100;
    
      // Update the data with the calculated price with GST
      updatedData.priceWithGST = priceWithGST.toFixed(2); // Convert to string with 2 decimal places
    }
    

    setformInputData(updatedData);
  };

  const handlePhoto = (e) => {
      const file = e.target.files[0];
      if (file) {
          setformInputData({ ...formInputData, file });
        setPreviewImage(URL.createObjectURL(file));
      }
    };

  const SaveData = async(e) =>{
      //console.log('save')
     e.preventDefault();
    //  const shortFileUrl = formInputData.file ? createShortFilePath(formInputData.file) : "";
     const formData = new FormData();
     formData.append('cat_name', formInputData.cat_name);
     formData.append('Categories', formInputData.Categories);
     formData.append('price', formInputData.price);
     formData.append('file', formInputData.file);
     formData.append("priceWithGST", formInputData.priceWithGST);
     await axios.post(API_URL+'/api/menu', formData)
     .then(res => {
      console.log(res);
      navigator('/admin/item')
      //setTableData(res)
      //setIsSaved(true);
      //setFile(res)
        //window.location.replace('/admin/categories',tableData);
     })
     .catch(err => console.log(err))
      
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
   <FormatListBulletedRoundedIcon style={{fontSize:'30px'}} />
   <h4 class="text" >Food Items </h4>
   <button type="button" className="back_btn" onClick={()=>navigator('/admin/item')}>Back</button>
   </div>

   <div className="container_box" >
   <div className="row">
   <form onSubmit={SaveData} encType="multipart/form-data" method="POST">
 <div className="row">
   <div className="col-6 text_data">
     <h5>Add New Item</h5>
     <p>Enter The New Dish.</p>
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
     <label htmlFor="cat">Category</label>
     <select value={selectedOption} onChange={handleChange2} required>
        <option value="">Select an item...</option>
        {menuItems.map(item => (
          <option key={item._id} value={item._id}>
            {item.cat_name}
          </option>
        ))}
      </select>

      <label htmlFor="price">Price</label>
     <input
       type="text"
       name="price"
       id="price"
       value={formInputData.price}
       onChange={handleChange}
       placeholder="Price"
       style={{ width: '100%' }}
       required
     />

{/* <label htmlFor="cgst">GST (%)</label> */}
      {/* <input
        type="text"
        name="cgst"
        id="cgst"
        value={formInputData.gstPercentage}

        style={{ width: "100%", marginBottom: "10px" }}
        readonly 
      /> */}
       {/* <input type="text"  id="cgst"
        value={`${cgstRate}%`}
        style={{ width: "100%", marginBottom: "10px" }} readonly />

        <input type="text"  id="sgst"
        value={`${sgstRate}%`}
        style={{ width: "100%", marginBottom: "10px" }} readonly />

      <p>
        <strong>Total Price (Including GST): ₹{formInputData.priceWithGST || "0.00"}</strong>
      </p> */}

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
       required
     />


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

export default NewItems;