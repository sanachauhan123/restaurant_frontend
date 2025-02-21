import React from "react";
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import { useNavigate } from "react-router-dom";

function Navbar(){
    const navigate = useNavigate();
    const handleNavigate = () =>{
        navigate('/login')
    }
return(
    <>
    <div className="navbar">
        <div className="wrapper">
            {/* <div className="search">
    <input type="text" placeholder="search..." />
    <SearchIcon />
            </div> */}
            <div className="items">
                {/* <div className="item">
                    <LanguageOutlinedIcon className="icon" />
                </div> */}
                <div className="item">
                    <AccountBoxOutlinedIcon className="avatar" onClick={handleNavigate} />
                </div>
            </div>
        </div>
    </div>
    </>
)
}

export default Navbar;