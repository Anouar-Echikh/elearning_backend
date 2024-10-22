
const SupportController = {};

SupportController.downloadExcelExamplesFile = async (req, res, next) => {

  try {
      const fileName = req.params.fileName
      //const file =path.resolve(__dirname) ;
      console.log("__dirname:", `${__dirname}/../excels/${fileName}`)
      //let pathFile1 = `${__dirname}/${path}`
      let pathFile = `${__dirname}/../excels/${fileName}`
      console.log("pathFile:", pathFile)
      res.download(pathFile, fileName);
  } catch (e) {
      console.log(e)
  }
}



module.exports = SupportController;
