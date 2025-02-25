import React, { createContext, useReducer } from 'react';
import Signup from './Signup';
import Login from './Login';
import AddTable from './AddTable';
import Categories from './Categories';
import NewCategory from './newcat';
import Dashboard from './Dashboard';
import Main from './Main';
import Sidebar from './Sidebar';
import NewItems from "./NewItems";
import Home from './Home';
import AddItem from './AddItem';
import Order from './Order';
import Menu_update from './Menu_update';
import Cat_update from './Cat_update';
import Table_update from './Table_update';
import Invoice from './Invoice';
import Print from './print'
import Gst from './Gst';
import PrivateRoute from './PrivateRoute';
import Table from './Table';

import { BrowserRouter as Router ,Routes,Route } from 'react-router-dom';
import {reducer,initialState} from './reducer/useReducer';

export const UserContext = createContext();

function App() {

  const Routing = () =>{
    return (
      <>
      {/*<BrowserRouter basename='/'>*/}
      <Router>
      <Routes>
        {/* Public Routes */}
        <Route exact path="/" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route exact path="/admin/addtable" element={<PrivateRoute element={<AddTable />} />} />
        <Route exact path="/admin/table" element={<PrivateRoute element={<Table />} />} />
        <Route exact path="/admin/categories" element={<PrivateRoute element={<Categories />} />} />
        <Route exact path="/admin/categories/new" element={<PrivateRoute element={<NewCategory />} />} />
        <Route exact path="/Main" element={<PrivateRoute element={<Main />} />} />
        <Route exact path="/admin/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route exact path="/admin/sidebar" element={<PrivateRoute element={<Sidebar />} />} />
        <Route exact path="/admin/item" element={<PrivateRoute element={<AddItem />} />} />
        <Route exact path="/admin/newItem" element={<PrivateRoute element={<NewItems />} />} />
        <Route exact path="/admin/home" element={<PrivateRoute element={<Home />} />} />
        <Route exact path="/admin/order" element={<PrivateRoute element={<Order />} />} />
        <Route exact path="/admin/menu_update" element={<PrivateRoute element={<Menu_update />} />} />
        <Route exact path="/admin/cat_update" element={<PrivateRoute element={<Cat_update />} />} />
        <Route exact path="/admin/table_update" element={<PrivateRoute element={<Table_update />} />} />
        <Route exact path="/admin/invoice" element={<PrivateRoute element={<Invoice />} />} />
        <Route exact path="/admin/print" element={<PrivateRoute element={<Print />} />} />
        <Route exact path="/admin/gst" element={<PrivateRoute element={<Gst />} />} />
      </Routes>
     </Router>
      </>
    )
  }

  const [State, dispatch] = useReducer(reducer, initialState);
  return(
    <>
    <UserContext.Provider value={{State,dispatch}} >
      <Routing />
      </UserContext.Provider>
    </>
  )
  
}

export default App;
