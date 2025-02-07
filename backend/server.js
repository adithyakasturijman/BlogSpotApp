import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import blogRoutes from  './routes/blogRoutes.js';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/blogs",blogRoutes);

sequelize
  .sync({force : false})
  .then(() => {
    console.log('DB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("Error:" + err));