const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pool = require("../db");

const router = express.Router();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Add seller gold with multiple images
router.post("/add", upload.array("images", 10), async (req, res) => {
  const {
    name,
    category,
    weight,
    purity,
    condition,
    price,
    description
  } = req.body;

  const files = req.files || [];

  try {
    const imagePaths = files.map(file => `/uploads/${file.filename}`);

    const result = await pool.query(
      `INSERT INTO sellergold (name, category, weight, purity, condition, price, description, images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, category, weight, purity, condition, price, description, imagePaths]
    );

    res.status(201).json({
      message: "Seller gold product added successfully",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Error inserting seller gold product:", err.message);
    res.status(500).json({ error: "Failed to add seller gold product" });
  }
});
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sellergold ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching seller gold products:", err.message);
    res.status(500).json({ error: "Failed to fetch seller gold products" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // First, get the images associated with the product
    const Result = await pool.query(
      "SELECT images FROM sellergold WHERE id = $1",
      [id]
    );

    if (Result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const imagePaths = Result.rows[0].images || [];

    // Delete images from the filesystem
    imagePaths.forEach((imagePath) => {
      const filePath = imagePath.replace("/uploads/", "uploads/");
      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn(`Failed to delete file: ${filePath}`, err.message);
        }
      });
    });

    // Delete the product from the database
    await pool.query("DELETE FROM sellergold WHERE id = $1", [id]);

    res.status(200).json({ message: "Seller gold product deleted successfully" });
  } catch (err) {
    console.error("Error deleting seller gold product:", err.message);
    res.status(500).json({ error: "Failed to delete seller gold product" });
  }
});


module.exports = router;
