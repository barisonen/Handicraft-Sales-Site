import React, { Component } from "react";
import withContext from "../withContext";
import { Redirect } from "react-router-dom";
import axios from 'axios';

const initState = {
    name: "",
    email: "",
    rate: "",
    comments: "",
    file: null,
    base64URL: ""
};

class AddSeller extends Component {
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
        const { name, email, picture, rate, comments, file, base64URL } = this.state;

        if (name && email) {
            const id = Math.random().toString(36).substring(2) + Date.now().toString(36);

            let picture = base64URL.replace(/^data:image\/(png|jpg);base64,/, "");

            this.props.context.addSeller(
                {
                    name,
                    email,
                    rate,
                    comments,
                    picture,
                },
                () => this.setState(initState)
            );


            await axios.post('https://handicraftsales-frontend.herokuapp.com//sellers/add',
                {
                    name: name,
                    email: email,
                    picture: picture,
                    rate: rate,
                    comments: comments
                },
            )

            this.setState(
                { flash: { status: 'is-success', msg: 'Satıcı başarıyla oluşturuldu.' }}
            );

        } else {
            this.setState(
                { flash: { status: 'is-danger', msg: 'Lütfen isim ve email bilgisi giriniz.' }}
            );
        }
    };

    handleChange = e => this.setState({ [e.target.name]: e.target.value, error: "" });

    render() {
        const { name, email, rate, comments } = this.state;
        const { user } = this.props.context;

        return !(user && user.accessLevel < 1) ? (
            <Redirect to="/" />
        ) : (
            <>
                <div className="hero is-primary ">
                    <div className="hero-body container">
                        <h4 className="title">Satıcı Ekle</h4>
                    </div>
                </div>
                <br />
                <br />
                <form onSubmit={this.save}>
                    <div className="columns is-mobile is-centered">
                        <div className="column is-one-third">
                            <div className="field">
                                <label className="label">Satıcı İsmi: </label>
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
                                <label className="label">Email: </label>
                                <input
                                    className="input"
                                    type="text"
                                    name="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label className="label">Rate: </label>
                                <input
                                    className="input"
                                    type="text"
                                    name="rate"
                                    value={rate}
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

export default withContext(AddSeller);
