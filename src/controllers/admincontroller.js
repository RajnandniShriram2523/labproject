let adminmodel=require("../models/admincurdmodel.js");

exports.homepage = (req, res) => {
  res.send("home page");
}

exports.addcategory = ((req, res) => {
  let { category_name } = req.body;
  let promise = adminmodel.Addcategory(category_name);
  promise.then((result) => {
    console.log(result);
    
    res.json({status:"add", msg: result });
  }).catch((err) => {
    res.json({status:"not add",  msg: err });
  });

});
exports.viewcategory = (req, res) => {
  let promise = adminmodel.viewcategory();
  promise.then((result) => {
    res.json({status:"view",  categorylist: result });
  });
  promise.catch((err) => {
    res.json(err);
  });
}

exports.deletecategory = (req, res) => {
  let category_id = parseInt(req.query.category_id);
  let promise = adminmodel.deletebycategoryid(category_id);
  promise.then((result) => {
    let p = adminmodel.viewcategory();
    p.then((result) => {
      res.json({status:"delete", categorylist: result });
    });
    p.catch((err) => {
      res.json(err);
    });

  });
  promise.catch((err) => {
  });
}

exports.updatecategory = ((req, res) => {
  res.json({status:"update", category_name: req.query.category_name,category_id: req.query.category_id});
})

exports.FinalUpdatecategory = (req, res) => {
  let {category_id,category_name} = req.body;
  let promise = adminmodel.finalupdatecategory(category_id,category_name);
  promise.then((result) => {
    let p = adminmodel.viewcategory();
    p.then((result) => {
      res.json({status:"finalupdate",categorylist: result });
    });
  });
  promise.catch((err) => {
    res.send("category not updated");
  });
}

exports.serachcategoryByUsingName = ((req, res) => {
  let category_name = req.query.category_name;
  let promise = adminmodel.searchcategorybyname(category_name);
  promise.then((result) => {
    res.json(result);

  })
  promise.catch((err) => {
    res.send("Something went to wrong");
  })
});