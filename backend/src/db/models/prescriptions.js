const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const prescriptions = sequelize.define(
    'prescriptions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      medication: {
        type: DataTypes.TEXT,
      },

      dosage: {
        type: DataTypes.TEXT,
      },

      frequency: {
        type: DataTypes.TEXT,
      },

      prescribed_date: {
        type: DataTypes.DATE,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  prescriptions.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.prescriptions.belongsTo(db.patients, {
      as: 'patient',
      foreignKey: {
        name: 'patientId',
      },
      constraints: false,
    });

    db.prescriptions.belongsTo(db.doctors, {
      as: 'doctor',
      foreignKey: {
        name: 'doctorId',
      },
      constraints: false,
    });

    db.prescriptions.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.prescriptions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.prescriptions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return prescriptions;
};
