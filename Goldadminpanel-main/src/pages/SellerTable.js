import axios from "axios";
import { useEffect, useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const SellerProductTable = () => {
  const [products, setProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const API_URL = "https://rendergoldapp-1.onrender.com/seller/all";
  const IMAGE_BASE = "https://adminapp-1-nk19.onrender.com";

  const parseImages = (images) => {
    try {
      if (Array.isArray(images)) return images;
      if (typeof images === "string") return JSON.parse(images);
      return [];
    } catch {
      return [];
    }
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/")) return `${IMAGE_BASE}${imgPath}`;
    return `${IMAGE_BASE}/uploads/${imgPath}`;
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this product?")) {
      try {
        await axios.delete(`https://rendergoldapp-1.onrender.com/seller/${id}`);
        alert("Product deleted successfully (if supported by API)");
        fetchProducts();
        setActiveProduct(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleRowClick = (product) => {
    setActiveProduct(product.id === activeProduct?.id ? null : product);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container py-3">
      <h4 className="mb-3 fw-bold text-primary">Seller Gold Products</h4>

      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Weight</th>
            <th>Purity</th>
            <th>Condition</th>
            <th>Price</th>
            <th>Description</th>
            <th style={{ width: "90px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product.id}
                className={activeProduct?.id === product.id ? "table-primary" : ""}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(product)}
              >
                <td>
                  {parseImages(product.images).slice(0, 2).map((imgUrl, i) => (
                    <img
                      key={i}
                      src={getImageUrl(imgUrl)}
                      alt={`${product.name} ${i + 1}`}
                      width="80"
                      height="80"
                      style={{
                        objectFit: "cover",
                        borderRadius: "6px",
                        marginRight: "6px",
                        border: "1px solid #ddd",
                      }}
                    />
                  ))}
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{Math.floor(Math.random() * 50) + 1} gm</td>
                <td>{["22K", "24K"][Math.floor(Math.random() * 2)]}</td>
                <td>{["New", "Used"][Math.floor(Math.random() * 2)]}</td>
                <td>₹{product.price}</td>
                <td>{product.description.slice(0, 30)}...</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(product.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No products available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {activeProduct && (
        <div className="card mt-4 shadow-lg border-0">
          <div className="card-header bg-primary text-white fw-bold">
            Product Details
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-5">
                <div
                  style={{
                    display: "flex",
                    overflowX: "auto",
                    gap: "10px",
                    paddingBottom: "6px",
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {parseImages(activeProduct.images).map((imgUrl, i) => (
                    <div
                      key={i}
                      style={{
                        flex: "0 0 auto",
                        scrollSnapAlign: "start",
                        cursor: "pointer",
                      }}
                      onClick={() => openLightbox(i)}
                    >
                      <img
                        src={getImageUrl(imgUrl)}
                        alt={`${activeProduct.name} ${i + 1}`}
                        style={{
                          height: "250px",
                          width: "auto",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-7">
                <h5 className="fw-bold text-primary">{activeProduct.name}</h5>
                <p><strong>Category:</strong> {activeProduct.category}</p>
                <p><strong>Weight:</strong> {Math.floor(Math.random() * 50) + 1} gm</p>
                <p><strong>Purity:</strong> {["22K", "24K"][Math.floor(Math.random() * 2)]}</p>
                <p><strong>Condition:</strong> {["New", "Used"][Math.floor(Math.random() * 2)]}</p>
                <p><strong>Price:</strong> ₹{activeProduct.price}</p>
                <p><strong>Description:</strong> {activeProduct.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLightboxOpen && activeProduct && (
        <Lightbox
          mainSrc={getImageUrl(parseImages(activeProduct.images)[lightboxIndex])}
          nextSrc={getImageUrl(
            parseImages(activeProduct.images)[
              (lightboxIndex + 1) % parseImages(activeProduct.images).length
            ]
          )}
          prevSrc={getImageUrl(
            parseImages(activeProduct.images)[
              (lightboxIndex + parseImages(activeProduct.images).length - 1) %
                parseImages(activeProduct.images).length
            ]
          )}
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex(
              (lightboxIndex + parseImages(activeProduct.images).length - 1) %
                parseImages(activeProduct.images).length
            )
          }
          onMoveNextRequest={() =>
            setLightboxIndex(
              (lightboxIndex + 1) % parseImages(activeProduct.images).length
            )
          }
        />
      )}
    </div>
  );
};

export default SellerProductTable;
