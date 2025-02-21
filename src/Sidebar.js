import React from "react";
import CookieIcon from '@mui/icons-material/Cookie';
import FoodBankRoundedIcon from '@mui/icons-material/FoodBankRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import TakeoutDiningRoundedIcon from '@mui/icons-material/TakeoutDiningRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import SegmentRoundedIcon from '@mui/icons-material/SegmentRounded';
import TableBar from '@mui/icons-material/TableBar';
import BallotIcon from '@mui/icons-material/Ballot';
import Receipt from '@mui/icons-material/Receipt';
import LogoutIcon from '@mui/icons-material/Logout';
import RateReviewIcon from '@mui/icons-material/RateReview';

import { useNavigate } from "react-router-dom";

function Sidebar(){
    const navigator = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("loginuser");
        navigator("/login", { replace: true });
      };
    return(
        <>
       <div className="sidebar">
        <div className="top" onClick={()=>navigator('/admin/home')}>
            <FoodBankRoundedIcon style={{color:'#FCFCFA',fontSize:40}} />
            <span className="logo">Food App</span>
        </div>
        <hr />
        <div className="center">
            <ul className="panel">
                
                <li onClick={()=>navigator('/admin/dashboard')}>
                <CookieIcon className="icon" />
                <span>Dashboard</span>
                </li>
            </ul>
            <ul className="panel">
               
                {/* <li>
                <SummarizeRoundedIcon className="icon" />
                <span>Sales</span>
                </li> */}
            </ul>

            {/* <p className="title">Portals</p>
            <ul>
                
                <li>
                <TakeoutDiningRoundedIcon className="icon" />
                <span>POS</span>
                </li>
            </ul>
            <ul>
                
                <li>
                <RestaurantRoundedIcon className="icon" />
                <span>Kitchen</span>
                </li>
            </ul> */}

            <p className="title">Foods</p>
            <ul className="panel">
                
                <li onClick={()=>navigator('/admin/categories')}>
                <CategoryRoundedIcon className="icon" />
                <span>Menu Categories</span>
                </li>
            </ul>
            <ul className="panel">
                
                <li onClick={()=>{navigator('/admin/item')}}>
                <FormatListBulletedRoundedIcon className="icon" />
                <span>Menu Items</span>
                </li>
            </ul>
            <ul className="panel">
                
                <li onClick={()=>navigator('/admin/order')}>
                    <BallotIcon className="icon" />
                <span>Order</span>
                </li>
            </ul>
            <ul className="panel">
              
                <li onClick={()=>navigator('/admin/table')}>
                    <TableBar className="icon" />
                <span>Table Management</span>
                </li>
            </ul>

            <ul className="panel">
            <li onClick={()=>navigator('/admin/gst')}>
                    <RateReviewIcon className="icon" />
                <span>GST</span>
                </li>
            </ul>

        <ul className="panel">
            <li onClick={()=>navigator('/admin/invoice')}>
                    <Receipt className="icon" />
                <span>Invoice</span>
                </li>
            </ul>

            <ul className="panel">
            <li onClick={handleLogout}>
                    <LogoutIcon className="icon" />
                <span>Logout</span>
                </li>
            </ul>
            
        </div>
        {/* <div className="bottom">Bottom</div> */}
       </div>
      
        </>
    )
}

export default Sidebar;