module.exports = (sequelize, DataTypes) => {
  return sequelize.define("userIP", {
    imageId: {
      type: DataTypes.STRING
    },
    liked: {
      type: DataTypes.BOOLEAN
    },
    ip: {
      type: DataTypes.STRING
    }
  });
};
