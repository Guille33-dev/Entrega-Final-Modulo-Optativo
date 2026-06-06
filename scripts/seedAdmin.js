require("dotenv").config();

const mongoose = require("mongoose");
const { connectDB } = require("../db");
const User = require("../models/User");
const Trainer = require("../models/Trainer");
const { logger } = require("../utils/logger");

async function seed() {
  await connectDB();

  await User.findOneAndDelete({ username: "admin" });
  await User.create({ username: "admin", password: "admin123", roles: ["admin"] });

  await User.findOneAndDelete({ username: "profesor" });
  await User.create({ username: "profesor", password: "profesor123", roles: ["profesor"] });

  const trainerCount = await Trainer.countDocuments();
  if (trainerCount === 0) {
    await Trainer.create([
      { name: "Laura Martín", specialty: "fitness", experienceYears: 8 },
      { name: "Carlos Ruiz", specialty: "boxing", experienceYears: 5 },
      { name: "Marta León", specialty: "yoga", experienceYears: 6 }
    ]);
  }

  logger.info("Seed completado. Usuarios de prueba creados", {
    admin: "admin/admin123",
    profesor: "profesor/profesor123"
  });

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  logger.error("Error ejecutando seed", { error: error.message });
  await mongoose.disconnect();
  process.exit(1);
});
