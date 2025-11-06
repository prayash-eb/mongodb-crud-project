import { Router } from "express";
import { addCategory, deleteCategory, getCategory, getSingleCategory } from "../controllers/category.controller.js";

const categoryRouter = Router()

categoryRouter.post("/", addCategory)
categoryRouter.get("/", getCategory)
categoryRouter.get("/:categoryId", getSingleCategory);
categoryRouter.delete('/:categoryId', deleteCategory)

export default categoryRouter