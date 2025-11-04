import { Router } from "express";
import { addProduct, addProductCategory } from "../controllers/product.controller.js";

const productRouter = Router()

productRouter.post("/add", addProduct)
productRouter.post("/add-category", addProductCategory)

export default productRouter