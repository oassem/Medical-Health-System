const db = require('../db/models');
const PrescriptionsDBApi = require('../db/api/prescriptions');
const processFile = require('../middlewares/upload');
const ValidationError = require('./notifications/errors/validation');
const csv = require('csv-parser');
const axios = require('axios');
const config = require('../config');
const stream = require('stream');

module.exports = class PrescriptionsService {
   static async create(data, currentUser) {
      const transaction = await db.sequelize.transaction();
      try {
         await PrescriptionsDBApi.create(data, {
            currentUser,
            transaction,
         });

         await transaction.commit();
      } catch (error) {
         await transaction.rollback();
         throw error;
      }
   }

   static async getPrescriptionsForPatient(patientId) {
      const transaction = await db.sequelize.transaction();
      try {
         const prescriptions = await db.prescriptions.findAll({
            where: {
               patientId: patientId,
            },
            transaction,
         });
         return prescriptions;
      } catch (error) {
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

         await PrescriptionsDBApi.bulkImport(results, {
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
         let prescriptions = await PrescriptionsDBApi.findBy({
            id
         }, {
            transaction
         }, );

         if (!prescriptions) {
            throw new ValidationError('prescriptionsNotFound');
         }

         const updatedPrescriptions = await PrescriptionsDBApi.update(id, data, {
            currentUser,
            transaction,
         });

         await transaction.commit();
         return updatedPrescriptions;
      } catch (error) {
         await transaction.rollback();
         throw error;
      }
   }

   static async deleteByIds(ids, currentUser) {
      const transaction = await db.sequelize.transaction();

      try {
         await PrescriptionsDBApi.deleteByIds(ids, {
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
         await PrescriptionsDBApi.remove(id, {
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
