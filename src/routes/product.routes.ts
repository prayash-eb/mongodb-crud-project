import { Router } from "express";
import { addProduct, addProductCategory, addProductDescription, addProductReview, removeProduct } from "../controllers/product.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const productRouter = Router()

productRouter.post("/add", addProduct)
productRouter.post("/add-category", addProductCategory)
productRouter.post("/add-review", requireAuthentication, addProductReview)
productRouter.delete("/remove", removeProduct)
productRouter.post("/add-description", addProductDescription)
productRouter.post("/add-review", addProductReview)

export default productRouter