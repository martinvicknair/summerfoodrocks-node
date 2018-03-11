module.exports = function(sequelize, DataTypes) {
  var Contact = sequelize.define("Contact", {
    // firstName (VARCHAR, NOT NULL, between 1-100 characters)
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    // lastName (VARCHAR, NOT NULL, between 1-100 characters)
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    // contactType (VARCHAR, Default value "Personal")
    contactType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Personal"
    },
    // phoneNumber (VARCHAR, length 10 characters, numbers only)
    phoneNumber: {
      // type: DataTypes.INTEGER,
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10],
        is: ["^[0-9]+$", 'i']
      }
    },
    // emailAddress (VARCHAR, must be valid email format)
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100],
        isEmail: true,
      }
    },
  });
  // be sure to return the model!
  return Contact;
};
