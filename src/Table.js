import React, {useEffect, useState, useCallback, useContext} from 'react';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import TableBar from '@mui/icons-material/TableBar';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from "react-paginate";

const API_URL = window.ENV?.API_URL;

export default function Table(){
      const navigate = useNavigate();
      const [table,setTable] = useState([]);
      const [allOrders, setAllOrders] = useState([]); // Original data
      const [search, setSearch] = useState("");

      useEffect(()=>{
        const getData = async() =>{
            axios.get(API_URL+'/api/table').
            then((res)=>{
                //console.log(res.data.data);
                setTable(res.data.data);
                setAllOrders(res.data.data)
            })
        }
        getData()
      },[])

      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 5; // Change this to adjust items per page
    
      // Get the current page items
      const offset = (currentPage - 1) * itemsPerPage;
      const currentItems = table.slice(offset, offset + itemsPerPage);
      const pageCount = Math.ceil(table.length / itemsPerPage);
    
      // Handle page change
      const handlePageChange = ({ selected }) => {
        const newPage = selected + 1; // ReactPaginate starts from 0, but pages start from 1
        setCurrentPage(newPage);
        navigate(`/admin/table?page=${newPage}`, { replace: true });
      };

        // Handle search
             useEffect(() => {
              const filteredData = allOrders.filter((order) => 
               
              
                  order.addtable.toString().includes(search)
                  
          // Search by table number
                // const formattedDate = dayjs(order.createdAt).format("MM/DD/YYYY");
                // const dateMatch = formattedDate.includes(search);
              
              );
          
              setTable(filteredData);
            }, [search, allOrders]);

            const handleButtonClick = async(id) => {
                navigate(`/admin/table_update?id=${id}&page=${currentPage}`)
              }
            
              const handleDelete = async(id) => {
                alert('Are you sure to delete?')
                try {
                  await axios.delete(`${API_URL}/api/table/${id}`)
                    .then((res) => {
                      console.log(res);
                      // Update the state to remove the deleted item from the table
                      setTable(prevTable => prevTable.filter(item => item._id !== id));
                    });
                } catch (error) {
                  console.error('Error deleting data:', error);
                }
              }
     
    return(
        <>
        <div className='home'>
      <Sidebar />
      <div className='homeContainer'>
        <Navbar />

    <div className='main-container'>
        <div className="center">
    <div className='head_div'>
    <TableBar style={{fontSize:'30px'}} />
        <h4 class="text" >Table Detail</h4>
        <button type="button" className="back_btn" onClick={()=>navigate('/admin/home')}>Back</button>
        </div>
        <div className="container_box" >
        <input
        type="text"
        placeholder="Search "
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
        <br /><br />

        <div style={{ backgroundColor: 'rgb(243 244 246 )',padding:'0.5rem' }}>
                <button className="Add_btn" onClick={()=>navigate('/admin/addtable')} >Add</button>
              </div>

          <div className="row">
          <div style={{ padding: "20px" }}>
      <h1>Table Management</h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Table No</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
        {currentItems.map((item,index)=>(
            <tr key={item._id}>
            <td style={styles.td}>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td style={styles.td}>{item.addtable}</td>
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