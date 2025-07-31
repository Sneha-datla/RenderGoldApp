const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary"); // ➡️ Cloudinary config file
const pool = require("../db");
const router = express.Router();

// ✅ Test route
router.get("/", (req, res) => {
  res.send("Product route working");
});

// ✅ Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

const upload = multer({ storage });

// ✅ Add Product Route
router.post("/add", upload.array("image_urls", 10), async (req, res) => {
  const { productId, title, purity, price, stock, featured } = req.body;
  const files = req.files || [];

  try {
    const imageUrls = files.map(file => file.path); // Cloudinary URLs

    const result = await pool.query(
      `INSERT INTO products (product_id, title, purity, price, stock, featured, image_urls) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [productId, title, purity, price, stock, featured, imageUrls]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Product creation failed" });
  }
});

// ✅ Fetch All Products
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Delete Product
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query(
      "SELECT image_urls FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const imageUrls = result.rows[0].image_urls;

    // Optional: Delete images from Cloudinary using public_id
    // You must store public_id separately if needed (not just URLs)

    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
