const express = require("express");
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const GymClass = require("../models/GymClass");
const { generateAccessToken, verifyAccessToken } = require("../utils/tokenUtils");

const router = express.Router();
const classManagerRoles = ["admin", "profesor"];

function getCookieValue(req, name) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const cookie = cookies.find((entry) => entry.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

function getCurrentUser(req) {
  const token = getCookieValue(req, "gymmanager_token");

  if (!token) {
    return null;
  }

  try {
    return verifyAccessToken(token);
  } catch (error) {
    return null;
  }
}

function requirePageAuth(req, res, next) {
  const user = getCurrentUser(req);

  if (!user) {
    return res.redirect("/login?error=Inicia sesión con una cuenta autorizada para programar clases");
  }

  req.user = user;
  return next();
}

function requireClassManager(req, res, next) {
  const hasPermission = req.user.roles.some((role) => classManagerRoles.includes(role));

  if (!hasPermission) {
    return res.status(403).render("login", {
      title: "Acceso del equipo",
      error: "Solo las cuentas de admin o profesor pueden programar clases"
    });
  }

  return next();
}

function translateLevel(level) {
  const levels = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado"
  };

  return levels[level] || level;
}

router.use((req, res, next) => {
  res.locals.currentUser = getCurrentUser(req);
  res.locals.canCreateClasses = Boolean(
    res.locals.currentUser?.roles?.some((role) => classManagerRoles.includes(role))
  );
  next();
});

router.get("/", (req, res) => {
  res.render("index", {
    title: "GymManager",
    description: "Organiza las clases del gimnasio sin perder de vista horarios, plazas y entrenadores."
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    title: "Acceso del equipo",
    error: req.query.error || null
  });
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).render("login", {
        title: "Acceso del equipo",
        error: "El usuario o la contraseña no son correctos"
      });
    }

    if (!user.active) {
      return res.status(403).render("login", {
        title: "Acceso del equipo",
        error: "El usuario está desactivado"
      });
    }

    const token = generateAccessToken(user);
    res.cookie("gymmanager_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    return res.redirect("/classes");
  } catch (error) {
    return next(error);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("gymmanager_token");
  res.redirect("/");
});

router.get("/classes", async (req, res, next) => {
  try {
    const classes = await GymClass.find().populate("trainer").sort({ startsAt: 1 });
    res.render("classes-list", { title: "Clases programadas", classes, translateLevel });
  } catch (error) {
    next(error);
  }
});

router.get("/classes/new", requirePageAuth, requireClassManager, async (req, res, next) => {
  try {
    const trainers = await Trainer.find({ available: true }).sort({ name: 1 });
    res.render("class-create", { title: "Programar nueva clase", trainers, error: null });
  } catch (error) {
    next(error);
  }
});

router.post("/classes", requirePageAuth, requireClassManager, async (req, res, next) => {
  try {
    await GymClass.create(req.body);
    res.redirect("/classes");
  } catch (error) {
    const trainers = await Trainer.find({ available: true }).sort({ name: 1 });
    res.status(400).render("class-create", {
      title: "Programar nueva clase",
      trainers,
      error: error.message
    });
  }
});

module.exports = router;
