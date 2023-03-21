const { Contact, schemas } = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const result = await Contact.find({});
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  console.log(contactId);
  const result = await Contact.findById(contactId);
  console.log(result);
  if (!result) {
    throw HttpError(404, `Contact ID=${contactId} Not found`);
  }
  res.json(result);
};

const add = async (req, res ) => {
  const { error } = schemas.addSchemaforPost.validate(req.body);
  const { favorite } = req.body;
  if (error) {
    throw HttpError(400, error.message);
  }

  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

const deleteById = async (req, res ) => {
  const { contactId } = req.params;
  result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateById = async (req, res ) => {
  const { contactId } = req.params;
  const { error } = schemas.addSchemaforPut.validate(req.body);
  const length = Object.keys(req.body).length;

  if (length === 0) {
    throw HttpError(400, "No body");
  }

  if (error) {
    throw HttpError(400, "missing fields");
  }

  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

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