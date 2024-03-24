const express = require("express");

const router = express.Router();
const admin = require("firebase-admin");
const multer = require("multer");

const upload = multer();
const {getAllEvents, findEventByID, CreateOrUpdateEvent, getAllEventPublished } = require("../services/eventService");

router.post(
  "/createEvent",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      await CreateOrUpdateEvent(req, res, admin);
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.post(
  "/update/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      await CreateOrUpdateEvent(req, res, admin, req.params.id);
    } catch (error) {
      console.error(error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/allEvents" , async (req, res) => {
  try {
    await getAllEvents(req, res);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal Server Error" });
  }
} )

router.get("/publicEvent" , async (req, res) => {
  try {
    await getAllEventPublished(req, res);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal Server Error" });
  }
} )
router.get("/:id" , async (req, res) => {
  try {
    await findEventByID(req, res , req.params.id);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Internal Server Error" });
  }
})
module.exports = router;
