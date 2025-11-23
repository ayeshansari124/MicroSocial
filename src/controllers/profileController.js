const mongoose = require('mongoose');
const User = require('../models/User');
const upload = require('../config/multerConfig');

const viewProfile = async (req, res) => {
  try {
    const uid = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(uid)) return res.status(400).send('Invalid user id');

    const profileUser = await User.findById(uid)
      .populate({
        path: 'posts',
        populate: { path: 'author', select: 'name profile' },
        options: { sort: { createdAt: -1 } }
      })
      .lean();

    if (!profileUser) return res.status(404).send('User not found');

    const me = await User.findById(req.userId)
      .populate({
        path: 'posts',
        populate: { path: 'author', select: 'name profile' },
        options: { sort: { createdAt: -1 } }
      })
      .lean();

    return res.render('profile', { user: me, profileUser, editPostId: null });
  } catch (err) {
    console.error('viewProfile error:', err);
    return res.status(500).send('Server error');
  }
};

const myProfile = async (req, res) => {
  try {
    const me = await User.findById(req.userId)
      .populate({
        path: 'posts',
        populate: { path: 'author', select: 'name profile' },
        options: { sort: { createdAt: -1 } }
      })
      .lean();

    if (!me) return res.status(404).send('User not found');

    const editPostId = req.query.editPostId ? String(req.query.editPostId) : null;
    return res.render('profile', { user: me, profileUser: null, editPostId });
  } catch (err) {
    console.error('myProfile error:', err);
    return res.status(500).send('Server error');
  }
};

const showUploadForm = async (req, res) => res.render('profileUpload');

const handleUpload = [
  upload.single('profile'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).send('No file uploaded');
      await User.findByIdAndUpdate(req.userId, { profile: '/uploads/' + req.file.filename });
      return res.redirect('/profile');
    } catch (err) {
      console.error('handleUpload error:', err);
      return res.status(500).send('Upload failed');
    }
  }
];

const search = async (req, res) => {
  const me = req.user;
  const query = req.query.q || "";
  const results = await User.find(query ? { name: new RegExp(query, "i") } : {}).lean();
  return res.render('search', { results, query, user: me });
};

module.exports = {
  viewProfile,
  myProfile,
  showUploadForm,
  handleUpload,
  search
};
