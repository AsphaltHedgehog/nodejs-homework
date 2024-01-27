const { User } = require("../models/user.js");
const ctrlWrapper = require("../helpers/ctrlWrapper.js");

const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const gravatar = require('gravatar');
const crypto = require('crypto');

const { envsConfig } = require("../configs");

const confirmEmail = require("../services/emailService.js");

const register = async (req, res) => {
  const { email } = req.body;

  const avatarUrl = gravatar.url(email)
  const hashedPassword = await bcrypt.hash(req.body.password, 5)
  
  const verificationToken = crypto.randomUUID();

  const createdUser = await User.create({ ...req.body, password: hashedPassword, token: null, avatarUrl: avatarUrl, verificationToken: verificationToken });
  
  const verifyEmail = {
    to: email,
    subject: 'Verification email',
    html: `<a href='${envsConfig.baseUrl}/api/auth/verify/:${verificationToken}' target='_blank'>Pleas confirm email via url</a>`
  };

  await confirmEmail(verifyEmail);

  res.status(201).json({
    user: { email: createdUser.email, subscription: createdUser.subscription }
  });
};

const verify = async (req, res) => { 
  const { verificationToken } = req.params;
  console.log(verificationToken);
  const user = await User.findOne({ verificationToken })

  if (!user) {
    res.status(404).json({message: 'User not found'})
  }

  await User.findByIdAndUpdate(user.id, { verificationToken: '', isVerified: true })

  res.json({message: 'Verification successful'})
};

const resend = async (req, res) => { 
  const { email } = req.body;
  const user = await User.findOne({ email })

  if (!user) {
    res.status(404).json({message: 'User not found'})
  }

  if (user.isVerified) {
    res.status(400).json({message: 'User already verified'})
  }

  const verifyEmail = {
    to: email,
    subject: 'Verification email',
    html: `<a href='${envsConfig.baseUrl}/api/auth/verify/${user.verificationToken}' target='_blank'>Pleas confirm email via url</a>`
  };

  await confirmEmail(verifyEmail);

  res.status(200).json({ message: 'Verification email send' })
};

const login = async (req, res) => {
  const { email, password } = req.body
  const ifExists = await User.findOne({ email })
  
  if (!ifExists) {
    res.status(401).json({ message: 'Email or password wrong' })
  }

  const isSamePassword = await bcrypt.compare(password, ifExists.password);

  if (!isSamePassword) {
    res.status(401).json({ message: 'Email or password wrong' })
  }

  if (!ifExists.isVerified) {
    res.status(401).json({ message: 'first verify via email' })
  }
  
  const token = await jsonwebtoken.sign({ id: ifExists.id }, envsConfig.secret);
  await User.findByIdAndUpdate(ifExists.id, {token: token});

  res.status(200).json({
    token,
    user: {
      email,
      subscription: ifExists.subscription
    }
  })
};

const logout = async (req, res) => {
  const { id } = req.user 
  
  await User.findByIdAndUpdate(id, { token: null });
  res.status(204).end()
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({email, subscription})
};

const subscription = async (req, res) => {
  const { subscriptionPlan } = req.body
  const { id, subscription } = req.user;

  if (subscriptionPlan !== 'starter' && subscriptionPlan !== 'pro' && subscriptionPlan !== 'business') {
    res.status(400).json({ message: 'Missing valid, new subscription plan' })
    return;
  }

  await User.findByIdAndUpdate(id, { subscription: subscriptionPlan });
  res.status(200).json({ message: `Successfully switched subscription plan from ${subscription} to ${subscriptionPlan}` })
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resend: ctrlWrapper(resend),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  subscription: ctrlWrapper(subscription),
};