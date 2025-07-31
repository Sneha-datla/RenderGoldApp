const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");
const { pool } = require("../db"); // ⬅️ Import PostgreSQL pool

const router = express.Router();

// ✅ Setup Cloudinary storage with multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "seller",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});


const upload = multer({ storage });

/**
 * 🔹 POST /sellergold/add
 * Add a new product with image uploads to Cloudinary
 */
router.post("/add", upload.array("images", 10), async (req, res) => {
  const { name, category, weight, purity, condition, price, description } = req.body;
  const files = req.files || [];

 

  try {
    const imageData = files.map((file) => file.path);

    const result = await pool.query( `INSERT INTO sellergold (name, category, weight, purity, condition, price, description, images)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,[
      name,
      category,
      weight,
      purity,
      condition,
      parseFloat(price),
      description,
      imageData,
    ]);
    res.status(201).json({
      message: "Seller gold product added successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding seller gold:", err.message);
    res.status(500).json({ error: "Failed to add seller gold product" });
  }
});

/**
 * 🔹 GET /sellergold/all
 * Fetch all seller gold products
 */
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sellergold ORDER BY created_at DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching seller gold:", err.message);
    res.status(500).json({ error: "Failed to fetch seller gold products" });
  }
});

/**
 * 🔹 DELETE /sellergold/:id
 * Deletes a product and its Cloudinary images
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Get product by ID
    const getQuery = "SELECT * FROM sellergold WHERE id = $1";
    const getResult = await pool.query(getQuery, [id]);

    if (getResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = getResult.rows[0];
    const images = product.images || [];

    // Step 2: Delete images from Cloudinary
    await Promise.all(
      images.map(async (imgUrl) => {
        const publicId = imgUrl.split("/").pop().split(".")[0]; // basic extract
        try {
          await cloudinary.uploader.destroy(`seller/${publicId}`);
        } catch (err) {
          console.warn("Cloudinary deletion failed for", publicId, err.message);
        }
      })
    );

    // Step 3: Delete product from DB
    const deleteQuery = "DELETE FROM sellergold WHERE id = $1";
    await pool.query(deleteQuery, [id]);

    res.status(200).json({ message: "Seller gold product deleted successfully" });
  } catch (err) {
    console.error("Error deleting seller gold:", err.message);
    res.status(500).json({ error: "Failed to delete seller gold product" });
  }
});

module.exports = router;
