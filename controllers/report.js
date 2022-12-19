
require('dotenv').config();

const reportServices = require('../services/reportServices')

module.exports.sendReport = async (req, res, next) => {
  try{
    const jsonData = JSON.parse(req.body?.payload);
  if(jsonData.view){
    if(jsonData.actions && jsonData.actions[0].type === 'multi_static_select'){
      return res.status(200).send("ok");
    }
    await reportServices.formSubmission(jsonData);
  }else{
    await reportServices.btnPress(jsonData);
  }
  return res.status(200).send({
    "response_action": "clear"
  });
  }catch(err){
    next(err);
  }
};
