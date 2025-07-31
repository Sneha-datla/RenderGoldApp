// index.js
const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/users"); //  import your user route
const sellGoldRoutes = require("./routes/seller"); //  import your user route
const ordersRoutes = require("./routes/orders"); //  import your user route
const goldloanRoutes = require("./routes/goldloan"); //  import your user route

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve images
app.use("/products", productRoutes);
app.use("/users", userRoutes); 
app.use("/seller", sellGoldRoutes); 
app.use("/order", ordersRoutes);
app.use("/loan", goldloanRoutes); 



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});