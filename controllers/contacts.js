const { Contact, schemas } = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  // console.log(req.user);
  const { _id: owner } = req.user;
   const {page=1, limit=20, favorite=null, name=null, email=null} = req.query;
  const skip = (page-1)*limit
  let filter = { };
  if (favorite) {
    filter = {...filter, favorite}
  }

  if (name) {
    filter = {...filter, name}
  }

  if (email) {
    filter = {...filter, email}
  }

  console.log(filter)
  const result = await Contact.find({ owner, ...filter }, "-createdAt -updatedAt", { skip, limit })
    .populate("owner", "name");
  res.json(result);
};

const getById = async (req, res) => {
  // console.log(req.user);
  const { contactId } = req.params;
  console.log(contactId);
  const { _id: owner } = req.user;
  const result = await Contact.findOne({_id: contactId, owner});
  console.log(result);
  if (!result) {
    throw HttpError(404, `Contact ID=${contactId} Not found`);
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { error } = schemas.addSchemaforPost.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const result = await Contact.create({...req.body, owner});
  res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const {_id: owner} = req.user;
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete({_id: contactId, owner});
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateById = async (req, res) => {
  const {_id : owner} = req.user
  const { contactId } = req.params;
  const { error } = schemas.addSchemaforPut.validate(req.body);
  const length = Object.keys(req.body).length;

  if (length === 0) {
    throw HttpError(400, "No body");
  }

  if (error) {
    throw HttpError(400, "missing fields");
  }

  const result = await Contact.findOneAndUpdate({_id: contactId, owner}, req.body, {
    new: true });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res ) => {
  const { contactId } = req.params;
  const length = Object.keys(req.body).length;

  if (length === 0) {
    throw HttpError(400, "missing field favorite");
  }

  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};