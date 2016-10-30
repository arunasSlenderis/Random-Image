module.exports = (sequelize, DataTypes) => {
  return sequelize.define("userIP", {
    imageId: {
      type: DataTypes.STRING
    },
    ip: {
      type: DataTypes.STRING
    },
    liked_disliked : {
      type: DataTypes.BOOLEAN
    }
  });
};
