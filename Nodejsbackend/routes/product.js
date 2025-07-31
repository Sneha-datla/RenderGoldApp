// routes/product.js
const express = require("express");
const multer = require("multer");
const pool = require("../db");
const router = express.Router();
const fs = require("fs");

// Example route
router.get("/", (req, res) => {
  res.send("Product route working");
});

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// ⬇️ Use `.array()` for multiple files
router.post("/add", upload.array("image_urls", 10), async (req, res) => {
  const { productId, title, purity, price, stock, featured } = req.body;
  const files = req.files || [];

  try {
    const imagePaths = files.map(file => `/uploads/${file.filename}`);

    const result = await pool.query(
      `INSERT INTO products (product_id, title, purity, price, stock, featured, image_urls) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [productId, title, purity, price, stock, featured, imagePaths] // ✅ pass JS array directly
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Product creation failed" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});
// DELETE a product by ID

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    console.log("Attempting to delete product with ID:", id);

    const result = await pool.query(
      "SELECT image_urls FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    let imageUrls = result.rows[0].image_urls;

    // Parse image URLs safely
    if (typeof imageUrls === "string") {
      try {
        imageUrls = JSON.parse(imageUrls);
      } catch {
        imageUrls = imageUrls.split(",").map(url => url.trim());
      }
    }

    // Delete each image from filesystem
    imageUrls.forEach((url) => {
      const filePath = `.${url}`; // Assuming /uploads/...
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete product from database
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
});




module.exports = router;
