import React, { Component } from "react";
import withContext from "../withContext";
import { Redirect } from "react-router-dom";
import axios from 'axios';

const initState = {
    name: "",
    price: "",
    stock: "",
    shortDesc: "",
    description: "",
    file: null,
    base64URL: ""
};

class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = initState;
    }

    getBase64 = file => {
        return new Promise(resolve => {
            let baseURL = "";
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {
                // Make a fileInfo Object

                baseURL = reader.result;

                resolve(baseURL);
            };
        });
    };

    handleFileInputChange = e => {
        let { file } = this.state;

        file = e.target.files[0];

        this.getBase64(file)
            .then(result => {
                file["base64"] = result;
                this.setState({
                    base64URL: result,
                    file
                });
            })
            .catch(err => {
                console.log(err);
            });

        this.setState({
            file: e.target.files[0]
        });

    };


    save = async (e) => {

        e.preventDefault();
        const { name, price, stock, shortDesc, description, file, base64URL } = this.state;

        if (name && price) {
            const id = Math.random().toString(36).substring(2) + Date.now().toString(36);

            let converted = base64URL.replace(/^data:image\/(png|jpg);base64,/, "");

            this.props.context.addProduct(
                {
                    name,
                    price,
                    shortDesc,
                    description,
                    converted,
                    stock: stock || 0
                },
                () => this.setState(initState)
            );


            await axios.post('https://handicraftsales-frontend.herokuapp.com/products/add',
                {
                    name: name,
                    price: price,
                    shortDesc: shortDesc,
                    description: description,
                    stock: stock || 0,
                    converted: converted
                },
            )

            this.setState(
                { flash: { status: 'is-success', msg: 'Ürün başarıyla oluşturuldu.' }}
            );

        } else {
            this.setState(
                { flash: { status: 'is-danger', msg: 'Lütfen isim ve fiyat bilgisi giriniz.' }}
            );
        }
    };

    handleChange = e => this.setState({ [e.target.name]: e.target.value, error: "" });

    render() {
        const { name, price, stock, shortDesc, description } = this.state;
        const { user } = this.props.context;

        return !(user && user.accessLevel < 1) ? (
            <Redirect to="/" />
        ) : (
            <>
                <div className="hero is-primary ">
                    <div className="hero-body container">
                        <h4 className="title">Ürün Ekle</h4>
                    </div>
                </div>
                <br />
                <br />
                <form onSubmit={this.save}>
                    <div className="columns is-mobile is-centered">
                        <div className="column is-one-third">
                            <div className="field">
                                <label className="label">Ürün İsmi: </label>
                                <input
                                    className="input"
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label className="label">Fiyat: </label>
                                <input
                                    className="input"
                                    type="number"
                                    name="price"
                                    value={price}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label className="label">Adet: </label>
                                <input
                                    className="input"
                                    type="number"
                                    name="stock"
                                    value={stock}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="field">
                                <label className="label">Kısa Açıklama: </label>
                                <input
                                    className="input"
                                    type="text"
                                    name="shortDesc"
                                    value={shortDesc}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="field">
                                <label className="label">Açıklama: </label>
                                <textarea
                                    className="textarea"
                                    type="text"
                                    rows="2"
                                    style={{ resize: "none" }}
                                    name="description"
                                    value={description}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div>
                                <input type="file" name="file" onChange={this.handleFileInputChange} />
                            </div>
                            {this.state.flash && (
                                <div className={`notification ${this.state.flash.status}`}>
                                    {this.state.flash.msg}
                                </div>
                            )}
                            <div className="field is-clearfix">
                                <button
                                    className="button is-primary is-outlined is-pulled-right"
                                    type="submit"
                                    onClick={this.save}
                                >
                                    Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </>
        );
    }
}

export default withContext(AddProduct);
