import { Router } from "express";
import { addProduct, addProductDescription, addProductReview, addProductVariant, deleteProductDescription, deleteProductReview, deleteProductVariant, editProduct, editProductDescription, getProductDescription, getProductReviews, getProducts, getProductVariants, getSingleProduct, removeProduct, updateProductVariant } from "../controllers/product.controller.js";
import { requireAuthentication } from "../middleware/auth.middleware.js";

const productRouter = Router()

productRouter.get("/", getProducts)
productRouter.get("/:productId", getSingleProduct)
productRouter.post("/add", addProduct)
productRouter.patch("/update/:productId", editProduct)
productRouter.delete("/remove/:productId", removeProduct)

productRouter.post("/add-details", addProductDescription)
productRouter.get("/get-details/:productId", getProductDescription)
productRouter.delete("/remove-details/:productId", deleteProductDescription)
productRouter.patch("/update-details/:productId", editProductDescription)

productRouter.post("/add-variant", addProductVariant)
productRouter.get("/get-variants/:productId", getProductVariants)
productRouter.patch("/update-variant/:productId", updateProductVariant)
productRouter.delete("/remove-variant/:productId", deleteProductVariant)

productRouter.post("/add-review", requireAuthentication, addProductReview)
productRouter.get("/reviews/:productId", getProductReviews)
productRouter.delete("/remove-review/:reviewId", deleteProductReview)


export default productRouter