module.exports = function(sequelize, DataTypes) {
  var Search = sequelize.define("Search", {
    logText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numResults: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    searchTerms: {
      type: DataTypes.STRING,
      allowNull: false
    },
    searchX: {
      type: DataTypes.FLOAT(10, 6),
      allowNull: false
    },
    searchY: {
      type: DataTypes.FLOAT(10, 6),
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
    }
  });
  // be sure to return the model!
  return Search;
};
