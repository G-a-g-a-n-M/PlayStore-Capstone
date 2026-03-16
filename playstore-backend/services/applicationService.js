const Application = require("../models/Application");
const Installation = require("../models/Installation");
const Notification = require("../models/Notification");

exports.installApp = async (userId, appId) => {
  const app = await Application.findById(appId);

  if (!app) {
    throw new Error("App not found");
  }

  const alreadyInstalled = await Installation.findOne({
    userId,
    appId
  });

  if (alreadyInstalled) {
    throw new Error("App already installed");
  }

  await Installation.create({
    userId,
    appId
  });

  app.downloads += 1;
  await app.save();

  // Keep original notification logic
  await Notification.create({
    userId: app.ownerId,
    appId: app._id,
    message: `Your app "${app.name}" was downloaded`,
    type: "APP_DOWNLOADED"
  });

  return app;
};
exports.uninstallApp = async (userId, appId) => {
  const installation = await Installation.findOne({
    userId,
    appId
  });

  if (!installation) {
    throw new Error("App not installed");
  }

  await Installation.deleteOne({
    userId,
    appId
  });

  const app = await Application.findById(appId);
  if (app && app.downloads > 0) {
    app.downloads -= 1;
    await app.save();
  }

  return { message: "App uninstalled successfully" };
};
