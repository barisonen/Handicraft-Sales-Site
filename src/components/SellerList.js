import React from "react";
import SellerItem from "./SellerItem";
import withContext from "../withContext";

const SellerList = props => {
    const { sellers } = props.context;

    return (
        <>
            <div className="hero is-primary">
                <div className="hero-body container">
                    <h4 className="title">Satıcılarımız</h4>
                </div>
            </div>
            <br />
            <div className="container">
                <div className="column columns is-multiline">
                    {sellers && sellers.length ? (
                        sellers.map((seller, index) => (
                            <SellerItem
                                seller={seller}
                                key={index}
                           />
                        ))
                    ) : (
                        <div className="column">
              <span className="title has-text-grey-light">
                Satıcı bulunamadı!
              </span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default withContext(SellerList);
