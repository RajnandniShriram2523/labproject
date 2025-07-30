let admincategorymodel=require("../models/admincategorycurdmodel");

exports.addcategory = ((req, res) => {
  let { category_name } = req.body;
  let promise = admincategorymodel.Addcategory(category_name);
  promise.then((result) => {
    console.log(result);
    
    res.json({status:"add", msg: result });
  }).catch((err) => {
    res.json({status:"not add",  msg: err });
  });

});



exports.viewcategory = (req, res) => {
  const page = parseInt(req.query.page) || 1;    
  const limit = parseInt(req.query.limit) || 5;  
  const offset = (page - 1) * limit;

  adminmodel.viewcategoryWithPagination(limit, offset)
    .then((result) => {
      res.json({
        status: "view",
        currentPage: page,
        perPage: limit,
        categorylist: result
      });
    })
    .catch((err) => {
      res.status(500).json({ status: "error", message: err });
    });
};

exports.deletecategory = (req, res) => {
  let category_id = parseInt(req.query.category_id);
  let promise = admincategorymodel.deletebycategoryid(category_id);
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
  let promise = admincategorymodel.finalupdatecategory(category_id,category_name);
  promise.then((result) => {
    let p = admincategorymodel.viewcategory();
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
  let promise = admincategorymodel.searchcategorybyname(category_name);
  promise.then((result) => {
    res.json(result);

  })
  promise.catch((err) => {
    res.send("Something went to wrong");
  })
});


