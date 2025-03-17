import React, {useEffect, useState, useCallback, useContext} from 'react';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import BallotIcon from '@mui/icons-material/Ballot'
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from "react-paginate";

const API_URL = process.env.REACT_APP_API_URL;

export default function Order(){
      const navigate = useNavigate();
      const [table,setTable] = useState([]);
      const [allOrders, setAllOrders] = useState([]); // Original data
      const [search, setSearch] = useState("");

      useEffect(()=>{
        const getData = async() =>{
            axios.get(API_URL+'/api/ordered').
            then((res)=>{
                //console.log(res.data);
                setTable(res.data);
                setAllOrders(res.data)
            })
        }
        getData()
      })

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
        navigate(`/admin/order?page=${newPage}`, { replace: true });
      };

        // Handle search
             useEffect(() => {
              const filteredData = allOrders.filter((order) => {
                const tableMatch = order.orderItems.some((item) =>
              
                  item.tableNo.toString().includes(search)
                  
              ); // Search by table number
                // const formattedDate = dayjs(order.createdAt).format("MM/DD/YYYY");
                // const dateMatch = formattedDate.includes(search);
                const tokenMatch = order.orderItems.some((item) =>
              
                  item.tokenNo && item.tokenNo.toString().includes(search)
                  
                ); 
                
                const orderItemMatch = order.orderItems.some((item) =>
                 
                    item.title.toLowerCase().includes(search.toLowerCase()) // Search by item title
                  
                );
          
                return tableMatch || tokenMatch || orderItemMatch
              });
          
              setTable(filteredData);
            }, [search, allOrders]);


            const [categories, setCategories] = useState([]);

            useEffect(() => {
                fetch(API_URL+"/api/categories")
                    .then((res) => res.json())
                    .then((data) => console.log(data))
                    .catch((err) => console.error(err));
            }, []);
     
    return(
        <>
        <div className='home'>
      <Sidebar />
      <div className='homeContainer'>
        <Navbar />

    <div className='main-container'>
        <div className="center">
    <div className='head_div'>
    <BallotIcon style={{fontSize:'30px'}} />
        <h4 class="text" >Order Detail</h4>
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
          <div className="row">
          <div style={{ padding: "20px" }}>
      <h1>Orders</h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={styles.th}>Order ID</th>
            <th style={styles.th}>Table No</th>
            <th style={styles.th}>Item Name</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((order) =>
            order.orderItems.map((item, index) => (
              <tr key={`${order._id}-${index}`} style={styles.tr}>
                {/* Display Order ID and Table No only once for the first item */}
                {index === 0 && (
                  <>
                    <td style={styles.td} rowSpan={order.orderItems.length}>
                      {order._id}
                    </td>
                    <td style={styles.td} rowSpan={order.orderItems.length}>
                      {item.tableNo}
                    </td>
                  </>
                )}
                <td style={styles.td}>{item.title}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>{item.price}</td>
                {index === 0 && (
                  <td style={styles.td} rowSpan={order.orderItems.length}>
                    ₹
                    {order.orderItems
                      .reduce(
                        (acc, item) => acc + parseFloat(item.Total.slice(1)),
                        0
                      )
                      .toFixed(2)}
                  </td>
                )}
              </tr>
            ))
          )}
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
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f4f4f4",
    textAlign: "left",
    fontWeight: "bold",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    verticalAlign: "top",
  },
  tr: {
    backgroundColor: "#f9f9f9",
  },
};