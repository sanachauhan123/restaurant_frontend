import React, {useEffect, useState, useCallback, useContext} from 'react';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from "react-paginate";

const API_URL = process.env.REACT_APP_API_URL;

function Categories() {
  const navigate = useNavigate()
   const [tableData, setTableData] = useState([]);
   const [table,setTable] = useState([])
  const [formInputData, setformInputData] = useState(
      {
      catname:'',
      file:''
     }
  );

 const location = useLocation();

    // Pagination state
    //const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Change this to adjust items per page
    const queryParams = new URLSearchParams(location.search);
const pageFromURL = parseInt(queryParams.get("page")) || 1;

const [currentPage, setCurrentPage] = useState(pageFromURL); // Initialize from URL
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
      axios.get(`https://resbackend-three.vercel.app/api/categories`).then((res)=>{
        //console.log(res.data.data)
        setTable(res.data.data)
        setAllOrders(res.data.data);
      })
    }
    getData()
  },[]);
  
  const handleButtonClick = async(id) => {
    navigate(`/admin/Cat_update?id=${id}&page=${currentPage}`)
  }

  const handleDelete = async(id) => {
    alert('Are you sure to delete?')
    try {
      await axios.delete(`https://resbackend-three.vercel.app/api/categories/${id}`)
        .then((res) => {
          console.log(res);
          // Update the state to remove the deleted item from the table
          setTable(prevTable => prevTable.filter(item => item._id !== id));
        });
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }
  
  const offset = (currentPage - 1) * itemsPerPage;
  const currentItems = table.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(table.length / itemsPerPage);

  // Handle page change
  const handlePageChange = ({ selected }) => {
   const newPage = selected + 1; // ReactPaginate starts from 0, but pages start from 1
   setCurrentPage(newPage);
   navigate(`/admin/categories?page=${newPage}`, { replace: true });
 };

 // Handle search
          useEffect(() => {
           const filteredData = allOrders.filter((order) => {
       //console.log(order)
             const orderItemMatch =
                 order.cat_name.toLowerCase().includes(search.toLowerCase()) // Search by item title
             
             return orderItemMatch 
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
    <CategoryRoundedIcon style={{fontSize:'30px'}} />
        <h4 class="text" >Food Categories </h4>
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
                <button className="Add_btn" onClick={()=>navigate('/admin/categories/new')} >Add</button>
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
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
         {currentItems.map((item,index) => (
            <tr key={item._id}>
              <td style={styles.td}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td style={styles.td}>{item.cat_name}</td>
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
export default Categories;

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
  }
};