const reportServices = require('../services/reportServices')

module.exports.sendReport = async (req, res, next) => {
  try{
    const jsonData = JSON.parse(req.body.payload);
    //return res.status(200).send("ok");
  if(jsonData.view){
    if(jsonData.actions && jsonData.actions[0].type === 'multi_static_select'){
      return res.status(200).send("ok");
    }
    await reportServices.formSubmission(jsonData);
  }else{
    if(jsonData.message.blocks[1].elements[0].value === "standup_tmlds"){
      await reportServices.standupBtnByTeamLeader(jsonData);
    }else if(jsonData.message.blocks[1].elements[0].value === "standup_hrs"){
      await reportServices.standupBtnByHr(jsonData);
    }else if(jsonData.message.blocks[1].elements[0].value === "report_hrs"){
      await reportServices.standupBtnByHr(jsonData);
    }else if(jsonData.message.blocks[1].elements[0].value === "standup_anuj"){
      await reportServices.standupBtnByAnuj(jsonData);
    }else if(jsonData.message.blocks[1].elements[0].value === "report_anuj"){
      await reportServices.standupBtnByAnuj(jsonData);
    }else if(jsonData.message.blocks[1].elements[0].value === "standup_emps"){
      await reportServices.standupBtnByEmployee(jsonData);
    }else{
      await reportServices.standupBtnByEmployee(jsonData);
    }
  }
  return res.status(200).send({
    "response_action": "clear"
  });
  }catch(err){
    next(err);
  }
};
