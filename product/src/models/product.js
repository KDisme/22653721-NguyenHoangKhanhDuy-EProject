const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    pid: { type: String, unique: true },
    pname: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
  },
  { collection: "products" }
);

// Tự sinh pid trước khi lưu
productSchema.pre("save", async function (next) {
  if (!this.pid) {
    const count = await mongoose.model("Product").countDocuments();
    this.pid = `SP${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
