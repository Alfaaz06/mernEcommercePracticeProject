import './App.css';
import { Header } from "./component/layout/Header.jsx"
import { Footer } from "./component/layout/Footer"
import { BrowserRouter as Router, Route,Switch } from "react-router-dom"
import WebFont from "webfontloader";
import React from 'react';
import { Home } from './component/Home';
import { ProductDetails } from './component/Product/ProductDetails.jsx'
import { Products } from './component/Product/Products.jsx'
import { Search } from './component/Search.jsx'
import { LoginSign } from './component/user/LoginSign'
import store from './Store'
import { loadUser } from './actions/userAction';
import { UserOptions } from './component/layout/UserOptions.jsx'
import { useSelector } from 'react-redux';
import { Profile } from './component/Profile/Profile.jsx'
import { ProtectedRoute } from './routes/ProtectedRoute';
import { UpdateProfile } from './component/Update/UpdateProfile.jsx'
import { UpdatePassword } from './component/Update/UpdatePassword.jsx'
import { ForgotPassword } from './component/ForgotPassword.jsx'
import { Cart } from './component/Cart/Cart.jsx'
import { ResetPassword } from './component/ResetPassword.jsx'
import { Shipping } from './component/Shipping.jsx'
import { ConfirmOrder } from './component/Order/ConfirmOrder.jsx'
import axios from 'axios';
import { Payment } from './component/Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'
import {Success} from './component/Success'
import {MyOrders} from './component/Order/MyOrders'
import {OrderDetails} from './component/Order/OrderDetails'
import {Dashboard} from './component/admin/Dashboard';
import {ProductList} from './component/admin/ProductList'
import { NewProduct } from './component/admin/NewProduct';
import {UpdateProduct} from './component/admin/UpdateProduct.jsx'
import { OrderList } from './component/admin/OrderList';
import { UpdateOrder } from './component/admin/UpdateOrder';
import {UserList} from './component/admin/UserList.jsx'
import {UpdateUser} from './component/admin/UpdateUser.jsx'
import { ProductReviews } from './component/admin/ProductReviews';
import { Contact } from './component/Contact/Contact';
import {About} from './component/Contact/About'
import {PageNotFound} from './component/ERROR/PageNotFound'

function App() {

  const { user, isAuthenticated } = useSelector(state => state.user)

  const [stripeApiKey, setStripeApiKey] = React.useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey")
    setStripeApiKey(data.stripeApiKey);
  }

  window.addEventListener("contextmenu",(e)=>e.preventDefault());


  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    });
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  return (
    <>
      <Router>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}

        {
          stripeApiKey && (<Elements stripe={loadStripe(stripeApiKey)}>
            <ProtectedRoute exact path="/process/payment" component={Payment} />
          </Elements>)
        }

<Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/products" component={Products} />
        <Route path="/products/:keyword" component={Products} />
        <Route exact path="/search" component={Search} />
        <ProtectedRoute exact path="/account" component={Profile} />
        <ProtectedRoute exact path="/me/update" component={UpdateProfile} />
        <ProtectedRoute exact path='/password/update' component={UpdatePassword} />
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={ResetPassword} />
        <Route exact path="/login" component={LoginSign} />
        <Route exact path="/cart" component={Cart} />
        <ProtectedRoute exact path="/shipping" component={Shipping} />

        <ProtectedRoute exact path="/success" component={Success}/>
        <ProtectedRoute exact path="/orders" component={MyOrders}/>

       <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder} />
       <ProtectedRoute exact path="/order/:id" component={OrderDetails}/>

       <ProtectedRoute   isAdmin={true}   exact path="/admin/dashboard" component={Dashboard}/>
       <ProtectedRoute   isAdmin={true}   exact path="/admin/products" component={ProductList}/>
       <ProtectedRoute   isAdmin={true}   exact path="/admin/product" component={NewProduct}/>
       <ProtectedRoute   isAdmin={true}   exact path="/admin/orders" component={OrderList}/>
       <ProtectedRoute   isAdmin={true}   exact path="/admin/order/:id" component={UpdateOrder}/>
       <ProtectedRoute   isAdmin={true}   exact path="/admin/product/:id" component={UpdateProduct}/>
       <ProtectedRoute   isAdmin={true}   exact path="/admin/users" component={UserList}/>
       <ProtectedRoute   isAdmin={true}   exact path="/admin/user/:id" component={UpdateUser}/>
       <ProtectedRoute   isAdmin={true}   exact path="/admin/reviews" component={ProductReviews}/>
       <Route exact path="/contact" component={Contact} />
       <Route exact path="/about" component={About} />
       <Route component={window.location.pathname==="/process/payment"?null:PageNotFound} />
       </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
