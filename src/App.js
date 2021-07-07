import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";

import AddProduct from './components/AddProduct';
import AddSeller from './components/AddSeller'
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';
import SellerList from './components/SellerList'
import logo from './pictures/logo.png';
import Context from "./Context";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {},
      products: [],
        sellers: []
    };
    this.routerRef = React.createRef();
  }

    async componentDidMount() {
        let user = localStorage.getItem("user");
        let cart = localStorage.getItem("cart");

        //const products = await axios.get('http://localhost:3001/products');
        const products = await axios.get('https://handicraftsales.herokuapp.com/products');
        const sellers = await axios.get('https://handicraftsales.herokuapp.com/sellers');
        user = user ? JSON.parse(user) : null;
        cart = cart? JSON.parse(cart) : {};

        this.setState({ user,  products: products.data, sellers: sellers.data, cart });
    }

    checkout = () => {

        const cart = this.state.cart;

        const products = this.state.products.map(p => {
            if (cart[p.name]) {
                p.stock = p.stock - cart[p.name].amount;

                axios.patch('https://handicraftsales.herokuapp.com/products/setAmount/'+ p.id + '/' + p.stock);

            }
            return p;
        });

        this.setState({ products });
        this.clearCart();
    };

    addToCart = cartItem => {
        let cart = this.state.cart;
        if (cart[cartItem.id]) {
            cart[cartItem.id].amount += cartItem.amount;
        } else {
            cart[cartItem.id] = cartItem;
        }
        if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
            cart[cartItem.id].amount = cart[cartItem.id].product.stock;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        this.setState({ cart });
    };

    removeFromCart = cartItemId => {
        let cart = this.state.cart;
        delete cart[cartItemId];
        localStorage.setItem("cart", JSON.stringify(cart));
        this.setState({ cart });
    };

    clearCart = () => {
        let cart = {};
        localStorage.removeItem("cart");
        this.setState({ cart });
    };

    login = async (email, password) => {
        const res = await axios.post(
            'http://localhost:8080/login',
            { email, password },
        ).catch((res) => {
            return { status: 401, message: 'Unauthorized' }
        })

        if(res.status === 200) {

            const user = {
                email
            }

            this.setState({ user });
            return true;
        } else {
            return false;
        }
    }

    logout = e => {
        e.preventDefault();
        this.setState({ user: null });
        localStorage.removeItem("user");
    };

    addProduct = (product, callback) => {
        let products = this.state.products.slice();
        products.push(product);
        this.setState({ products }, () => callback && callback());
    };

    addSeller = (seller, callback) => {
        let sellers = this.state.sellers.slice();
        sellers.push(seller);
        this.setState({ sellers }, () => callback && callback());
    }

  render() {
    return (
        <Context.Provider
            value={{
              ...this.state,
              removeFromCart: this.removeFromCart,
              addToCart: this.addToCart,
              login: this.login,
              addProduct: this.addProduct,
                addSeller: this.addSeller,
              clearCart: this.clearCart,
              checkout: this.checkout
            }}
        >
          <Router ref={this.routerRef}>
            <div className="App">
              <nav
                  className="navbar container"
                  role="navigation"
                  aria-label="main navigation"
              >
                <div className="navbar-brand">

                  <b className="navbar-item is-size-4 ">
                      <img src={logo}/>
                      &nbsp;
                      &nbsp;
                      Asuba Tasarım
                  </b>

                  <label
                      role="button"
                      class="navbar-burger burger"
                      aria-label="menu"
                      aria-expanded="false"
                      data-target="navbarBasicExample"
                      onClick={e => {
                        e.preventDefault();
                        this.setState({ showMenu: !this.state.showMenu });
                      }}
                  >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                  </label>
                </div>
                <div className={`navbar-menu ${
                    this.state.showMenu ? "is-active" : ""
                }`}>
                  <Link to="/urunler" className="navbar-item">
                    Ürünler
                  </Link>
                    <Link to="/saticilar" className="navbar-item">
                        Satıcılar
                    </Link>
                  <Link to="/sepet" className="navbar-item">
                    Sepetim
                    <span
                        className="tag is-primary"
                        style={{ marginLeft: "5px" }}
                    >
                    { Object.keys(this.state.cart).length }
                  </span>
                  </Link>

                    <Link to="/urun-ekle" className="navbar-item">
                        Ürün ekle
                    </Link>

                    <Link to="/satici-ekle" className="navbar-item">
                        Satıcı ekle
                    </Link>

                </div>
              </nav>
              <Switch>
                <Route exact path="/" component={ProductList} />
                <Route exact path="/giris" component={Login} />
                <Route exact path="/sepet" component={Cart} />
                <Route exact path="/urun-ekle" component={AddProduct} />
                <Route exact path="/urunler" component={ProductList} />
                <Route exact path="/satici-ekle" component={AddSeller} />
                <Route exact path="/saticilar" component={SellerList} />
              </Switch>
            </div>
          </Router>
        </Context.Provider>
    );
  }
}
