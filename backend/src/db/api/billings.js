const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class BillingsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const billings = await db.billings.create(
      {
        id: data.id || undefined,

        amount: data.totalAmount || null,
        billing_date: data.billing_date || null,
        status: data.status || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await billings.setPatient(data.patient || null, {
      transaction,
    });

    await billings.setDoctor(data.doctor || null, {
      transaction,
    });

    await billings.setOrganizations(data.organizations || null, {
      transaction,
    });

    return billings;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const billingsData = data.map((item, index) => ({
      id: item.id || undefined,

      amount: item.amount || null,
      billing_date: item.billing_date || null,
      status: item.status || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const billings = await db.billings.bulkCreate(billingsData, {
      transaction,
    });

    // For each item created, replace relation files

    return billings;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const billings = await db.billings.findByPk(id, {}, { transaction });

    await billings.update(
      {
        amount: data.amount || null,
        billing_date: data.billing_date || null,
        status: data.status || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await billings.setPatient(data.patient || null, {
      transaction,
    });

    await billings.setDoctor(data.doctor || null, {
      transaction,
    });

    await billings.setOrganizations(data.organizations || null, {
      transaction,
    });

    return billings;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const billings = await db.billings.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of billings) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of billings) {
        await record.destroy({ transaction });
      }
    });

    return billings;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const billings = await db.billings.findByPk(id, options);

    await billings.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await billings.destroy({
      transaction,
    });

    return billings;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const billings = await db.billings.findOne({ where }, { transaction });

    if (!billings) {
      return billings;
    }

    const output = billings.get({ plain: true });

    output.patient = await billings.getPatient({
      transaction,
    });

    output.doctor = await billings.getDoctor({
      transaction,
    });

    output.organizations = await billings.getOrganizations({
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

      if (filter.amountRange) {
        const [start, end] = filter.amountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            amount: {
              ...where.amount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.billing_dateRange) {
        const [start, end] = filter.billing_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            billing_date: {
              ...where.billing_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            billing_date: {
              ...where.billing_date,
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

      if (filter.status) {
        where = {
          ...where,
          status: filter.status,
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
      const { rows, count } = await db.billings.findAndCountAll(queryOptions);

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
          Utils.ilike('billings', 'amount', query),
        ],
      };
    }

    const records = await db.billings.findAll({
      attributes: ['id', 'amount'],
      where,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      orderBy: [['amount', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.amount,
    }));
  }
};
