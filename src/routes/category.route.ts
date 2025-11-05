import { Router } from "express";
import { addCategory, deleteCategory, getCategory, getSingleCategory } from "../controllers/category.controller.js";

const categoryRouter = Router()

categoryRouter.post("/", addCategory)
categoryRouter.get("/", getCategory)
categoryRouter.get("/:id", getSingleCategory);
categoryRouter.delete('/:id', deleteCategory)

export default categoryRouter