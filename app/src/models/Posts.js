import { DataTypes } from "sequelize";
import sequelize from "../infra/database.js";

export default sequelize.define(
  "Posts",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "posts",
    timestamps: true,
    underscored: true,
  },
);
