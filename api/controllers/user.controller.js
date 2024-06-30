import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    message: "api route is working",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only update your own account"));

  try {
    if (req.body.passwrod)
      req.body.passwrod = bcryptjs.hashSync(req.body.passwrod, 10);

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only delete your own account"));

  try {
    if (req.body.passwrod)
      req.body.passwrod = bcryptjs.hashSync(req.body.passwrod, 10);

    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const userListing = async (req, res, next) => {
  try {
    // console.log(req.params.id);
    if (req.user.id == req.params.id) {
      const listings = await Listing.find({ userRef: req.params.id });
      // console.log(listings);
      res.status(200).json(listings);
    } else {
      next(err);
    }
  } catch (err) {
    return next(errorHandler(401, "You can only view your own listing"));
  }
};
