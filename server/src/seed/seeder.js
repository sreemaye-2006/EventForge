const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../../.env' });
const connectDB = require('../config/db');

// Models
const User = require('../models/User');
const Organization = require('../models/Organization');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Speaker = require('../models/Speaker');
const Session = require('../models/Session');
const Ticket = require('../models/Ticket');
const Registration = require('../models/Registration');
const Sponsor = require('../models/Sponsor');
const Announcement = require('../models/Announcement');
const Feedback = require('../models/Feedback');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing database...');
    await Promise.all([
      User.deleteMany(), Organization.deleteMany(), Event.deleteMany(),
      Venue.deleteMany(), Speaker.deleteMany(), Session.deleteMany(),
      Ticket.deleteMany(), Registration.deleteMany(), Sponsor.deleteMany(),
      Announcement.deleteMany(), Feedback.deleteMany()
    ]);

    const password = await bcrypt.hash('password123', 10);

    console.log('Creating Admin...');
    const admin = await User.create({
      name: 'Platform Admin', email: 'admin@eventforge.com', password, role: 'ADMIN'
    });

    console.log('Creating Organizations...');
    const org1 = await Organization.create({ name: 'TechEvents Inc', ownerId: admin._id, subscriptionPlan: 'ENTERPRISE' });
    const org2 = await Organization.create({ name: 'Global Conferences', ownerId: admin._id, subscriptionPlan: 'PRO' });

    console.log('Creating Organizers...');
    const org1User = await User.create({ name: 'Tech Organizer', email: 'organizer1@techevents.com', password, role: 'ORGANIZER', organizationId: org1._id });
    const org2User = await User.create({ name: 'Global Organizer', email: 'organizer2@globalconf.com', password, role: 'ORGANIZER', organizationId: org2._id });

    console.log('Creating Staff...');
    const staff1 = await User.create({ name: 'Staff One', email: 'staff1@techevents.com', password, role: 'STAFF', organizationId: org1._id });

    console.log('Creating Speakers...');
    const speakers = [];
    for (let i = 1; i <= 5; i++) {
      const sp = await User.create({ name: `Speaker ${i}`, email: `speaker${i}@tech.com`, password, role: 'SPEAKER' });
      const spProfile = await Speaker.create({ userId: sp._id, organizationId: org1._id, bio: `Expert ${i}`, designation: 'Senior Engineer', company: 'Tech Corp' });
      speakers.push(spProfile);
    }

    console.log('Creating Events...');
    const event1 = await Event.create({
      organizationId: org1._id, organizerId: org1User._id, title: 'AI Innovation Summit 2027', slug: 'ai-innovation-summit-2027',
      description: 'The premier AI event.', category: 'Technology', eventType: 'Conference',
      startDate: new Date('2027-10-01'), endDate: new Date('2027-10-03'), capacity: 1000, status: 'PUBLISHED'
    });

    console.log('Creating Venues...');
    const venue1 = await Venue.create({ organizationId: org1._id, eventId: event1._id, name: 'Main Hall', location: 'Convention Center', capacity: 500 });
    const venue2 = await Venue.create({ organizationId: org1._id, eventId: event1._id, name: 'Workshop Room A', location: 'Convention Center', capacity: 100 });

    console.log('Creating Sessions...');
    const session1 = await Session.create({
      eventId: event1._id, venueId: venue1._id, speakerIds: [speakers[0]._id, speakers[1]._id], title: 'Keynote: Future of AI',
      startTime: new Date('2027-10-01T09:00:00Z'), endTime: new Date('2027-10-01T10:00:00Z'), capacity: 500, status: 'SCHEDULED'
    });
    
    console.log('Creating Tickets...');
    const ticket1 = await Ticket.create({ eventId: event1._id, name: 'VIP Pass', price: 299, capacity: 100, status: 'ACTIVE' });
    const ticket2 = await Ticket.create({ eventId: event1._id, name: 'Standard Pass', price: 99, capacity: 900, status: 'ACTIVE' });

    console.log('Creating Attendees & Registrations...');
    for (let i = 1; i <= 20; i++) {
      const att = await User.create({ name: `Attendee ${i}`, email: `attendee${i}@mail.com`, password, role: 'ATTENDEE' });
      await Registration.create({
        eventId: event1._id, attendeeId: att._id, ticketTypeId: ticket2._id, registrationNumber: `REG-${1000+i}`,
        originalPrice: 99, finalPrice: 99, status: 'APPROVED', paymentStatus: 'PAID', qrCode: `qr-${att._id}`
      });
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
