import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from './Navbar';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import axios from "axios";
import { useNavigate, useParams, useLocation  } from "react-router-dom";

const API_URL = window.ENV?.API_URL;

function Menu_update() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageNumber = queryParams.get("page") || 1;
  // /console.log(pageNumber)
  const id = queryParams.get('id');  // Get the 'id' parameter
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

 // console.log(id);  // Log the ID for verification
  const [formInputData, setFormInputData] = useState({
    cat_name: '',
    file: '',
    Categories: '',
    price: '',
    cgstRate: cgstRate, // Default GST percentage
    sgstRate: sgstRate,
    priceWithGST: "", // Calculated total price including GST
  });

  

  const [menuItems, setMenuItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch current item data and menu categories
  useEffect(() => {
    // Fetch the data for the menu categories
    const fetchMenuData = async () => {
      try {
        const response = await fetch(API_URL+'/api/categories');
        const data = await response.json();
        setMenuItems(data.data); // Store the fetched data
      } catch (error) {
        console.error('Error fetching menu categories:', error);
      }
    };

    // Fetch the existing item data by its ID
    const fetchItemData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/menu`);
        const result = response.data.data;
        const foundItem = result.find((item) => item._id === id);
  console.log(foundItem)
        if (foundItem) {
          setFormInputData(foundItem);
          setPreviewImage(foundItem.file);
          console.log(foundItem.file)
          //console.log(`http://stridedge.tech/restaurant${foundItem.file}`)
          // Set selectedOption to the category ID instead of the name
          const selectedCategory = menuItems.find(item => item.cat_name === foundItem.Categories);
          //console.log(selectedCategory)
          if (selectedCategory) {
            setSelectedOption(selectedCategory._id);
          }
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
      }
    };

    fetchMenuData();
    fetchItemData();
  }, [id]);


  // React.useEffect(() => {
  //   if (menuItems.length > 0 && !selectedOption) {
  //     setSelectedOption(menuItems[0]._id);
  //   }
  // }, [menuItems]);
 // console.log(formInputData)

  const handleChange2 = (event) => {
  const selectedId = event.target.value;
 // console.log(selectedId)
  // If the category is changed (i.e., selectedId is different), update the form input data
  if (selectedId !== selectedOption) {
    const selectedCategory = menuItems.find(item => item._id === selectedId);
    //console.log(selectedCategory)
    if (selectedCategory) {
      setSelectedOption(selectedId); // Update the selected ID
      setFormInputData({
        ...formInputData,
        Categories: selectedCategory.cat_name, // Update category name in formInputData
      });
    }
  }
};
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
//console.log(updatedData)
    setFormInputData(updatedData);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormInputData({ ...formInputData, file });
      setPreviewImage(URL.createObjectURL(file));
  }
  };
  //console.log(formInputData.Categories)
  // console.log(formInputData.file)
  const updateData = async (e) => {
    e.preventDefault();

    // Create FormData to send file along with other fields
    const formData = new FormData();
    formData.append("cat_name", formInputData.cat_name);
    formData.append("Categories", formInputData.Categories);
    formData.append("price", formInputData.price);
    formData.append("priceWithGST", formInputData.priceWithGST);

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
        await axios.put(`${API_URL}/api/menu/${id}`, formData).then((res) => {
            console.log(res);
            navigate(`/admin/item?page=${pageNumber}`, { replace: true });
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
                <FormatListBulletedRoundedIcon style={{ fontSize: '30px' }} />
                <h4 className="text">Edit Food Item</h4>
                <button type="button" className="back_btn" onClick={() => navigate(`/admin/item?page=${pageNumber}`)}>Back</button>
              </div>

              <div className="container_box">
                <div className="row">
                  <form onSubmit={updateData} encType="multipart/form-data" method="POST">
                    <div className="row">
                      <div className="col-6 text_data">
                        <h5>Edit Item</h5>
                        <p>Update the details of the dish.</p>
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
                        <select value={selectedOption || ""} onChange={handleChange2}>
  {selectedOption ? null : (
    <option value="">{formInputData.Categories || "Select a category"}</option>
  )}
  {menuItems.map((item) => (
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

                        {/* <label htmlFor="gstPercentage">GST (%)</label>
                        <input type="text"  id="cgst"
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
                            <div style={{ height: '100px' }}>
                              <div className="image-placeholder" style={{ textAlign: 'center', cursor: 'pointer', marginTop: '100px' }}>
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
                        <button type="button" className="cancel_btn" onClick={()=>navigate(`/admin/item?page=${pageNumber}`)}>
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

export default Menu_update;
