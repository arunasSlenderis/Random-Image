export default (sequelize, DataTypes) => {
  return sequelize.define("like", {
    imageId: {
      type: DataTypes.STRING
    },
    likes: {
      type: DataTypes.INTEGER
    },
    dislikes: {
      type: DataTypes.INTEGER
    },
    views: {
      type: DataTypes.INTEGER
    }
  });
};
