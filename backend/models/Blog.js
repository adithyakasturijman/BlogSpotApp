import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Blog = sequelize.define("Blog", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});


export default Blog;