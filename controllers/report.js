
require('dotenv').config();

const reportServices = require('../services/reportServices')

module.exports.sendReport = async (req, res) => {
  let jsonData = JSON.parse(req.body.payload);
  if(Object.keys(jsonData.state.values).length){
    await reportServices.formSubmission(jsonData)
  }else{
    await reportServices.btnPress(jsonData)
  }
  return res.status(200).send("message saved");
  
};
