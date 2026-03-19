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
    userId: {
      type: DataTypes.UUID,
      field: "user_id",
    },
  },
  {
    tableName: "posts",
    timestamps: true,
    underscored: true,
  },
);
