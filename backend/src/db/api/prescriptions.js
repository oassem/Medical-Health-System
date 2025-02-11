const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PrescriptionsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const prescriptions = await db.prescriptions.create(
      {
        id: data.id || undefined,

        medication: data.medication || null,
        dosage: data.dosage || null,
        frequency: data.frequency || null,
        prescribed_date: data.prescribed_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await prescriptions.setPatient(data.patient || null, {
      transaction,
    });

    await prescriptions.setDoctor(data.doctor || null, {
      transaction,
    });

    await prescriptions.setOrganizations(data.organizations || null, {
      transaction,
    });

    return prescriptions;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const prescriptionsData = data.map((item, index) => ({
      id: item.id || undefined,

      medication: item.medication || null,
      dosage: item.dosage || null,
      frequency: item.frequency || null,
      prescribed_date: item.prescribed_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const prescriptions = await db.prescriptions.bulkCreate(prescriptionsData, {
      transaction,
    });

    // For each item created, replace relation files

    return prescriptions;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const prescriptions = await db.prescriptions.findByPk(
      id,
      {},
      { transaction },
    );

    await prescriptions.update(
      {
        medication: data.medication || null,
        dosage: data.dosage || null,
        frequency: data.frequency || null,
        prescribed_date: data.prescribed_date || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await prescriptions.setPatient(data.patient || null, {
      transaction,
    });

    await prescriptions.setDoctor(data.doctor || null, {
      transaction,
    });

    await prescriptions.setOrganizations(data.organizations || null, {
      transaction,
    });

    return prescriptions;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const prescriptions = await db.prescriptions.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of prescriptions) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of prescriptions) {
        await record.destroy({ transaction });
      }
    });

    return prescriptions;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const prescriptions = await db.prescriptions.findByPk(id, options);

    await prescriptions.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await prescriptions.destroy({
      transaction,
    });

    return prescriptions;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const prescriptions = await db.prescriptions.findOne(
      { where },
      { transaction },
    );

    if (!prescriptions) {
      return prescriptions;
    }

    const output = prescriptions.get({ plain: true });

    output.patient = await prescriptions.getPatient({
      transaction,
    });

    output.doctor = await prescriptions.getDoctor({
      transaction,
    });

    output.organizations = await prescriptions.getOrganizations({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    let where = {};
    const currentPage = +filter.page;

    const user = (options && options.currentUser) || null;
    const userOrganizations = (user && user.organizations?.id) || null;

    if (userOrganizations) {
      if (options?.currentUser?.organizationsId) {
        where.organizationsId = options.currentUser.organizationsId;
      }
    }

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;

    let include = [
      {
        model: db.patients,
        as: 'patient',

        where: filter.patient
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.patient
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  first_name: {
                    [Op.or]: filter.patient
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.doctors,
        as: 'doctor',

        where: filter.doctor
          ? {
              [Op.or]: [
                {
                  id: {
                    [Op.in]: filter.doctor
                      .split('|')
                      .map((term) => Utils.uuid(term)),
                  },
                },
                {
                  first_name: {
                    [Op.or]: filter.doctor
                      .split('|')
                      .map((term) => ({ [Op.iLike]: `%${term}%` })),
                  },
                },
              ],
            }
          : {},
      },

      {
        model: db.organizations,
        as: 'organizations',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.medication) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'prescriptions',
            'medication',
            filter.medication,
          ),
        };
      }

      if (filter.dosage) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('prescriptions', 'dosage', filter.dosage),
        };
      }

      if (filter.frequency) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('prescriptions', 'frequency', filter.frequency),
        };
      }

      if (filter.prescribed_dateRange) {
        const [start, end] = filter.prescribed_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            prescribed_date: {
              ...where.prescribed_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            prescribed_date: {
              ...where.prescribed_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.active !== undefined) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.organizations) {
        const listItems = filter.organizations.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationsId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    if (globalAccess) {
      delete where.organizationId;
    }

    const queryOptions = {
      where,
      include,
      distinct: true,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction: options?.transaction,
      logging: console.log,
    };

    if (!options?.countOnly) {
      queryOptions.limit = limit ? Number(limit) : undefined;
      queryOptions.offset = offset ? Number(offset) : undefined;
    }

    try {
      const { rows, count } = await db.prescriptions.findAndCountAll(
        queryOptions,
      );

      return {
        rows: options?.countOnly ? [] : rows,
        count: count,
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  static async findAllAutocomplete(
    query,
    limit,
    offset,
    globalAccess,
    organizationId,
  ) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('prescriptions', 'medication', query),
        ],
      };
    }

    const records = await db.prescriptions.findAll({
      attributes: ['id', 'medication'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['medication', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.medication,
    }));
  }
};
