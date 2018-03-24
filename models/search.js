module.exports = function(sequelize, DataTypes) {
  var Search = sequelize.define("Search", {
    logText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resultNum: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    queryTerms: {
      type: DataTypes.STRING,
      allowNull: false
    },
    queryX: {
      type: DataTypes.FLOAT(10, 6),
      allowNull: false
    },
    queryY: {
      type: DataTypes.FLOAT(10, 6),
      allowNull: false
    },
    queryZip: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userNeighborhood: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userX: {
      type: DataTypes.FLOAT(10, 6),
      allowNull: false
    },
    userY: {
      type: DataTypes.FLOAT(10, 6),
      allowNull: false
    },
    userZip: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  // be sure to return the model!
  return Search;
};
