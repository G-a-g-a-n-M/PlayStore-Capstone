const express = require("express");

const router = express.Router();

const appController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post(
"/",
authMiddleware,
roleMiddleware("owner"),
appController.createApp
);

router.get("/", appController.getAllApps);
router.get("/search", appController.searchApps);
router.get("/filter", appController.filterByRating);
router.get("/category/:genre", appController.getAppsByCategory);

router.get(
    "/my-apps",
    authMiddleware,
    roleMiddleware("owner"),
    appController.getOwnerApps
);

router.get("/:id", appController.getAppById);

router.put(
"/:id",
authMiddleware,
roleMiddleware("owner"),
appController.updateApp
);

router.delete(
  "/:id/uninstall",
  authMiddleware,
  appController.uninstallApp
);

router.delete(
"/:id",
authMiddleware,
roleMiddleware("owner"),
appController.deleteApp
);

router.patch(
"/:id/visibility",
authMiddleware,
roleMiddleware("owner"),
appController.changeVisibility
);

router.post(
"/:id/download",
authMiddleware,
appController.downloadApp
);

router.get(
"/:id/installed",
authMiddleware,
appController.checkInstallation
);

router.get(
"/user/installed-apps",
authMiddleware,
appController.getMyInstalledApps
);

router.post(
 "/announce-update",
 authMiddleware,
 roleMiddleware("owner"),
 appController.announceUpdate
);

module.exports = router;