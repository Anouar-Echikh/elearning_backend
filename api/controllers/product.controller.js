const Product = require("../models/product.model");

const ProductController = {};

//get all Products
ProductController.getAllProducts = async (req, res, next) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user"
        }
      }
    ]);
    if (products.length > 0) {
      res.send({ products });
    }
  } catch (e) {
    res.status(401);
    res.send({ error: "No products" });
    next(e);
  }
};

// Get Product by Id

ProductController.getProductById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundProduct = await Product.findOne({
      _id: id
    });

    if (foundProduct) {
      res.send({ product: foundProduct });
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

// Get Product by ref product

ProductController.getProductByRef = async (req, res, next) => {
  const ref = req.params.ref;
  try {
    const foundProduct = await Product.findOne({
      refProduct: ref
    });

    if (foundProduct) {
      res.send({ product: foundProduct });
    } else {
      res.status(401);
      res.send({
        error: `Ce produit n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};

// Get Product by ref product

ProductController.getProductsByCategory = async (req, res, next) => {
  const category = req.params.category;
  try {
    const foundProducts = await Product.findOne({
      categoryProduct: category
    });

    if (foundProduct) {
      res.send({ products: foundProducts });
    } else {
      res.status(401);
      res.send({
        error: `Ce produit n'existe pas dans le système.`
      });
    }
  } catch (e) {
    next(e);
  }
};

//create Product
ProductController.create = async (req, res, next) => {
  const {
    refProduct,
    title,
    designation,
    categoryProduct,
    pa,
    pv,
    tva,
    unite,
    note,
    img,
    stock,
    stockMin,
    stockMax,
    realStock
  } = req.body;

  const newProduct = new Product({
    refProduct,
    title,
    designation,
    categoryProduct,
    pa,
    pv,
    tva,
    unite,
    note,
    img,
    stock,
    stockMin,
    stockMax,
    realStock,
    owner: req.user
  });

  try {
    const savedProduct = await newProduct.save();
    res.send({
      success: true,
      Product: savedProduct
    });
  } catch (e) {
    next(e);
  }
};

//destroy Product
ProductController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Product.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Product deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update Product
ProductController.update = async (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  var updatedProduct = {};

  try {
    if ("refProduct" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            refProduct: body.refProduct,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("title" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            title: body.title,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("designation" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            designation: body.designation,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("categoryProduct" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            categoryProduct: body.categoryProduct,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("pa" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            pa: body.pa,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("pv" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            pv: body.pv,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("tva" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            tva: body.tva,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("unite" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            unite: body.unite,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("note" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            note: body.note,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("img" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            img: body.img,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("stock" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            stock: body.stock,

            lastUpdate: new Date()
          }
        }
      );
    }

    if ("rem1" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            rem1: body.rem1,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("rem2" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            rem2: body.rem2,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("stockMin" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            stockMin: body.stockMin,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("stockMax" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            stockMax: body.stockMax,

            lastUpdate: new Date()
          }
        }
      );
    }
    if ("realStock" in body) {
      updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            realStock: body.realStock,

            lastUpdate: new Date()
          }
        }
      );
    }
    if (updatedProduct.ok === 1) {
      res.send({
        success: true
      });
    } else {
      res.send({
        success: false,
        error: "Problème de mise à jour Product"
      });
    }
  } catch (e) {
    next(e);
  }
};

/*---------------Get all Products by search text-------------------*/
ProductController.getAllProductsBySearchText = async (req, res, next) => {
  const text = req.params.text;
  try {
    const products = await Product.find(
      {
        $text: { $search: text }
      },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    return res.send({
      products
    });
  } catch (e) {
    next(e);
  }
};

module.exports = ProductController;
