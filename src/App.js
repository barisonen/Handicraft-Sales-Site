import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";

import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import Login from './components/Login';
import ProductList from './components/ProductList';
import logo from './pictures/logo.png';
import Context from "./Context";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {},
      products: []
    };
    this.routerRef = React.createRef();
  }

    async componentDidMount() {
        let user = localStorage.getItem("user");
        let cart = localStorage.getItem("cart");

        //const products = await axios.get('http://localhost:3001/products');
        const products = await axios.get('http://127.0.0.1:8080/products/');
        console.log(products.data);
        console.log((await axios.get('http://localhost:3001/products')).data);
        user = user ? JSON.parse(user) : null;
        cart = cart? JSON.parse(cart) : {};

        this.setState({ user,  products: products.data, cart });
    }

    checkout = () => {
        if (!this.state.user) {
            this.routerRef.current.history.push("/login");
            return;
        }

        const cart = this.state.cart;

        const products = this.state.products.map(p => {
            if (cart[p.name]) {
                p.stock = p.stock - cart[p.name].amount;

                axios.put(
                    `http://localhost:3001/products/${p.id}`,
                    { ...p },
                )

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
            'http://localhost:3001/login',
            { email, password },
        ).catch((res) => {
            return { status: 401, message: 'Unauthorized' }
        })

        if(res.status === 200) {
            const { email } = jwt_decode(res.data.accessToken)
            const user = {
                email,
                token: res.data.accessToken,
                accessLevel: email === 'admin@example.com' ? 0 : 1
            }

            this.setState({ user });
            localStorage.setItem("user", JSON.stringify(user));
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

  render() {
    return (
        <Context.Provider
            value={{
              ...this.state,
              removeFromCart: this.removeFromCart,
              addToCart: this.addToCart,
              login: this.login,
              addProduct: this.addProduct,
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
                  <Link to="/sepet" className="navbar-item">
                    Sepetim
                    <span
                        className="tag is-primary"
                        style={{ marginLeft: "5px" }}
                    >
                    { Object.keys(this.state.cart).length }
                  </span>
                  </Link>
                  {!this.state.user ? (
                      <Link to="/giris" className="navbar-item">
                        Giriş
                      </Link>
                  ) : (
                      <Link to="/" onClick={this.logout} className="navbar-item">
                        Çıkış
                      </Link>
                  )}
                    {this.state.user && this.state.user.accessLevel < 1 && (
                        <Link to="/urun-ekle" className="navbar-item">
                            (Admin) Ürün ekle
                        </Link>
                    )}
                </div>
              </nav>
              <Switch>
                <Route exact path="/" component={ProductList} />
                <Route exact path="/giris" component={Login} />
                <Route exact path="/sepet" component={Cart} />
                <Route exact path="/urun-ekle" component={AddProduct} />
                <Route exact path="/urunler" component={ProductList} />
              </Switch>
            </div>
          </Router>
        </Context.Provider>
    );
  }
}
