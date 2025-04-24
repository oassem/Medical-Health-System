const db = require('../db/models');
const BillingsDBApi = require('../db/api/billings');
const processFile = require('../middlewares/upload');
const ValidationError = require('./notifications/errors/validation');
const csv = require('csv-parser');
const axios = require('axios');
const config = require('../config');
const stream = require('stream');
const { getPrescriptionsForPatient } = require('./prescriptions.js');

module.exports = class BillingsService {
  static async create(data, currentUser) {
  const transaction = await db.sequelize.transaction();
  try {
    // If patientId is provided, fetch prescriptions and calculate total prescription cost
    if (currentUser.id) {
      const prescriptions = await getPrescriptionsForPatient(currentUser.id);
      let prescriptionTotal = 0;
      // Sum the amounts from each prescription
      prescriptions.forEach(prescription => {
        if (prescription.amount) {
          prescriptionTotal += Number(prescription.amount);
        }
      });

      // Get the original bill amount (if available) and calculate total amount
      const originalBillAmount = data.amount ? Number(data.amount) : 0;
      data.totalAmount = originalBillAmount + prescriptionTotal;
    }

    const createdBilling = await BillingsDBApi.create(data, {
      currentUser,
      transaction,
    });

    await transaction.commit();
    return createdBilling;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

  static async bulkImport(req, res, sendInvitationEmails = true, host) {
    const transaction = await db.sequelize.transaction();

    try {
      await processFile(req, res);
      const bufferStream = new stream.PassThrough();
      const results = [];

      await bufferStream.end(Buffer.from(req.file.buffer, 'utf-8')); // convert Buffer to Stream

      await new Promise((resolve, reject) => {
        bufferStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', async () => {
            console.log('CSV results', results);
            resolve();
          })
          .on('error', (error) => reject(error));
      });

      await BillingsDBApi.bulkImport(results, {
        transaction,
        ignoreDuplicates: true,
        validate: true,
        currentUser: req.currentUser,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let billings = await BillingsDBApi.findBy({ id }, { transaction });

      if (!billings) {
        throw new ValidationError('billingsNotFound');
      }

      const updatedBillings = await BillingsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return updatedBillings;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deleteByIds(ids, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await BillingsDBApi.deleteByIds(ids, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await BillingsDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
