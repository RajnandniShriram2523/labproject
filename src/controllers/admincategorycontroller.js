let admincategorymodel=require("../models/admincategorycurdmodel");

exports.addcategory = ((req, res) => {
  let { category_name } = req.body;
  let promise = admincategorymodel.Addcategory(category_name);
  promise.then((result) => {
    console.log(result);
    
    res.json({status:"Category Added Successfully", msg: result });
  }).catch((err) => {
    res.json({status:"❗ Category not Added",  msg: err });
  });

});



exports.viewcategory = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  admincategorymodel.viewcategoryWithPagination(limit, offset)
    .then((data) => {
      const totalPages = Math.ceil(data.total / limit);
      res.json({
        status: "view",
        currentPage: page,
        perPage: limit,
        totalItems: data.total,
        totalPages: totalPages,
        categorylist: data.categories
      });
    })
    .catch((err) => {
      res.status(500).json({ status: "error", message: err });
    });
};

// exports.deletecategory = (req, res) => {
//   let category_id = parseInt(req.params.id);  // ✅ use 'id', same as route param name
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 5;
//   const offset = (page - 1) * limit;

//   admincategorymodel.deletebycategoryid(category_id)
//     .then(() => {
//       return admincategorymodel.viewcategoryWithPagination(limit, offset);
//     })
//     .then((data) => {
//       const totalPages = Math.ceil(data.total / limit);
//       res.json({
//         status: "delete",
//         currentPage: page,
//         perPage: limit,
//         totalItems: data.total,
//         totalPages: totalPages,
//         categorylist: data.categories
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({ status: "error", message: err });
//     });
// };
exports.deletecategory = (req, res) => {
  let category_id = parseInt(req.params.id);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  admincategorymodel.deletebycategoryid(category_id)
    .then(() => {
      return admincategorymodel.viewcategoryWithPagination(limit, offset);
    })
    .then((data) => {

      console.log(data.categories)
      const totalPages = Math.ceil(data.total / limit);
      res.json({
        status: "delete",
        currentPage: page,
        perPage: limit,
        totalItems: data.total,
        totalPages: totalPages,
        categorylist: data.categories
      });
    })
    .catch((err) => {
      console.error("❌ Delete Category Error:", err);  // ✅ Add this
      res.status(500).json({ status: "error", message: err });
    });
};


exports.updatecategory = ((req, res) => {
  res.json({status:"update", category_name: req.query.category_name,category_id: req.query.category_id});
})

exports.FinalUpdatecategory = (req, res) => {
  const { category_id, category_name } = req.body;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  if (!category_id || !category_name) {
    return res.status(400).json({ status: "error", message: "Missing category_id or category_name" });
  }

  admincategorymodel.finalupdatecategory(category_id, category_name)
    .then(() => admincategorymodel.viewcategoryWithPagination(limit, offset))
    .then((data) => {
      res.json({
        status: "finalupdate",
        currentPage: page,
        perPage: limit,
        totalItems: data.total,
        totalPages: Math.ceil(data.total / limit),
        categorylist: data.categories
      });
    })
    .catch((err) => {
      res.status(500).json({ status: "error", message: err });
    });
};


// Fix typo: serach → search
// controllers/admincategory.js
exports.searchCategoryByUsingName = (req, res) => {
  const category_name = req.query.category_name || ''; // ← now using route param
  const page = Math.max(parseInt(req.query.page) || 1, 1); // still using query
  const limit = Math.max(parseInt(req.query.limit) || 5, 1);
  const offset = (page - 1) * limit;

  admincategorymodel.searchCategoryByName(category_name, limit, offset)
    .then((data) => {
      const totalPages = Math.ceil(data.total / limit);
      res.json({
        status: "success",
        currentPage: page,
        perPage: limit,
        totalItems: data.total,
        totalPages: totalPages,
        categoryList: data.categories
      });
    })
    .catch((err) => {
      console.error("Search error:", err);
      res.status(500).json({ status: "error", message: err.message || err });
    });
};

