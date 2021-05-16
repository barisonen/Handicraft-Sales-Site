import React from "react";


const ProductItem = props => {
    const { product } = props;
    return (
        <div className=" column is-half">
            <div className="box">
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-64x64">
                            <img
                                src={`data:image/png;base64,${product.converted}`}
                                alt={product.shortDesc}
                            />
                        </figure>
                    </div>
                    <div className="media-content">
                        <b style={{ textTransform: "capitalize" }}>
                            {product.name}{" "}
                            <span className="tag is-primary">₺{product.price}</span>
                        </b>
                        <div>{product.shortDesc}</div>
                        {product.stock > 0 ? (
                            <small>{product.stock + " Adet Mevcut"}</small>
                        ) : (
                            <small className="has-text-danger">Bu ürün stokta bulunmamaktadır.</small>
                        )}
                        <div className="is-clearfix">
                            <button
                                className="button is-small is-outlined is-primary   is-pulled-right"
                                onClick={() =>
                                    props.addToCart({
                                        id: product.name,
                                        product,
                                        amount: 1
                                    })
                                }
                            >
                                Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
