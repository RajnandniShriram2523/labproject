let db = require("../../db.js"); // make sure db.js exports the pool

exports.Addcategory = async (category_name) => {
    try {
        // Check if category already exists
        const [rows] = await db.query(
            "SELECT * FROM category WHERE category_name = ?",
            [category_name]
        );

        if (rows.length > 0) {
            throw new Error("Category already exists");
        }

        // Insert if not exists
        const [result] = await db.query(
            "INSERT INTO category (category_id, category_name) VALUES (?, ?)",
            [0, category_name]
        );

        return result;
    } catch (err) {
        throw err;
    }
};

exports.viewcategoryWithPagination = async (limit, offset) => {
  try {
    // Fetch paginated categories
    const [categories] = await db.query(
      "SELECT * FROM category LIMIT ? OFFSET ?",
      [limit, offset]
    );

    // Fetch total count
    const [countResult] = await db.query(
      "SELECT COUNT(*) AS total FROM category"
    );

    return {
      categories,
      total: countResult[0].total
    };
  } catch (err) {
    throw err;
  }
};



exports.deletebycategoryid = async (category_id) => {
  try {
    const [result] = await db.query(
      "DELETE FROM category WHERE category_id = ?",
      [category_id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Category not found");
    }

    return "Success";
  } catch (err) {
    throw err;
  }
};





// ✅ Fetch category by ID
// Get category by ID
exports.getCategoryById = async (id) => {
  try {
    const [results] = await db.query(
      "SELECT category_id, category_name FROM category WHERE category_id = ?",
      [id]
    );

    return results[0]; // return single row
  } catch (err) {
    throw err;
  }
};

// Update category
exports.finalupdatecategory = async (category_id, category_name) => {
  try {
    const [result] = await db.query(
      "UPDATE category SET category_name = ? WHERE category_id = ?",
      [category_name, category_id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Category not found or no change made");
    }

    return "Success";
  } catch (err) {
    throw err;
  }
};



// models/admincategorymodel.js
// Search categories by name with pagination
exports.searchCategoryByName = async (category_name, limit, offset) => {
  try {
    const searchQuery = `%${category_name}%`;

    // Fetch matching categories with pagination
    const [categories] = await db.query(
      "SELECT * FROM category WHERE category_name LIKE ? LIMIT ? OFFSET ?",
      [searchQuery, limit, offset]
    );

    // Fetch total count of matching categories
    const [countResult] = await db.query(
      "SELECT COUNT(*) AS total FROM category WHERE category_name LIKE ?",
      [searchQuery]
    );

    return {
      total: countResult[0].total,
      categories
    };
  } catch (err) {
    throw err;
  }
};


