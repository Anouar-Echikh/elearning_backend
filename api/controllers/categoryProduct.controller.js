const CategoryProduct = require("../models/categoryProduct.model");

const CategoryProductController = {};

//get all CategoryProducts
CategoryProductController.getAllCategoryProducts = async (req, res, next) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const CategoryProducts = await Contact.find();
    if (CategoryProducts.length > 0) {
      res.send({ CategoryProducts });
    } else {
      res.status(401);
      res.send({ error: "No CategoryProducts" });
    }
  } catch (e) {
    next(e);
  }
};

// Get CategoryProduct by Id

CategoryProductController.getCategoryProductById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundCategoryProduct = await CategoryProduct.findOne({
      _id: id
    });

    if (foundCategoryProduct) {
      res.send({ CategoryProduct: foundCategoryProduct });
    } else {
      res.status(401);
      res.send({
        error: `Ce compte n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};

// Get CategoryProduct by n° account

CategoryProductController.getCategoryProductByRef = async (req, res, next) => {
  const ref = req.params.ref;
  try {
    const foundCategoryProduct = await CategoryProduct.findOne({
      refCategory: ref
    });

    if (foundCategoryProduct) {
      res.send({ CategoryProduct: foundCategoryProduct });
    } else {
      res.status(401);
      res.send({
        error: `Cette catégorie n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};

//create CategoryProduct
CategoryProductController.create = async (req, res, next) => {
  const { refCategory, designation, note } = req.body;
  const newCategoryProduct = new CategoryProduct({
    refCategory,
    designation,
    note,
    owner: req.user
  });

  try {
    const savedCategoryProduct = await newCategoryProduct.save();
    res.send({
      success: true,
      CategoryProduct: savedCategoryProduct
    });
  } catch (e) {
    next(e);
  }
};

//destroy CategoryProduct
CategoryProductController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await CategoryProduct.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "CategoryProduct deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update CategoryProduct
CategoryProductController.update = async (req, res, next) => {
  const { refCategory, designation, note } = req.body;
  const id = req.params.id;

  try {
    const updatedCategoryProduct = await CategoryProduct.updateOne(
      { _id: id },
      {
        refCategory,
        designation,
        note,
        lastUpdate: { type: new Date() }
      }
    );
    return res.send({
      success: true,
      updatedCategoryProduct
    });
  } catch (e) {
    next(e);
  }
};
/*---------------Get all CategoryProducts by search text-------------------*/
CategoryProductController.getAllCategoryProductsBySearchText = async (
  req,
  res,
  next
) => {
  const text = req.params.text;
  try {
    const CategoryProducts = await CategoryProduct.find(
      {
        $text: { $search: text }
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    return res.send({
      CategoryProducts
    });
  } catch (e) {
    next(e);
  }
};

module.exports = CategoryProductController;
