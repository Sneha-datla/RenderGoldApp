const express = require("express");
const pool = require("../db"); // PostgreSQL pool connection

const router = express.Router();


// =========================
// 1️⃣ Cancel Order
// =========================
router.post("/add", async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({ error: "Order ID and reason are required" });
    }

    // ✅ Check if order exists
    const orderResult = await pool.query("SELECT status FROM orders WHERE id = $1", [orderId]);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (orderResult.rows[0].status === "cancelled") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }

    // ✅ Cancel the order
    await pool.query(
      `UPDATE orders 
       SET status = 'cancelled',
           cancellation_reason = $1,
           cancelled_at = (NOW() AT TIME ZONE 'Asia/Kolkata')
       WHERE id = $2`,
      [reason, orderId]
    );

    return res.json({
      message: "Order cancelled successfully",
      orderId,
      reason,
      cancelledAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      refundInfo: "Refund (if applicable) will be processed within 2-3 working days"
    });

  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// =========================
// 2️⃣ Get All Cancelled Orders
// =========================
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, status, cancellation_reason
       FROM orders 
       WHERE status = 'cancelled'
       ORDER BY cancelled_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cancelled orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// =========================
// 3️⃣ Get All Orders by Employee ID
// =========================
router.get("/:userId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    const result = await pool.query(
      `SELECT id, user_id, status
       FROM orders 
       WHERE user_id = $1
       ORDER BY id DESC`,
      [employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No orders found for this employee" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching employee orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// =========================
// 4️⃣ Delete Order
// =========================
router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order deleted successfully", deletedOrder: result.rows[0] });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
