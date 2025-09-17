const jwt = require("jsonwebtoken");
const PageSchemaData = require("../models/pageModel");
const CountrySchemaData = require("../models/countryModel");
const AuthenticationSchemaData = require("../models/authenticationModel");

exports.register = async (req, res) => {
  try {
    const users = new AuthenticationSchemaData({
      full_name: req.body.full_name,
      email: req.body.email,
      password: req.body.password,
      request_user_id: req.body.request_user_id,
    });

    AuthenticationSchemaData.findOne({
      email: req.body.email,
      password: req.body.password,
    }).then(async (userExist) => {
      if (userExist) {
        res
          .status(500)
          .json({ message: "User email and password already exists" });
      } else {
        await users.save();
        return res.status(200).json({ message: "User added succesfully" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
};

exports.login = async (req, res) => {
  try {
    AuthenticationSchemaData.findOne({
      email: req.body.email,
      password: req.body.password,
    }).then(async (userExist) => {
      if (userExist) {
        const jsonwebtoken = jwt.sign(
          { email: req.body.email, password: req.body.password },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        return res.status(200).json({
          message: "User Login Succesfully",
          responseData: {
            token: jsonwebtoken,
            request_user_id: userExist?.request_user_id,
            user_name: `${userExist?.full_name}`,
          },
        });
      } else {
        return res.status(500).json({ message: "User does not exist" });
      }
    });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
};

exports.createPage = async (req, res) => {
  try {
    const users = new PageSchemaData({
      page_id: req.body.page_id,
      page_name: req.body.page_name,
      page_route: req.body.page_route,
      page_data: req.body.page_data,
      request_user_id: req.body.request_user_id,
    });

    await users.save();
    return res.status(200).json({ message: "Page Added Succesfully" });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
};

exports.pageList = async (req, res) => {
  try {
    const filters = {};
    if (req.body.page_id) {
      filters.page_id = req.body.page_id;
    }
    if (req.body.page_route) {
      filters.page_route = req.body.page_route;
    }
    if (req.body.request_user_id) {
      filters.request_user_id = req.body.request_user_id;
    }
    const users = await PageSchemaData.find(filters);
    return res.status(200).json({
      message: "Page Fetched Successfully",
      responseData: users,
    });
  } catch (err) {
    console.log("errerr", err);
    return res.status(500).json({ error: "server error" });
  }
};

exports.getIcons = (req, res) => {
  try {
    const FaIcons = require("react-icons/fa");
    const MdIcons = require("react-icons/md");
    const HiIcons = require("react-icons/hi");
    const AiIcons = require("react-icons/ai");
    const Icons = { ...FaIcons, ...MdIcons, ...HiIcons, AiIcons };
    const iconsData = Object.keys(Icons).map((el) => el);
    const filterData = iconsData.filter((el) =>
      el.toLowerCase().includes(req.body.icon_name.toLowerCase())
    );
    const filterIcons = !req.body.icon_name ? [] : filterData;
    res.status(200).json(filterIcons);
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
};

exports.countriesList = async (req, res) => {
  try {
    const countries = await CountrySchemaData.find();
    return res.status(200).json({
      message: "Countries Fetched Successfully",
      responseData: countries,
    });
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
};

exports.editPage = async (req, res) => {
  try {
    await PageSchemaData.updateOne(
      { _id: req.body.id },
      { $set: req.body.datas }
    );
    if (!req.body.id || !req.body.datas) {
      return res.status(400).json({ message: "Missing ID or data" });
    }
    return res.status(200).json({
      message: "Page Edited Successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: "server error" });
  }
};
