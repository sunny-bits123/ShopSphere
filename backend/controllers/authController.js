const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Helper: send token response with cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('Email already registered', 400));
  }

  const user = await User.create({ name, email, password });
  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new ErrorResponse('Invalid credentials', 401));

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

  sendTokenResponse(user, 200, res);
});

// @desc    Logout / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out' });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name price images');
  res.status(200).json({ success: true, user });
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, user });
});

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});
 
// @desc    Add address
// @route   POST /api/auth/address
// @access  Private
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { label, street, city, state, pincode, country, phone, isDefault } = req.body;

  // If new address is default, remove default from others
  if (isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  // If first address, make it default automatically
  if (user.addresses.length === 0) {
    req.body.isDefault = true;
  }

  user.addresses.push({ label, street, city, state, pincode, country: country || 'India', phone, isDefault: req.body.isDefault || false });
  await user.save();

  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Update address
// @route   PUT /api/auth/address/:addressId
// @access  Private
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) return next(new ErrorResponse('Address not found', 404));

  const { label, street, city, state, pincode, country, phone, isDefault } = req.body;

  // If setting as default, remove default from others
  if (isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  address.label    = label    || address.label;
  address.street   = street   || address.street;
  address.city     = city     || address.city;
  address.state    = state    || address.state;
  address.pincode  = pincode  || address.pincode;
  address.country  = country  || address.country;
  address.phone    = phone    || address.phone;
  address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Delete address
// @route   DELETE /api/auth/address/:addressId
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) return next(new ErrorResponse('Address not found', 404));

  address.deleteOne();

  // If deleted address was default, make first address default
  if (user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Set default address
// @route   PUT /api/auth/address/:addressId/default
// @access  Private
exports.setDefaultAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  user.addresses.forEach(addr => {
    addr.isDefault = addr._id.toString() === req.params.addressId;
  });

  await user.save();
  res.status(200).json({ success: true, addresses: user.addresses });
});