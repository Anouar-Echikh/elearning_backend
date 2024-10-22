const Company = require("../models/company.model");

const companyController = {};

//get all Companys
companyController.getAllCompanies = async (req, res, next) => {
  const user = req.user;
  const query = {
    owner: user._id
  };
  try {
    const Companys = await Contact.find();
    if (Companys.length > 0) {
      res.send({ Companys });
    } else {
      res.status(401);
      res.send({ error: "No Companys" });
    }
  } catch (e) {
    next(e);
  }
};

// Get Company by Id

companyController.getCompanyById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const foundCompany = await Company.findOne({
      _id: id
    });

    if (foundCompany) {
      res.send({ Company: foundCompany });
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

// Get Company by n° account

companyController.getCompanyByNumAccount = async (req, res, next) => {
  const num = req.params.numAccount;
  try {
    const foundCompany = await Company.findOne({
      nAccount: num
    });

    if (foundCompany) {
      res.send({ Company: foundCompany });
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

//create Company
companyController.create = async (req, res, next) => {
  const {
    nAccount,
    name,
    codeTva,
    phone,
    email,
    region,
    adress,
    zipCode,
    note,
    startDoc,
    endDoc
  } = req.body;

  const newCompany = new Company({
    nAccount,
    name,
    codeTva,
    phone,
    email,
    region,
    adress,
    zipCode,
    note,
    startDoc,
    endDoc,
    owner: req.user
  });

  try {
    const savedCompany = await newCompany.save();
    res.send({
      success: true,
      Company: savedCompany
    });
  } catch (e) {
    next(e);
  }
};

//destroy Company
companyController.destroy = async (req, res, next) => {
  const id = req.params.id;

  try {
    await Company.deleteOne({ _id: id });
    return res.send({
      success: true,
      message: "Company deleted with success!"
    });
  } catch (e) {
    next(e);
  }
};

// update Company
companyController.update = async (req, res, next) => {
  const {
    nAccount,
    name,
    codeTva,
    phone,
    email,
    region,
    adress,
    zipCode,
    note,
    startDoc,
    endDoc
  } = req.body;
  const id = req.params.id;

  try {
    const updatedCompany = await Company.updateOne(
      { _id: id },
      {
        nAccount,
        name,
        codeTva,
        phone,
        email,
        region,
        adress,
        zipCode,
        note,
        startDoc,
        endDoc,
        lastUpdate: { type: new Date() }
      }
    );
    return res.send({
      success: true,
      updatedCompany
    });
  } catch (e) {
    next(e);
  }
};

module.exports = companyController;
