module.exports = (sequelize, DataTypes) => {
  return sequelize.define("userIP", {
    imageId: {
      type: DataTypes.STRING
    },
    ip: {
      type: DataTypes.STRING
    },
    liked : {
      type: DataTypes.BOOLEAN
    },
    disliked : {
      type: DataTypes.BOOLEAN
    }
  });
};
