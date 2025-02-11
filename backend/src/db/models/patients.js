const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const patients = sequelize.define(
    'patients',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      first_name: {
        type: DataTypes.TEXT,
      },

      last_name: {
        type: DataTypes.TEXT,
      },

      date_of_birth: {
        type: DataTypes.DATE,
      },

      email: {
        type: DataTypes.TEXT,
      },

      phone: {
        type: DataTypes.TEXT,
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

  patients.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.patients.hasMany(db.appointments, {
      as: 'appointments_patient',
      foreignKey: {
        name: 'patientId',
      },
      constraints: false,
    });

    db.patients.hasMany(db.billings, {
      as: 'billings_patient',
      foreignKey: {
        name: 'patientId',
      },
      constraints: false,
    });

    db.patients.hasMany(db.prescriptions, {
      as: 'prescriptions_patient',
      foreignKey: {
        name: 'patientId',
      },
      constraints: false,
    });

    //end loop

    db.patients.belongsTo(db.doctors, {
      as: 'doctor',
      foreignKey: {
        name: 'doctorId',
      },
      constraints: false,
    });

    db.patients.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.patients.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.patients.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return patients;
};
