module.exports = function(sequelize, DataTypes) {
  var Search = sequelize.define("Search", {
    dateAdded: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    logText: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    numResults: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Personal"
    },
    searchTerms: {
      // type: DataTypes.INTEGER,
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10],
        is: ["^[0-9]+$", 'i']
      }
    },
    searchX: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
        isEmail: true,
      }
    },
    searchY: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Personal"
    },
    userNeighborhood: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Personal"
    },
    userX: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Personal"
    },
    userY: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Personal"
    }
  });
  // be sure to return the model!
  return Search;
};
