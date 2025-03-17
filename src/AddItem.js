import React, {useEffect, useState, useCallback, useContext} from 'react';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from "react-paginate";

const API_URL = process.env.REACT_APP_API_URL;

function AddItem() {
  const navigate = useNavigate();
  const location = useLocation();

    // Pagination state
    //const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Change this to adjust items per page
    const queryParams = new URLSearchParams(location.search);
const pageFromURL = parseInt(queryParams.get("page")) || 1;

const [currentPage, setCurrentPage] = useState(pageFromURL); // Initialize from URL

useEffect(() => {
  setCurrentPage(pageFromURL); // Update if URL changes
}, [pageFromURL]);
  const [table,setTable] = useState([])
   const [tableData, setTableData] = useState([])
  const [formInputData, setformInputData] = useState(
      {
      catname:'',
      file:''
     }
  );
  const [allOrders, setAllOrders] = useState([]); // Original data
  const [search, setSearch] = useState("");
 
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (!queryParams.get("page")) {
      navigate(`${location.pathname}?page=1`, { replace: true });
    }
  }, [location, navigate]);
   
  const handleSubmit= async(evnt) =>{
      evnt.preventDefault();
      const checkEmptyInput = !Object.values(formInputData).every(res=>res==="")
      if(checkEmptyInput)
      {
       const newData = (data)=>([...data, formInputData])
       setTableData(newData);
       const emptyInput= {itemname:'', price:''}
       setformInputData(emptyInput)
       //window.location.reload();
      }
         
 
  }  

  useEffect(()=>{
    const getData = async() =>{
      axios.get("https://resbackend-three.vercel.app/api/menu").
      then((res)=>{
        const result = res.data.data;
        //console.log(result);
        setTable(result);
        setAllOrders(result);
      })
    }
    getData()
  },[]);

  
 
//  console.log(currentPage)

  const handleButtonClick = async(id) => {
    navigate(`/admin/menu_update?id=${id}&page=${currentPage}`)
  }

  const handleDelete = async(id) => {
    alert('Are you sure to delete?')
    try {
      await axios.delete(`${API_URL}/api/menu/${id}`)
        .then((res) => {
          console.log(res);
          // Update the state to remove the deleted item from the table
          setTable(prevTable => prevTable.filter(item => item._id !== id));
        });
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

 //console.log(table)
   // Get the current page items
   const offset = (currentPage - 1) * itemsPerPage;
   const currentItems = table.slice(offset, offset + itemsPerPage);
   const pageCount = Math.ceil(table.length / itemsPerPage);
 
   // Handle page change
   const handlePageChange = ({ selected }) => {
    const newPage = selected + 1; // ReactPaginate starts from 0, but pages start from 1
    setCurrentPage(newPage);
    navigate(`/admin/item?page=${newPage}`, { replace: true });
  };

   // Handle search
         useEffect(() => {
          const ordersWithSerialNumber = allOrders.map((order, index) => ({
            ...order,
            id: (index + 1).toString(), // Convert to string for search
          }));
        
          const filteredData = ordersWithSerialNumber.filter((order) => {
      //console.log(order)
      const serialMatch = order.id.includes(search);
            const tokenMatch = 
                order.Categories.toLowerCase().includes(search.toLowerCase())
            const orderItemMatch =
                order.cat_name.toLowerCase().includes(search.toLowerCase()) // Search by item title
            
            return orderItemMatch || tokenMatch || serialMatch;
          });
      
          setTable(filteredData);
        }, [search, allOrders]);
  

  return (
    <>
     <div className='home'>
      <Sidebar />
      <div className='homeContainer'>
        <Navbar />

    <div className='main-container'>
        <div className="center">
    <div className='head_div'>
    <FormatListBulletedRoundedIcon style={{fontSize:'30px'}} />
        <h4 class="text" >Food Items </h4>
        <button type="button" className="back_btn" onClick={()=>navigate('/admin/home')}>Back</button>
        </div>
        <div className="container_box" >
          <div className="row">

            <form method="POST" onSubmit={handleSubmit} class="border border-light" encType='multipart/form-data' >

            <input
        type="text"
        placeholder="Search "
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
              <br /><br />
            
              <div style={{ backgroundColor: 'rgb(243 244 246 )',padding:'0.5rem' }}>
                <button className="Add_btn" onClick={()=>navigate('/admin/newItem')} >Add</button>
              </div>
              
              <div style={{ padding: "20px" }}>
      {/* <h1>Orders</h1> */}
      <table
        style={styles.table}
      >
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>ItemName</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>PriceWithGST</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
         {currentItems.map((item,index) => (
            <tr key={item._id}>
              <td style={styles.td}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td style={styles.td}>{item.cat_name}</td>
              <td style={styles.td}>{item.Categories}</td>
              <td style={styles.td}>{item.price}</td>
              <td style={styles.td}>{item.priceWithGST}</td>
              <td style={styles.td}>
      {/* Button */}
      <button 
        style={styles.button} 
        onClick={() => handleButtonClick(item._id)}
      >
        Update
      </button>
      <button 
        style={styles.button2} 
        onClick={() => handleDelete(item._id)}
      >
        Delete
      </button>
    </td>
            </tr>
         ))}
         
        </tbody>
      </table>
    </div>
            
            </form>
          </div>
        </div>

         {/* Pagination Controls */}
    <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              activeClassName={"active"}
              forcePage={currentPage - 1}
            />
            
      </div>
</div>

      </div>
      </div>


    </>
  )
}
export default AddItem;

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    fontSize: "16px",
    textAlign: "left",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f4f4f4",
    textAlign: "left",
    fontWeight: "bold",
  },
  td: {
    border: "1px solid #ddd", // Black border for table cells
    padding: "8px",
    verticalAlign: "top",
  },
  tr: {
    backgroundColor: "#f9f9f9",
    
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  button2: {
    padding: "8px 12px",
    backgroundColor: "#D22B2B",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: 10
  },
  
};