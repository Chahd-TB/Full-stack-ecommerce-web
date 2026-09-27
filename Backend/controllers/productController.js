import Product from "../models/productModel.js";

const getProducts = async (req, res, next) => {
    try {
        const { search, category, page = 1, limit = 4  } = req.query;

        const filter = {};
        const skip = (page - 1) * limit;

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        const products = await Product.find(filter).skip(skip).limit(Number(limit));

        const totalProducts = await Product.countDocuments(filter);

        const totalPages = Math.ceil(
            totalProducts / Number(limit)
        );

        res.json({
            products,
            pagination: {
                currentPage: Number(page),
                limit: Number(limit),
                totalProducts,
                totalPages
            }
        });
    }
    catch (error) {
        next(error);
    }
};

const getProduct = async (req, res, next) =>{
    try{
       const result = await Product.findById(req.params.id);

       if (!result) {

            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(result);
    }
    catch(error){
       next(error);
    }
}

const postProduct = async (req, res, next) => {
    try {
        const product = await Product.create({
            ...req.body,
            image: req.file
                ? `/uploads/${req.file.filename}`
                : ""
        });

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

const putProduct = async (req, res, next) => {
    try {
        const updateData = {
            ...req.body
        };

        if (req.file) {
            updateData.image =
                `/uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(product);
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try{
       const deleted = await Product.findByIdAndDelete(req.params.id);
       
       if(!deleted){
        return res.status(404).json({
            error: "Product not found"
        })
       }
       
       res.status(204).send();

    }
    catch(error){
        next(error);
    }
}

export {getProducts, getProduct, deleteProduct, putProduct, postProduct};