const express = require("express");
const { isValidId, validateBody } = require("../../middlewares");

const router = express.Router();
const ctrl = require("../../controllers/contacts");

const { schemas } = require("../../models/contacts");
const { addForFavoriteSchema, addSchemaforPut, addSchemaforPost } = schemas;

router.get("/", ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getById);

router.post("/", validateBody(addSchemaforPost), ctrl.add);

router.delete("/:contactId", isValidId, ctrl.deleteById);

router.put("/:contactId", isValidId, validateBody(addSchemaforPut), ctrl.updateById);

router.patch("/:contactId/favorite", isValidId, validateBody(addForFavoriteSchema), ctrl.updateStatusContact);

module.exports = router;


