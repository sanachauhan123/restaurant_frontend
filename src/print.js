import { useNavigate, useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Receipt from '@mui/icons-material/Receipt';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import axios from 'axios';
import './index.css'

// let baseURL = '';

// if (process.env.NODE_ENV === 'development') {
//   baseURL = 'http://localhost:5000';
// } else {
//   baseURL = 'http://83.223.113.92:3000';
// }

export default function Print() {
  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');  // Get the 'id' parameter
  const billNO = queryParams.get('billNo');
  //console.log(id);  // Log the ID for verification

  const [table, setTable] = useState([]);
  const [name, setName] = useState("");
  const [Gst, setGst] = useState([])

  useEffect(() => {
    const getData = async () => {
      axios.get(`https://resbackend-two.vercel.app/api/invoice`).
        then((res) => {
          //console.log(res.data);
          const result = res.data;
          if (Array.isArray(res.data)) { // Ensure response is an array
            const filteredOrder = res.data.filter((order) => order._id === id);
            //console.log(filteredOrder);
            setTable(filteredOrder);
          } else {
            console.error("Expected an array but got:", res.data);
          }
        })
    }
    getData();
  }, []);

  const receiptRef = useRef();


  const createdAt = table.map((item) => (
    item.createdAt
  ));
  //console.log(createdAt)
  const dateObj = new Date(createdAt);
  const formattedDate = dateObj.toLocaleDateString("en-US"); // Format date
  const formattedTime = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); // Format time

  //console.log(table)

  const allItems = table.flatMap(order =>
    order.orders.flatMap(orderItem =>
      orderItem.orderItems
    )
  );
  const totalQuantity = allItems.reduce((total, item) => total + item.quantity, 0);
  // console.log(totalQuantity)
  const subTotal = allItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace('₹', '').trim()); // Convert price to number
    const totalPrice = parseInt(item.quantity, 10) * price; // Calculate item total
    return total + totalPrice; // Add to total sum
  }, 0).toFixed(2);


  useEffect(() => {
    const getData = async () => {
      await axios.get('https://resbackend-one.vercel.app/gst-rates').then((res) => {
        //console.log(res.data)
        setGst(res.data)
        // setLoading(false)
      })
    }
    getData();
  }, []);

  const cgstRate = Gst.length > 0 ? parseFloat(Gst[0].cgstRate) : 0;
  const sgstRate = Gst.length > 0 ? parseFloat(Gst[0].sgstRate) : 0;

  const cgstAmount = ((subTotal * cgstRate) / 100).toFixed(2);
  const sgstAmount = ((subTotal * sgstRate) / 100).toFixed(2);

  const totalAmount = parseFloat(subTotal) + parseFloat(cgstAmount) + parseFloat(sgstAmount);
  const roundedTotal = Math.floor(totalAmount);
  const roundOffCut = (roundedTotal - totalAmount).toFixed(2);
  

  // console.log("Total Before Rounding: ₹", totalAmount);
  // console.log("Rounded Total: ₹", roundedTotal);
  // console.log("Round-Off Cut Value: ₹", roundOffCut);

  const Token = [
    ...new Set(
      table.flatMap(item =>
        item.orders.flatMap(order =>
          order.orderItems.map(tok => tok.tokenNo)
        )
      )
    )
  ];

  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
    <html>
    <head>
      <style>
        @media print {
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: white;
          }
          .receipt-container {
            width: 79.5mm;
            font-size: 12px;
            padding: 10px;
            border: 1px solid black;
          }
          h2, p, label {
            text-align: center;
            font-size: 14px;
            margin: 5px 0;
          }
          table {
            width: 100%;
            
            text-align: left;
          }
          th, td {
            
            padding: 5px;
          }
          .back_btn, .print-button {
            display: none !important;
          }
                    .print-container {
              display: flex;
              flex-direction: column;
              align-items: flex-end; /* Align to the right */
              width: 79.5mm; /* Exact width for thermal print */
              font-family: Arial, sans-serif;
              font-size: 12px;
            }

            .print-container div {
              display: flex;
              flex-direction: flex-end;
              text-align: right;
              width: 100%;
            }

            .print-row {
              display: flex;
              justify-content: flex-end;
              width: 100%;
              gap: 10px; 
            }

            .print-row p, .print-row b {
              margin: 2px 0;
            }
            .print-section p {
          display: block;
        }
          .print-section p sub_p{
            marginLeft: 10px;

          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">${printContent}</div>
    </body>
    </html>
  `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };


  return (
    <>
      <div className='home' >
        <Sidebar />
        <div className='homeContainer'>
          <Navbar />

          <div className='main-container'>
            <div className="center">
              <div className='head_div' >
                <Receipt style={{ fontSize: '30px' }} />
                <h4 class="text" >Invoice Detail</h4>
                <button type="button" className="back_btn" onClick={() => navigate('/admin/invoice')}>Back</button>
              </div>
              <div className="container_box">
                <div className="row receipt-container" ref={printRef}>
                  <p>RETAIL INVOICE</p>
                  <h2>Foodies</h2>
                  <p>Akshya Nagar 1st Block 1st Cross, Rammurthy Nagar, Bangalore-560016, PH: +91 1451 454 489</p>
                  <hr />

                  <label>Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /></label>

                  <hr />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'flex-start' }}>
                    <div className="print-section">
                      <p>Date: {formattedDate}</p>
                      <p className="sub_p" style={{marginRight:'8px'}}>Cashier: Biller</p>
                      <p className="sub_p" style={{marginRight:'15px'}}>Token No.: {Token.join(", ")}</p>
                    </div>
                    {table.map((item, index) => (
                      <div key={index} style={{ textAlign: "right" }}>
                        <h4>Dine In: {item.tableNo}</h4>
                        <p>Bill No.: {billNO}</p>
                      </div>
                    ))}
                  </div>
                  <hr />

                  <table className="receipt">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Item</th>
                        <th>Qty.</th>
                        <th>Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.map((Order, index) =>
                        Order.orders.map((orderItem) =>
                          orderItem.orderItems.map((item, itemIndex) => {
                            const price = parseFloat(item.price.replace('₹', '').trim());
                            const totalPrice = (parseInt(item.quantity, 10) * parseFloat(price)).toFixed(2);
                            return (
                              <tr key={itemIndex}>
                                <td>{itemIndex + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.quantity}</td>
                                <td>₹{price}</td>
                                <td>₹{totalPrice}</td>
                              </tr>
                            );
                          })
                        )
                      )}
                    </tbody>
                  </table>

                  <hr style={{ width: "100%" }} />
                  <div className="print-container" style={{ display: "flex", justifyContent: "right", gap: "10px" }} >
                    <div className="print-row">
                      <p>Total Qty: {totalQuantity}</p>
                      <p>Sub Total: {subTotal}</p>
                    </div>
                    <div className="print-row">
                      <p>CGST @ {Gst.length > 0 && `${Gst[0].cgstRate}%`}</p>
                      <p>{cgstAmount}</p>
                    </div>
                    <div className="print-row">
                      <p>SGST @ {Gst.length > 0 && `${Gst[0].sgstRate}%`}</p>
                      <p>{sgstAmount}</p>
                    </div>
                    <hr style={{ width: "100%" }} />
                    <div className="print-row">
                      <p>Round off:</p>
                      <p>{roundOffCut}</p>
                    </div>
                    <div className="print-row">
                      <b>Grand Total:</b>
                      <b>₹{roundedTotal}</b>
                    </div>
                  </div>

                  <hr />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={handlePrint} className="print-button" style={{
                    backgroundColor: '#002C54',
                    color: '#ffffff',
                    padding: 5,
                    width: '90px',
                    height: '40px',
                  }}>Print</button>
                </div>

                {/* <div style={{display: 'flex',justifyContent:'flex-end'}}>
        <button onClick={handlePrint} style={{backgroundColor:'#002C54',color:'#ffffff',padding:5,
          width:'90px',height: '40px',
        }}>Print</button>
      </div> */}
              </div>
            </div>
          </div>

        </div>

      </div>


    </>
  );



}