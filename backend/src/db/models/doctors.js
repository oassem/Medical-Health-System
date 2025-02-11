const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const doctors = sequelize.define(
    'doctors',
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

      specialty: {
        type: DataTypes.TEXT,
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

  doctors.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.doctors.hasMany(db.appointments, {
      as: 'appointments_doctor',
      foreignKey: {
        name: 'doctorId',
      },
      constraints: false,
    });

    db.doctors.hasMany(db.billings, {
      as: 'billings_doctor',
      foreignKey: {
        name: 'doctorId',
      },
      constraints: false,
    });

    db.doctors.hasMany(db.patients, {
      as: 'patients_doctor',
      foreignKey: {
        name: 'doctorId',
      },
      constraints: false,
    });

    db.doctors.hasMany(db.prescriptions, {
      as: 'prescriptions_doctor',
      foreignKey: {
        name: 'doctorId',
      },
      constraints: false,
    });

    //end loop

    db.doctors.belongsTo(db.organizations, {
      as: 'organizations',
      foreignKey: {
        name: 'organizationsId',
      },
      constraints: false,
    });

    db.doctors.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.doctors.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return doctors;
};
