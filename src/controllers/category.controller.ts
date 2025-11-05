import { type Request, type Response, type NextFunction, json } from "express";
import type { IProductCategory } from "../models/category.model.js";
import ProductCategory from "../models/category.model.js";
import type { Types } from "mongoose";

interface CategoryTree {
    _id: string;
    name: string;
    description?: string;
    level?: number;
    children: CategoryTree[];
}

// Recursive function to build category tree
const buildCategoryTree = async (parentId: Types.ObjectId | null = null): Promise<CategoryTree[]> => {
    // Use .lean() so TypeScript knows this is a plain object
    const categories = await ProductCategory.find({ parentCategoryId: parentId }).lean<IProductCategory[]>();

    const result: CategoryTree[] = await Promise.all(
        categories.map(async (cat) => {
            const children = await buildCategoryTree(cat._id as unknown as Types.ObjectId);
            return {
                _id: (cat._id as Types.ObjectId).toString(),
                name: cat.name,
                description: cat.description,
                level: cat.level,
                children
            };
        })
    );

    return result;
};

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await buildCategoryTree()
        return res.json({ success: true, category })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}

export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryData = req.body as IProductCategory;

        const categoryAlreadyExist = await ProductCategory.findOne({
            categoryPath: categoryData.categoryPath.toLowerCase()
        })

        if (categoryAlreadyExist) {
            return res.status(409).json({ message: "Category already exist" })
        }

        const newCategory = await ProductCategory.create({
            ...categoryData
        })
        return res.status(201).json({ success: true, newCategory })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}

export const getSingleCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await ProductCategory.findById(id);
        res.json({ success: true, category })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}

// Recursive function to delete category and all nested children
const deleteCategoryAndChildren = async (categoryId: Types.ObjectId | string) => {
    // Find all immediate children of this category
    const children = await ProductCategory.find({ parentCategoryId: categoryId }).select("_id");

    // Recursively delete each child (this handles nested children automatically)
    await Promise.all(children.map(child => deleteCategoryAndChildren(child._id as Types.ObjectId)));

    // Delete the current category
    await ProductCategory.findByIdAndDelete(categoryId);
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await deleteCategoryAndChildren(id!);
        return res.json({ success: true, deletedId: id })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error })
    }
}



