import React from "react";


const SellerItem = props => {
    const {seller} = props;
    return (
        <div className=" column is-half">
            <div className="box">
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-64x64">
                            <img
                                src={`data:image/png;base64,${seller.picture}`}
                            />
                        </figure>
                    </div>
                    <div className="media-content">
                        <div><b>{seller.name}</b></div>
                        <div>{seller.email}</div>
                        <div>{seller.rate}</div>
                        <div>{seller.comments}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerItem;
