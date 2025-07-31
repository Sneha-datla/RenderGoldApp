const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");
const pool = require("../db"); // PostgreSQL pool

const router = express.Router();

// ✅ Test route
router.get("/", (req, res) => {
  res.send("Product route working");
});

// ✅ Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });

// ✅ Add product with image upload
router.post("/add", upload.array("image_urls", 10), async (req, res) => {
  const { productId, title, purity, price, stock, featured } = req.body;
  const files = req.files || [];

  try {
    const imageUrls = files.map((file) => file.path);

    const result = await pool.query(
      `INSERT INTO products (product_id, title, purity, price, stock, featured, image_urls, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [
        productId,
        title,
        purity,
        parseFloat(price),
        parseInt(stock),
        featured === "true",
        imageUrls,
      ]
    );

    res.status(201).json({
      message: "Product added",
      product: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding product:", err.message);
    res.status(500).json({ error: "Product creation failed" });
  }
});

// ✅ Get all products
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Delete product and Cloudinary images
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const getPublicIdFromUrl = (url) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1].split(".")[0];
    return `products/${filename}`;
  };

  try {
    // Fetch product
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = result.rows[0];
    const imageUrls = product.image_urls || [];

    // Delete Cloudinary images
    await Promise.all(
      imageUrls.map((url) => {
        const publicId = getPublicIdFromUrl(url);
        return cloudinary.uploader.destroy(publicId);
      })
    );

    // Delete product from DB
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
