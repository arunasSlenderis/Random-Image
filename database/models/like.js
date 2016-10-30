export default (sequelize, DataTypes) => {
  return sequelize.define("like", {
    imageId: {
      type: DataTypes.STRING
    },
    likes: {
      type: DataTypes.INTEGER
    }
  });
};
