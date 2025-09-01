const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");const pool = require("../db");

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "seller",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
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
    description,
    full_name,
    mobilenumber,
    typeofselling   // ✅ new field
  } = req.body;

  const files = req.files || [];

  try {
    const imagePaths = files.map((file) => file.path);

    const result = await pool.query(
      `INSERT INTO sellergold 
        (name, category, weight, purity, condition, price, description, images, full_name, mobilenumber, typeofselling)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [name, category, weight, purity, condition, price, description, imagePaths, full_name, mobilenumber, typeofselling]
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
  const getPublicIdFromUrl = (url) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1].split(".")[0];
    return `seller/${filename}`;
  };
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
      await Promise.all(
          imagePaths.map((url) => {
            const publicId = getPublicIdFromUrl(url);
            return cloudinary.uploader.destroy(publicId);
          })
        );
    

    // Delete the product from the database
    await pool.query("DELETE FROM sellergold WHERE id = $1", [id]);

    res.status(200).json({ message: "Seller gold product deleted successfully" });
  } catch (err) {
    console.error("Error deleting seller gold product:", err.message);
    res.status(500).json({ error: "Failed to delete seller gold product" });
  }
});


module.exports = router;
