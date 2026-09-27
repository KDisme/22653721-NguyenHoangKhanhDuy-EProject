const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
require("dotenv").config();

chai.use(chaiHttp);

const BASE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";

describe("Product API - CRUD Tests", () => {
  let createdProductId;

  // ─── POST /api/products ──────────────────────────────────────────────
  describe("POST /api/products", () => {
    it("should create a new product successfully", async () => {
      const res = await chai
        .request(BASE_URL)
        .post("/api/products")
        .send({ pname: "Laptop Dell", price: 15000000, quantity: 10 });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property("_id");
      expect(res.body).to.have.property("pid");
      expect(res.body).to.have.property("pname", "Laptop Dell");
      expect(res.body).to.have.property("price", 15000000);
      expect(res.body).to.have.property("quantity", 10);

      createdProductId = res.body._id;
    });

    it("should return 400 if pname is missing", async () => {
      const res = await chai
        .request(BASE_URL)
        .post("/api/products")
        .send({ price: 5000, quantity: 5 });

      expect(res).to.have.status(400);
    });

    it("should return 400 if price is missing", async () => {
      const res = await chai
        .request(BASE_URL)
        .post("/api/products")
        .send({ pname: "Test", quantity: 5 });

      expect(res).to.have.status(400);
    });
  });

  // ─── GET /api/products ───────────────────────────────────────────────
  describe("GET /api/products", () => {
    it("should return array of products", async () => {
      const res = await chai.request(BASE_URL).get("/api/products");

      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array");
      expect(res.body.length).to.be.greaterThan(0);

      const first = res.body[0];
      expect(first).to.have.property("_id");
      expect(first).to.have.property("pname");
      expect(first).to.have.property("price");
      expect(first).to.have.property("quantity");
    });
  });

  // ─── GET /api/products/:id ───────────────────────────────────────────
  describe("GET /api/products/:id", () => {
    it("should return product by id", async () => {
      const res = await chai
        .request(BASE_URL)
        .get(`/api/products/${createdProductId}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("_id", createdProductId);
      expect(res.body).to.have.property("pname", "Laptop Dell");
    });

    it("should return 404 for invalid id", async () => {
      const res = await chai
        .request(BASE_URL)
        .get("/api/products/000000000000000000000000");

      expect(res).to.have.status(404);
    });
  });

  // ─── PUT /api/products/:id ───────────────────────────────────────────
  describe("PUT /api/products/:id", () => {
    it("should update product successfully", async () => {
      const res = await chai
        .request(BASE_URL)
        .put(`/api/products/${createdProductId}`)
        .send({ pname: "Laptop Dell Updated", price: 16000000, quantity: 8 });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("pname", "Laptop Dell Updated");
      expect(res.body).to.have.property("price", 16000000);
      expect(res.body).to.have.property("quantity", 8);
    });
  });

  // ─── DELETE /api/products/:id ────────────────────────────────────────
  describe("DELETE /api/products/:id", () => {
    it("should delete product successfully", async () => {
      const res = await chai
        .request(BASE_URL)
        .delete(`/api/products/${createdProductId}`);

      expect(res).to.have.status(200);
      expect(res.body).to.have.property("message", "Xoá thành công");
    });

    it("should return 404 after deletion", async () => {
      const res = await chai
        .request(BASE_URL)
        .get(`/api/products/${createdProductId}`);

      expect(res).to.have.status(404);
    });
  });
});
