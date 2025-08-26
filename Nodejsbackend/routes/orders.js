const express = require("express");
const pool = require("../db"); // PostgreSQL pool instance
const router = express.Router();

// ✅ GET /orders/list/:userId
router.get('/list/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const ordersResult = await pool.query("SELECT * FROM orders WHERE user_id = $1 ", [userId]);
    const orders = [];

    for (const order of ordersResult.rows) {
      const orderSummary = order.order_summary || [];

      const formattedProducts = orderSummary.map(item => ({
        title: item.name || "Unknown Product",
        quantity: item.quantity || 1,
        purity: item.purity || null,
        price: item.price || 0,
        image: item.image || null,
      }));

      orders.push({
        orderId: order.id,
        createdAt: order.order_date,
        status: order.status,
        address: order.address,
        totalAmount: parseFloat(order.total_amount),
        ordersummary: formattedProducts,
      });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


// ✅ GET /orders/all
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Fetching orders failed:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE /orders/delete/:orderId
router.delete('/delete/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [orderId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully", order: result.rows[0] });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ POST /addcart
router.post('/addcart', async (req, res) => {
  const { userId, product } = req.body;

  if (!userId || !product?.name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await pool.query(
      `INSERT INTO carts (user_id, image, name, price, quantity, weight, purity, added_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [userId, product.image, product.name, product.price, product.quantity, product.weight, product.purity]
    );

    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ GET /cartlist/:userId
router.get('/cartlist/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM carts WHERE user_id = $1", [userId]);
    res.status(200).json({ cart: result.rows });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// ✅ DELETE /cartdelete/:cartId
router.delete('/cartdelete/:cartId', async (req, res) => {
  const { cartId } = req.params;

  try {
    const result = await pool.query("DELETE FROM carts WHERE id = $1 RETURNING *", [cartId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ POST /checkout
router.post("/checkout", async (req, res) => {
  const { userId, addressId, paymentMethod, expectedDelivery } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Fetch address
    const addressRes = await client.query(
      "SELECT * FROM addresses WHERE user_id = $1 AND id = $2",
      [userId, addressId]
    );
    if (addressRes.rowCount === 0) {
      return res.status(400).json({ error: "Address not found" });
    }
    const address = addressRes.rows[0];

    // Fetch cart items
    const cartRes = await client.query(
      "SELECT * FROM carts WHERE user_id = $1",
      [userId]
    );
    if (cartRes.rowCount === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    const orderSummary = [];
    let subtotal = 0;

    for (const item of cartRes.rows) {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      subtotal += itemTotal;
      orderSummary.push(item);
    }

    const totalAmount = subtotal;

    // Insert into orders with JSONB order_summary
    await client.query(
      `INSERT INTO orders (
         user_id, address_id, address, payment_method,
         expected_delivery, subtotal, total_amount,
         order_summary, status, order_date
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'processing', NOW())`,
      [
        userId,
        addressId,
        JSON.stringify(address),
        paymentMethod,
        expectedDelivery,
        subtotal,
        totalAmount,
        JSON.stringify(orderSummary)
      ]
    );

    // Clear cart after order
    await client.query("DELETE FROM carts WHERE user_id = $1", [userId]);

    await client.query("COMMIT");
    res.status(200).json({ message: "Order placed successfully" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Checkout Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

// ✅ POST /update-status
router.post('/update-status', async (req, res) => {
  const { orderId, status } = req.body;

  try {
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [status, orderId]);
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Failed to update status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

// Cancel Order API
router.post("/cancel-order", async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    if (!orderId || !reason) {
      return res.status(400).json({ error: "Order ID and reason are required" });
    }

    // ✅ Check if order exists and is not already cancelled
    const orderResult = await pool.query(
      "SELECT status FROM orders WHERE id = $1",
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (orderResult.rows[0].status === "cancelled") {
      return res.status(400).json({ error: "Order is already cancelled" });
    }

    // ✅ Update order status, reason and cancellation time in Asia/Kolkata timezone
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


module.exports = router;
