import Users from "./Users.js";
import Posts from "./Posts.js";

Users.hasMany(Posts, { as: "posts" });
Posts.belongsTo(Users, { foreignKey: "userId", as: "author" });

export { Users, Posts };
