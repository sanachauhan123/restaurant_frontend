import React,{useState} from "react";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import * as Icons from "@mui/icons-material"; // Import all Material Icons
import { MenuItem, Select } from "@mui/material"; // Import MUI Select dropdown

// http://medium.com/@belloquadriolawale/file-upload-customization-952afc750a87

import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = window.ENV?.API_URL;

function NewCategory(){
    const navigator = useNavigate();
    const [selectedIcon, setSelectedIcon] = useState("Fastfood");

    // List of some Material Icons (You can extend this list)
    const iconNames = Object.keys(Icons).filter(
      (name) => !name.endsWith("Outlined") && !name.endsWith("Rounded") && !name.endsWith("Sharp")
    );
    //console.log(iconNames); 

    const foodIcons = [
      "Fastfood",          // 🍔 Burger / Fast Food
      "Restaurant",        // 🍽️ Restaurant
      "LocalCafe",         // ☕ Coffee
      "Icecream",         // 🍦 Ice Cream
      "LunchDining",      // 🍽️ Dining Plate
      "LocalBar",         // 🍷 Wine / Bar
      "LocalDrink",       // 🥤 Soft Drink
      "BakeryDining",     // 🥐 Bakery
      "RamenDining",      // 🍜 Ramen / Noodles
      "KebabDining",      // 🌯 Kebab
      "EmojiFoodBeverage",// 🥤 Beverage
      "SetMeal",          // 🍱 Meal
      "BrunchDining",     // 🥞 Brunch
      "SoupKitchen",      // 🥣 Soup
      "DinnerDining",     // 🍲 Dinner
      "RiceBowl",
      "LocalDining",
      "Cake",
      "Liquor",
      "EggAlt",
      "LocalPizza"
    ];
    //console.log(foodIcons)
    const [formInputData, setformInputData] = useState(
        {
        cat_name:'',
        file:''
       }
    );
   
    const [previewImage, setPreviewImage] = useState(null);
    const handleChange=(evnt)=>{  
        const newInput = (data)=>({...data, [evnt.target.name]:evnt.target.value})
       setformInputData(newInput)
    }

    const handlePhoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            setformInputData({ ...formInputData, file });
          setPreviewImage(URL.createObjectURL(file));
        }
      };

     const [tableData, setTableData] = useState([])
 
    const SaveData = async(e) =>{
        //console.log('save')
       e.preventDefault();
       const formData = new FormData();
       formData.append('cat_name', formInputData.cat_name);
       formData.append('file', formInputData.file);
       formData.append("icon_name", selectedIcon);
       await axios.post('http://localhost:5000/api/categories', formData)
       .then(res => {
        console.log(res)
        //setTableData(res)
      navigator('/admin/categories')
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
    <AddCircleIcon style={{fontSize:'30px'}} />
        <h4 class="text" >Add Categories </h4>
        <button type="button" className="back_btn" onClick={()=>navigator('/admin/categories')}>Back</button>
        </div>

        <div className="container_box" >
        <div className="row">
        <form onSubmit={SaveData} encType="multipart/form-data" method="POST">
      <div className="row">
        <div className="col-6 text_data">
          <h5>Category Information</h5>
          <p>Enter information for new product category.</p>
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

<div className="col-6 text_data2">
      {/* Native HTML Select Dropdown */}
      <select
        value={selectedIcon}
        onChange={(e) => setSelectedIcon(e.target.value)}
        style={{ padding: "5px", fontSize: "16px", width: "100%" }}
      >
        {foodIcons.map((iconName) => (
          <option key={iconName} value={iconName}>
            {iconName}
          </option>
        ))}
      </select>

      {/* Display Selected Icon */}
      <div style={{ marginTop: "20px" }}>
        {React.createElement(Icons[selectedIcon], { style: { fontSize: 50, color: "#282828" } })}
      </div>
    </div>

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

export default NewCategory;