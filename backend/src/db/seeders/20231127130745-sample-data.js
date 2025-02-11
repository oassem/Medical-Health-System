const db = require('../models');
const Users = db.users;

const Appointments = db.appointments;

const Billings = db.billings;

const Doctors = db.doctors;

const Patients = db.patients;

const Prescriptions = db.prescriptions;

const Organizations = db.organizations;

const AppointmentsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    start_time: new Date('2024-05-04'),

    end_time: new Date('2024-03-01'),

    status: 'Cancelled',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    start_time: new Date('2024-11-05'),

    end_time: new Date('2024-07-29'),

    status: 'Completed',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    start_time: new Date('2025-01-02'),

    end_time: new Date('2024-09-13'),

    status: 'Completed',

    // type code here for "relation_one" field
  },
];

const BillingsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    amount: 19.85,

    billing_date: new Date('2024-08-06'),

    status: 'Overdue',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    amount: 78.02,

    billing_date: new Date('2024-10-28'),

    status: 'Overdue',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    amount: 80.44,

    billing_date: new Date('2025-02-03'),

    status: 'Pending',

    // type code here for "relation_one" field
  },
];

const DoctorsData = [
  {
    first_name: 'No one tells me shit',

    last_name: 'That damn Bill Stull',

    specialty: "Y'all never listen to me",

    email: 'matt@howe-spinka.info',

    phone: '250.221.9493 x64579',

    // type code here for "relation_one" field
  },

  {
    first_name: 'I got that scurvy',

    last_name: 'I tell you what',

    specialty: 'That damn diabetes',

    email: 'malisa@senger-huel.co',

    phone: '(314) 617-7444',

    // type code here for "relation_one" field
  },

  {
    first_name: 'Reminds me of my old girlfriend Olga Goodntight',

    last_name: 'That damn Bill Stull',

    specialty: 'Like a red-headed stepchild',

    email: 'thaddeus@reichert-price.io',

    phone: '117-832-4767 x4585',

    // type code here for "relation_one" field
  },
];

const PatientsData = [
  {
    first_name: "Y'all never listen to me",

    last_name: 'My buddy Harlen',

    date_of_birth: new Date('2024-10-12'),

    email: 'twyla.stark@konopelski.name',

    phone: '(394) 796-1808 x900',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    first_name: 'Reminds me of my old girlfriend Olga Goodntight',

    last_name: 'My boss gonna fire me',

    date_of_birth: new Date('2024-04-01'),

    email: 'randy.skiles@yost.co',

    phone: '1-292-113-8907 x92293',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    first_name: 'That damn Bill Stull',

    last_name: 'I got that scurvy',

    date_of_birth: new Date('2024-08-31'),

    email: 'adan@blick-lakin.info',

    phone: '1-194-947-7868 x0973',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const PrescriptionsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    medication: 'Yup',

    dosage: 'Come on now',

    frequency: 'My buddy Harlen',

    prescribed_date: new Date('2025-01-30'),

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    medication: 'No one tells me shit',

    dosage: "Y'all never listen to me",

    frequency: "Goin' hog huntin'",

    prescribed_date: new Date('2024-08-09'),

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    medication: 'I want my damn cart back',

    dosage: 'Contact the tower',

    frequency: 'Let me tell ya',

    prescribed_date: new Date('2024-05-20'),

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Willard Libby',
  },

  {
    name: 'Christiaan Huygens',
  },

  {
    name: 'Jean Piaget',
  },
];

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }
}

// Similar logic for "relation_many"

async function associateAppointmentWithPatient() {
  const relatedPatient0 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Appointment0 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Appointment0?.setPatient) {
    await Appointment0.setPatient(relatedPatient0);
  }

  const relatedPatient1 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Appointment1 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Appointment1?.setPatient) {
    await Appointment1.setPatient(relatedPatient1);
  }

  const relatedPatient2 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Appointment2 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Appointment2?.setPatient) {
    await Appointment2.setPatient(relatedPatient2);
  }
}

async function associateAppointmentWithDoctor() {
  const relatedDoctor0 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Appointment0 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Appointment0?.setDoctor) {
    await Appointment0.setDoctor(relatedDoctor0);
  }

  const relatedDoctor1 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Appointment1 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Appointment1?.setDoctor) {
    await Appointment1.setDoctor(relatedDoctor1);
  }

  const relatedDoctor2 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Appointment2 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Appointment2?.setDoctor) {
    await Appointment2.setDoctor(relatedDoctor2);
  }
}

async function associateAppointmentWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Appointment0 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Appointment0?.setOrganization) {
    await Appointment0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Appointment1 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Appointment1?.setOrganization) {
    await Appointment1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Appointment2 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Appointment2?.setOrganization) {
    await Appointment2.setOrganization(relatedOrganization2);
  }
}

async function associateBillingWithPatient() {
  const relatedPatient0 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Billing0 = await Billings.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Billing0?.setPatient) {
    await Billing0.setPatient(relatedPatient0);
  }

  const relatedPatient1 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Billing1 = await Billings.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Billing1?.setPatient) {
    await Billing1.setPatient(relatedPatient1);
  }

  const relatedPatient2 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Billing2 = await Billings.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Billing2?.setPatient) {
    await Billing2.setPatient(relatedPatient2);
  }
}

async function associateBillingWithDoctor() {
  const relatedDoctor0 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Billing0 = await Billings.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Billing0?.setDoctor) {
    await Billing0.setDoctor(relatedDoctor0);
  }

  const relatedDoctor1 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Billing1 = await Billings.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Billing1?.setDoctor) {
    await Billing1.setDoctor(relatedDoctor1);
  }

  const relatedDoctor2 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Billing2 = await Billings.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Billing2?.setDoctor) {
    await Billing2.setDoctor(relatedDoctor2);
  }
}

async function associateBillingWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Billing0 = await Billings.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Billing0?.setOrganization) {
    await Billing0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Billing1 = await Billings.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Billing1?.setOrganization) {
    await Billing1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Billing2 = await Billings.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Billing2?.setOrganization) {
    await Billing2.setOrganization(relatedOrganization2);
  }
}

async function associateDoctorWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Doctor0 = await Doctors.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Doctor0?.setOrganization) {
    await Doctor0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Doctor1 = await Doctors.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Doctor1?.setOrganization) {
    await Doctor1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Doctor2 = await Doctors.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Doctor2?.setOrganization) {
    await Doctor2.setOrganization(relatedOrganization2);
  }
}

async function associatePatientWithDoctor() {
  const relatedDoctor0 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Patient0 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Patient0?.setDoctor) {
    await Patient0.setDoctor(relatedDoctor0);
  }

  const relatedDoctor1 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Patient1 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Patient1?.setDoctor) {
    await Patient1.setDoctor(relatedDoctor1);
  }

  const relatedDoctor2 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Patient2 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Patient2?.setDoctor) {
    await Patient2.setDoctor(relatedDoctor2);
  }
}

async function associatePatientWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Patient0 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Patient0?.setOrganization) {
    await Patient0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Patient1 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Patient1?.setOrganization) {
    await Patient1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Patient2 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Patient2?.setOrganization) {
    await Patient2.setOrganization(relatedOrganization2);
  }
}

async function associatePrescriptionWithPatient() {
  const relatedPatient0 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Prescription0 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Prescription0?.setPatient) {
    await Prescription0.setPatient(relatedPatient0);
  }

  const relatedPatient1 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Prescription1 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Prescription1?.setPatient) {
    await Prescription1.setPatient(relatedPatient1);
  }

  const relatedPatient2 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Prescription2 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Prescription2?.setPatient) {
    await Prescription2.setPatient(relatedPatient2);
  }
}

async function associatePrescriptionWithDoctor() {
  const relatedDoctor0 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Prescription0 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Prescription0?.setDoctor) {
    await Prescription0.setDoctor(relatedDoctor0);
  }

  const relatedDoctor1 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Prescription1 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Prescription1?.setDoctor) {
    await Prescription1.setDoctor(relatedDoctor1);
  }

  const relatedDoctor2 = await Doctors.findOne({
    offset: Math.floor(Math.random() * (await Doctors.count())),
  });
  const Prescription2 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Prescription2?.setDoctor) {
    await Prescription2.setDoctor(relatedDoctor2);
  }
}

async function associatePrescriptionWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Prescription0 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Prescription0?.setOrganization) {
    await Prescription0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Prescription1 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Prescription1?.setOrganization) {
    await Prescription1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Prescription2 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Prescription2?.setOrganization) {
    await Prescription2.setOrganization(relatedOrganization2);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Appointments.bulkCreate(AppointmentsData);

    await Billings.bulkCreate(BillingsData);

    await Doctors.bulkCreate(DoctorsData);

    await Patients.bulkCreate(PatientsData);

    await Prescriptions.bulkCreate(PrescriptionsData);

    await Organizations.bulkCreate(OrganizationsData);

    await Promise.all([
      await associateUserWithOrganization(),

      // Similar logic for "relation_many"

      await associateAppointmentWithPatient(),

      await associateAppointmentWithDoctor(),

      await associateAppointmentWithOrganization(),

      await associateBillingWithPatient(),

      await associateBillingWithDoctor(),

      await associateBillingWithOrganization(),

      await associateDoctorWithOrganization(),

      await associatePatientWithDoctor(),

      await associatePatientWithOrganization(),

      await associatePrescriptionWithPatient(),

      await associatePrescriptionWithDoctor(),

      await associatePrescriptionWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('appointments', null, {});

    await queryInterface.bulkDelete('billings', null, {});

    await queryInterface.bulkDelete('doctors', null, {});

    await queryInterface.bulkDelete('patients', null, {});

    await queryInterface.bulkDelete('prescriptions', null, {});

    await queryInterface.bulkDelete('organizations', null, {});
  },
};
