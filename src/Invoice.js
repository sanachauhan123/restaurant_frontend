import React, {useEffect, useState, useCallback, useContext} from 'react';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Receipt from '@mui/icons-material/Receipt';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHandPointRight } from "react-icons/fa6";
import dayjs from "dayjs";
import ReactPaginate from "react-paginate";


const API_URL = window.ENV?.API_URL;

export default function Invoice(){
      const navigate = useNavigate();
      const [table,setTable] = useState([]);
      const [allOrders, setAllOrders] = useState([]); // Original data
      const [search, setSearch] = useState("");

      useEffect(()=>{
        const getData = async() =>{
            axios.get(API_URL+'/api/invoice').
            then((res)=>{
                //console.log(res.data);
                setTable(res.data);
                setAllOrders(res.data);
            })
        }
        getData()
      },[])
     // console.log(allOrders)

       // Handle search
      //  useEffect(() => {
      //   const filteredData = allOrders.filter((order) => {
      //     const searchLower = search.toLowerCase();
      
      //     const tableMatch = order.tableNo.toString().includes(searchLower);
      // //console.log(tableMatch)
      //     const formattedDate = dayjs(order.createdAt).format("MM/DD/YYYY");
      //     const dateMatch = formattedDate.includes(searchLower);
      
      //     const tokenMatch = order.orders.some((o) =>
      //       o.orderItems.some(
      //         (item) =>
      //           item.tokenNo && item.tokenNo.toString().includes(searchLower) // Ensure tokenNo exists
      //       )
      //     );
      
      //     const orderItemMatch = order.orders.some((o) =>
      //       o.orderItems.some((item) =>
      //         item.title.toLowerCase().includes(searchLower)
      //       )
      //     );
      
      //     return tableMatch || tokenMatch || orderItemMatch || dateMatch;
      //   });
      // setTable(filteredData)
      //   //console.log(filteredData); // Debugging to check filtered results
      // }, [search, allOrders]);

      useEffect(() => {
        // Assign a billNo before filtering
        const ordersWithBillNo = allOrders.map((order, index) => ({
          ...order,
          billNo: (index + 1).toString(), // Convert to string for search
        }));
      
        const filteredData = ordersWithBillNo.filter((order) => {
          const searchText = search.toLowerCase();
      
          // Check if BillNo matches the search
          const billNoMatch = order.billNo.includes(searchText);
      
          // Check if Table No matches
          const tableMatch = order.tableNo.toString().includes(searchText);
      
          // Check if any order item title matches
          const titleMatch = order.orders.some((orderGroup) =>
            orderGroup.orderItems.some((item) => item.title.toLowerCase().includes(searchText))
          );
      
          // Format the `createdAt` date for search
          const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          });
          const dateMatch = formattedDate.includes(searchText);
      
          // Return true if any condition matches
          return billNoMatch || tableMatch || titleMatch || dateMatch;
        });
      
        setTable(filteredData);
      }, [search, allOrders]);
      
      
    
      //   setTable(filteredData);
      // }, [search, allOrders]);

     // console.log(table.orderItems)
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
        navigate(`/admin/invoice?page=${newPage}`, { replace: true });
      };
    
  
     
    return(
        <>
        <div className='home'>
      <Sidebar />
      <div className='homeContainer'>
        <Navbar />

    <div className='main-container'>
        <div className="center">
    <div className='head_div'>
    <Receipt style={{fontSize:'30px'}} />
        <h4 class="text" >Invoice Detail</h4>
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
      <h1>Invoices</h1>
      
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          cursor:'pointer'
        }}
      >
        <thead>
          <tr>
            <th style={styles.th}></th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>BillNo</th>
            <th style={styles.th}>Table No</th>
            <th style={styles.th}>Item Name</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Quantity</th>
            <th style={styles.th}>Total</th>
          </tr>
        </thead>
        <tbody>
        {currentItems.map((order, index) =>
  order.orders.map((orderGroup, orderIndex) =>
    orderGroup.orderItems.map((item, itemIndex) => {
      // Format the date (MM/DD/YYYY)
      const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

      return (
        <tr key={itemIndex} style={styles.tr} onClick={() => navigate(`/admin/print?id=${order._id}&billNo=${index + 1}`)}>
          {/* Show Table No and Date only for the first row of each table's orders */}
          {itemIndex === 0 && (
            <>
              <td rowSpan={orderGroup.orderItems.length} style={styles.td}>
                <FaHandPointRight />
              </td>
              <td rowSpan={orderGroup.orderItems.length} style={styles.td}>{formattedDate}</td> {/* Display formatted date */}
              <td rowSpan={orderGroup.orderItems.length} style={styles.td}>{order.billNo}</td>
              <td rowSpan={orderGroup.orderItems.length} style={styles.td}>{order.tableNo}</td>
            </>
          )}
          <td style={styles.td}>{item.title}</td>
          <td style={styles.td}>{item.price}</td>
          <td style={styles.td}>{item.quantity}</td>
          <td style={styles.td}>{item.Total}</td>
        </tr>
      );
    })
  )
)}

        </tbody>
      </table>
    </div>
 

          
          </div>
        </div>
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