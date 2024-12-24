const path = require("path");
const cors = require("cors");
const { Sequelize } = require("sequelize");

require("dotenv").config();

const express = require("express");

const { Post } = require("./models");

const app = express();

app.use("/images", express.static("images"));
app.use(cors());
app.use(express.json());

// Routes import
const postRoutes = require("./routes/posts");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use(postRoutes);
app.use(adminRoutes);
app.use("/auth", authRoutes);

// Sequelize instance setup
const sequelize = new Sequelize(
  process.env.DB_NAME, // Naziv baze podataka
  process.env.DB_USER, // Korisničko ime
  process.env.DB_PASSWORD, // Lozinka
  {
    host: process.env.DB_HOST, // Host baze podataka
    dialect: process.env.DB_DIALECT, // Tip baze
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    // Kreira tabele prema modelima
    await sequelize
      .sync({ alter: true })
      .then(() => console.log("Tables synchronized successfully."))
      .catch((error) => console.error("Error synchronizing tables:", error));

    app.listen(process.env.PORT, () => {
      console.log("Server listening on port", process.env.PORT);
    });
  } catch (error) {
    console.error("Connection denied: ", error);
  }
})();
