const Application = require("../models/Application");
const Notification = require("../models/Notification");
const Installation = require("../models/Installation");
const applicationService = require("../services/applicationService");

exports.createApp = async (req, res) => {

    try {

        const { name, description, genre, version, releaseDate, imageUrl } = req.body;

        const app = new Application({
            name,
            description,
            genre,
            version,
            releaseDate,
            imageUrl,
            ownerId: req.user.userId
        });

        await app.save();

        res.status(201).json({
            message: "Application created successfully",
            app
        });

    } catch (error) {

    console.error("Create App Error:", error);

    res.status(500).json({
        message: error.message
    });

}

};

exports.getAllApps = async (req, res) => {

    try {

        const apps = await Application.find({ visibility: "public" });

        res.json(apps);

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

};

exports.getOwnerApps = async (req, res) => {

    try {

        const apps = await Application.find({
            ownerId: req.user.userId
        });

        res.json(apps);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};

exports.getAppById = async (req, res) => {

    try {

        const app = await Application.findById(req.params.id);

        if (!app) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json(app);

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

};
    //owner only
exports.updateApp = async (req, res) => {

    try {

        const app = await Application.findById(req.params.id);

        if (!app) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (app.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        Object.assign(app, req.body);

        await app.save();

        res.json({
            message: "Application updated",
            app
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

};

exports.deleteApp = async (req, res) => {

    try {

        const app = await Application.findById(req.params.id);

        if (!app) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if (app.ownerId.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Not authorized"
            });
        }

        await app.deleteOne();

        res.json({
            message: "Application deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }

};

exports.changeVisibility = async (req, res) => {

    try {

        const appId = req.params.id;
        const { visibility } = req.body;

        if (!["public", "private"].includes(visibility)) {
            return res.status(400).json({
                message: "Visibility must be either public or private"
            });
        }

        const app = await Application.findById(appId);

        if (!app) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        app.visibility = visibility;

        await app.save();

        res.json({
            message: "Application visibility updated",
            app
        });

    } catch (error) {

        console.error("Visibility Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

};

exports.downloadApp = async (req, res) => {
    try {
        const app = await applicationService.installApp(
            req.user.userId,
            req.params.id
        );

        res.json({
            message: "App installed successfully",
            downloads: app.downloads
        });
    } catch (error) {
        console.error("Download Error:", error);
        res.status(400).json({
            error: error.message
        });
    }
};

exports.searchApps = async (req, res) => {

    try {

        const { name } = req.query;

        const apps = await Application.find({
            name: { $regex: name, $options: "i" },
            visibility: "public"
        });

        res.json({
            results: apps.length,
            apps
        });

    } catch (error) {

        console.error("Search Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

};

exports.getAppsByCategory = async (req, res) => {

    try {

        const genre = req.params.genre;

        const apps = await Application.find({
            genre: genre,
            visibility: "public"
        });

        res.json({
            results: apps.length,
            apps
        });

    } catch (error) {

        console.error("Category Error:", error);

        res.status(500).json({
            message: error.message
        });

    }

};

exports.filterByRating = async (req, res) => {
    try {

        const minRating = Number(req.query.rating);

        const apps = await Application.find({
            visibility: "public",
            rating: { $gte: minRating }
        });

        res.json({
            total: apps.length,
            apps
        });

    } catch (error) {

        console.error("Filter Rating Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }
};

exports.announceUpdate = async (req, res) => {
    try {
        const { appId, version } = req.body;

        const app = await Application.findById(appId);

        if (!app) {
            return res.status(404).json({ message: "Application not found" });
        }

        // update version
        app.version = version;
        await app.save();

        // find users who installed the app
        const installs = await Installation.find({ appId });

        for (const install of installs) {
            await Notification.create({
                userId: install.userId,
                appId: app._id,
                message: `${app.name} has been updated to version ${version}`,
                type: "APP_UPDATE"
            });
        }

        res.json({ message: "Update announced to users" });
    } catch (error) {
        console.error("Announce Update Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.checkInstallation = async (req, res) => {
    try {
        const install = await Installation.findOne({
            userId: req.user.userId,
            appId: req.params.id
        });

        res.json({
            installed: !!install
        });
    } catch (error) {
        console.error("Check Installation Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getMyInstalledApps = async (req, res) => {
    try {
        const installs = await Installation.find({
            userId: req.user.userId
        }).populate("appId");

        const apps = installs.map(i => i.appId);

        res.json(apps);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uninstallApp = async (req, res) => {
  try {
    const result = await applicationService.uninstallApp(
      req.user.userId,
      req.params.id
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
};