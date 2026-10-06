const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
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
const Coupon = require('../models/Coupon');
const Sponsor = require('../models/Sponsor');
const Package = require('../models/Package');
const Deliverable = require('../models/Deliverable');
const Announcement = require('../models/Announcement');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const SessionAttendance = require('../models/SessionAttendance');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing database collections...');
    await Promise.all([
      User.deleteMany(), Organization.deleteMany(), Event.deleteMany(),
      Venue.deleteMany(), Speaker.deleteMany(), Session.deleteMany(),
      Ticket.deleteMany(), Registration.deleteMany(), Coupon.deleteMany(),
      Sponsor.deleteMany(), Package.deleteMany(), Deliverable.deleteMany(),
      Announcement.deleteMany(), Feedback.deleteMany(), Notification.deleteMany(),
      SessionAttendance.deleteMany()
    ]);

    const password = 'password123';

    console.log('1. Creating Admin User...');
    const adminUser = await User.create({
      name: 'Platform Admin',
      email: 'admin@example.com',
      password,
      role: 'ADMIN',
      isActive: true
    });
    await User.create({
      name: 'Admin EventForge',
      email: 'admin@eventforge.com',
      password,
      role: 'ADMIN',
      isActive: true
    });

    console.log('2. Creating Organizations...');
    const org1 = await Organization.create({
      name: 'TechEvents Global Inc',
      description: 'Global enterprise conference organizers & technology summit leaders.',
      ownerId: adminUser._id,
      subscriptionPlan: 'ENTERPRISE',
      isActive: true
    });

    const org2 = await Organization.create({
      name: 'CloudNative Summits LLC',
      description: 'Specialists in DevOps, Kubernetes, and Distributed Infrastructure expos.',
      ownerId: adminUser._id,
      subscriptionPlan: 'PRO',
      isActive: true
    });

    const org3 = await Organization.create({
      name: 'Apex Innovation Network',
      description: 'FinTech, Web3, and Emerging Tech Forums worldwide.',
      ownerId: adminUser._id,
      subscriptionPlan: 'ENTERPRISE',
      isActive: true
    });

    console.log('3. Creating Standard Role Accounts...');

    const organizerUser = await User.create({
      name: 'Sarah Mitchell (Organizer)',
      email: 'organizer@example.com',
      password,
      role: 'ORGANIZER',
      organizationId: org1._id,
      isActive: true
    });
    const organizerUser2 = await User.create({
      name: 'David Vance',
      email: 'organizer1@techevents.com',
      password,
      role: 'ORGANIZER',
      organizationId: org1._id,
      isActive: true
    });

    const staffUser = await User.create({
      name: 'Alex Rivera (Staff)',
      email: 'staff@example.com',
      password,
      role: 'STAFF',
      organizationId: org1._id,
      isActive: true
    });
    await User.create({
      name: 'Staff Lead',
      email: 'staff1@techevents.com',
      password,
      role: 'STAFF',
      organizationId: org1._id,
      isActive: true
    });

    const speakerUser = await User.create({
      name: 'Dr. Evelyn Reed',
      email: 'speaker@example.com',
      password,
      role: 'SPEAKER',
      organizationId: org1._id,
      interests: ['AI', 'Deep Learning', 'Autonomous Agents'],
      isActive: true
    });

    const sponsorUser = await User.create({
      name: 'Marcus Sterling (Sponsor Rep)',
      email: 'sponsor@example.com',
      password,
      role: 'SPONSOR',
      organizationId: org1._id,
      isActive: true
    });
    await User.create({
      name: 'Sponsor Lead',
      email: 'sponsor@eventforge.com',
      password,
      role: 'SPONSOR',
      organizationId: org1._id,
      isActive: true
    });

    const attendeeUser = await User.create({
      name: 'Jordan Lee (Attendee)',
      email: 'attendee@example.com',
      password,
      role: 'ATTENDEE',
      interests: ['AI', 'Cloud Computing', 'Web Development'],
      isActive: true
    });
    await User.create({
      name: 'Demo Attendee',
      email: 'attendee@eventforge.com',
      password,
      role: 'ATTENDEE',
      interests: ['AI', 'Cybersecurity', 'FinTech'],
      isActive: true
    });

    console.log('3. Creating Additional Speakers...');
    const speakerData = [
      { name: 'Dr. Evelyn Reed', user: speakerUser, bio: 'Principal AI Scientist & pioneer in autonomous multi-agent reasoning models.', designation: 'Chief AI Architect', company: 'NeuralForge Labs', expertise: ['AI', 'LLMs', 'Machine Learning'] },
      { name: 'Kavita Rao', email: 'kavita@cloudnative.io', bio: 'Kubernetes contributor, service mesh pioneer, and author of Scalable Cloud Native Systems.', designation: 'VP of Cloud Infrastructure', company: 'Google Cloud Platform', expertise: ['Cloud Computing', 'Kubernetes', 'DevOps'] },
      { name: 'Liam O\'Connor', email: 'liam@securenets.dev', bio: 'Global authority on zero-trust cybersecurity architectures and quantum-safe cryptography.', designation: 'Chief Information Security Officer', company: 'CyberShield Systems', expertise: ['Cybersecurity', 'Zero Trust', 'Cryptography'] },
      { name: 'Zack Chen', email: 'zack@reactflow.org', bio: 'Frontend architect and React core educator specializing in high-performance web applications.', designation: 'Distinguished Engineer', company: 'Meta Ecosystems', expertise: ['Web Development', 'React', 'TypeScript'] }
    ];

    const speakerProfiles = [];
    for (const sp of speakerData) {
      let u = sp.user;
      if (!u) {
        u = await User.create({ name: sp.name, email: sp.email, password, role: 'SPEAKER', organizationId: org1._id });
      }
      const profile = await Speaker.create({
        userId: u._id,
        organizationId: org1._id,
        bio: sp.bio,
        designation: sp.designation,
        company: sp.company,
        expertise: sp.expertise
      });
      speakerProfiles.push({ user: u, profile });
    }

    console.log('4. Creating Venues & Rooms...');
    const venue1 = await Venue.create({
      organizationId: org1._id,
      name: 'Metropolitan Tech Center',
      address: '750 Innovation Way, Suite 100',
      city: 'San Francisco, CA',
      capacity: 2500,
      facilities: ['High-Speed WiFi 6E', '4K Laser Projectors', 'Simultaneous Translation', 'Wheelchair Accessible', 'VIP Greenrooms', 'Executive Catering'],
      rooms: [
        { name: 'Grand Ballroom A', capacity: 1200 },
        { name: 'Quantum Theater 1', capacity: 600 },
        { name: 'Cyber Lab B', capacity: 350 },
        { name: 'Executive Suite 3', capacity: 150 }
      ]
    });

    const venue2 = await Venue.create({
      organizationId: org1._id,
      name: 'Austin Innovation Center',
      address: '400 Silicon Corridor',
      city: 'Austin, TX',
      capacity: 1200,
      facilities: ['WiFi', 'Surround Audio', 'Stage Rigging', 'Livestream Studios'],
      rooms: [
        { name: 'Main Auditorium', capacity: 800 },
        { name: 'Workshop Room 1', capacity: 200 }
      ]
    });

    console.log('5. Creating Flagship Demo Event: TechNova Global Innovation Summit 2026...');
    const now = new Date();
    const event1Start = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    event1Start.setHours(9, 0, 0, 0);
    const event1End = new Date(event1Start.getTime() + 3 * 24 * 60 * 60 * 1000);

    const event1 = await Event.create({
      organizationId: org1._id,
      organizerId: organizerUser._id,
      title: 'TechNova Global Innovation Summit 2026',
      slug: 'technova-global-innovation-summit-2026',
      description: 'The world\'s flagship conference for enterprise AI architecture, resilient distributed cloud systems, high-speed cybersecurity, and next-generation engineering leadership. Connect with 2,000+ industry pioneers for 3 intensive days of visionary keynotes, hands-on masterclasses, and executive networking.',
      shortDescription: 'The premier global summit uniting enterprise AI pioneers, cloud architects, and security leaders.',
      category: 'Technology',
      eventType: 'Conference',
      startDate: event1Start,
      endDate: event1End,
      registrationStart: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      registrationEnd: new Date(event1Start.getTime() + 12 * 60 * 60 * 1000),
      venueId: venue1._id,
      capacity: 1500,
      status: 'PUBLISHED',
      isPublic: true,
      tags: ['AI', 'Cloud', 'Cybersecurity', 'Web Development', 'Leadership'],
      staffIds: [staffUser._id]
    });

    // Event 2: Cloud Workshop
    const event2Start = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000);
    const event2 = await Event.create({
      organizationId: org1._id,
      organizerId: organizerUser._id,
      title: 'Cloud & Distributed Systems Masterclass',
      slug: 'cloud-distributed-systems-masterclass-2026',
      description: 'Intensive deep-dive into Kubernetes at enterprise scale, zero-trust service meshes, and resilient geo-distributed microservices.',
      shortDescription: 'Master Kubernetes orchestration, microservices resilience, and zero-trust cloud infrastructure.',
      category: 'Technology',
      eventType: 'Workshop',
      startDate: event2Start,
      endDate: new Date(event2Start.getTime() + 2 * 24 * 60 * 60 * 1000),
      venueId: venue2._id,
      capacity: 400,
      status: 'PUBLISHED',
      isPublic: true,
      tags: ['Cloud Computing', 'DevOps', 'Kubernetes'],
      staffIds: [staffUser._id]
    });

    // Event 3: FinTech Forum
    const event3Start = new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000);
    const event3 = await Event.create({
      organizationId: org3._id,
      organizerId: organizerUser._id,
      title: 'Global FinTech & Security Summit',
      slug: 'global-fintech-security-summit-2026',
      description: 'Explore high-throughput algorithmic settlement, open banking APIs, compliance automation, and fraud defense with global financial innovators.',
      shortDescription: 'Connecting FinTech innovators, security architects, and banking executives.',
      category: 'Finance',
      eventType: 'Conference',
      startDate: event3Start,
      endDate: new Date(event3Start.getTime() + 2 * 24 * 60 * 60 * 1000),
      venueId: venue1._id,
      capacity: 800,
      status: 'PUBLISHED',
      isPublic: true,
      tags: ['Finance', 'Cybersecurity', 'FinTech']
    });

    // Event 4: Executive AI Forum
    const event4Start = new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000);
    const event4 = await Event.create({
      organizationId: org2._id,
      organizerId: organizerUser2._id,
      title: 'AI Leadership & Enterprise Governance Forum',
      slug: 'ai-leadership-enterprise-governance-forum',
      description: 'Strategic C-level summit focusing on AI regulatory frameworks, enterprise ROI, sovereign models, and ethical AI deployment.',
      shortDescription: 'C-suite summit for generative AI roadmap strategy and governance.',
      category: 'Business',
      eventType: 'Seminar',
      startDate: event4Start,
      endDate: new Date(event4Start.getTime() + 1 * 24 * 60 * 60 * 1000),
      venueId: venue2._id,
      capacity: 300,
      status: 'PUBLISHED',
      isPublic: true,
      tags: ['AI', 'Leadership', 'Business']
    });

    console.log('6. Creating Conference Sessions for Flagship Event...');
    const day1 = event1Start.getTime();

    // Session 1: Flagship Keynote
    const s1 = await Session.create({
      eventId: event1._id,
      venueId: venue1._id,
      room: 'Grand Ballroom A',
      track: 'AI & Future of Compute',
      category: 'AI',
      speakerIds: [speakerProfiles[0].profile._id],
      title: 'Keynote: Autonomous Multi-Agent Architectures & Real-World Reasoning',
      description: 'Dr. Evelyn Reed reveals breakthroughs in agentic systems, self-healing software pipelines, and next-generation inference models running at global scale.',
      startTime: new Date(day1 + 9 * 60 * 60 * 1000), // 9:00 AM
      endTime: new Date(day1 + 10.5 * 60 * 60 * 1000), // 10:30 AM
      capacity: 1200,
      status: 'SCHEDULED',
      tags: ['AI', 'Autonomous Agents', 'Keynote']
    });

    // Session 2: Cloud Track
    const s2 = await Session.create({
      eventId: event1._id,
      venueId: venue1._id,
      room: 'Quantum Theater 1',
      track: 'Cloud & Infrastructure',
      category: 'Cloud Computing',
      speakerIds: [speakerProfiles[1].profile._id],
      title: 'Zero-Downtime Distributed Mesh at 100M Requests/Second',
      description: 'Kavita Rao breaks down battle-tested architectures for multi-region Kubernetes clusters, global traffic orchestration, and sub-millisecond failovers.',
      startTime: new Date(day1 + 11 * 60 * 60 * 1000), // 11:00 AM
      endTime: new Date(day1 + 12.5 * 60 * 60 * 1000), // 12:30 PM
      capacity: 600,
      status: 'SCHEDULED',
      tags: ['Cloud Computing', 'Kubernetes', 'Scalability']
    });

    // Session 3: Cybersecurity Track
    const s3 = await Session.create({
      eventId: event1._id,
      venueId: venue1._id,
      room: 'Cyber Lab B',
      track: 'Cybersecurity & Defense',
      category: 'Cybersecurity',
      speakerIds: [speakerProfiles[2].profile._id],
      title: 'Zero-Trust Architecture & Defending Against Weaponized LLMs',
      description: 'Liam O\'Connor conducts a live simulation demonstrating how to harden API gateways, prevent prompt injection vectors, and enforce quantum-resistant identity verification.',
      startTime: new Date(day1 + 14 * 60 * 60 * 1000), // 2:00 PM
      endTime: new Date(day1 + 15.5 * 60 * 60 * 1000), // 3:30 PM
      capacity: 350,
      status: 'SCHEDULED',
      tags: ['Cybersecurity', 'Zero Trust', 'Defense']
    });

    // Session 4: Web & UX Architecture
    const s4 = await Session.create({
      eventId: event1._id,
      venueId: venue1._id,
      room: 'Grand Ballroom A',
      track: 'Modern Web Engineering',
      category: 'Web Development',
      speakerIds: [speakerProfiles[3].profile._id],
      title: 'Ultra-Responsive Web Apps: Streaming SSR, RSC & Concurrent React',
      description: 'Zack Chen dives into cutting edge rendering optimizations, eliminating client latency, and architecting stateful reactive dashboards that feel instant.',
      startTime: new Date(day1 + 16 * 60 * 60 * 1000), // 4:00 PM
      endTime: new Date(day1 + 17.5 * 60 * 60 * 1000), // 5:30 PM
      capacity: 1000,
      status: 'SCHEDULED',
      tags: ['Web Development', 'React', 'Frontend Performance']
    });

    console.log('7. Creating Sponsorship Packages & Sponsors...');
    const pPlatinum = await Package.create({
      eventId: event1._id,
      name: 'Platinum Tier Partnership',
      tier: 'PLATINUM',
      price: 25000,
      benefits: ['Premium 20x20 Main Floor Booth', 'Flagship Keynote Speaking Slot', 'VIP Executive Lounge Naming', 'Unlimited Full-Access Passes', 'Digital Brand Banner on EventForge'],
      availableSlots: 2,
      allocatedSlots: 1
    });

    const pGold = await Package.create({
      eventId: event1._id,
      name: 'Gold Tier Partnership',
      tier: 'GOLD',
      price: 12000,
      benefits: ['10x10 Exhibition Booth', 'Session Intro Remarks', '5 Full-Access VIP Passes', 'Logo on all printed and digital badges'],
      availableSlots: 5,
      allocatedSlots: 1
    });

    const pSilver = await Package.create({
      eventId: event1._id,
      name: 'Silver Tier Partnership',
      tier: 'SILVER',
      price: 6000,
      benefits: ['Branded Lounge Kiosk', 'Logo on Website & Mobile Passes', '2 All-Access Passes'],
      availableSlots: 10,
      allocatedSlots: 0
    });

    const sponsor1 = await Sponsor.create({
      eventId: event1._id,
      organizationId: org1._id,
      userId: sponsorUser._id,
      companyName: 'Google Cloud & AI',
      description: 'Global cloud infrastructure, AI Gemini platform, and Kubernetes ecosystem.',
      email: 'partnerships@google.com',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=400',
      website: 'https://cloud.google.com',
      contactPerson: 'Marcus Sterling',
      phone: '+1 (415) 555-0199',
      packageId: pPlatinum._id,
      status: 'ACTIVE',
      brandAssets: ['https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800']
    });

    const sponsor2 = await Sponsor.create({
      eventId: event1._id,
      organizationId: org1._id,
      userId: sponsorUser._id,
      companyName: 'NeuralForge AI Systems',
      description: 'Enterprise reasoning agents and autonomous foundation infrastructure.',
      email: 'sponsor@eventforge.com',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
      website: 'https://neuralforge.ai',
      contactPerson: 'Elena Rostova',
      packageId: pGold._id,
      status: 'ACTIVE',
      brandAssets: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800']
    });

    // Deliverables for Sponsors
    await Deliverable.create({
      eventId: event1._id,
      sponsorId: sponsor1._id,
      title: 'High-Resolution Vector Logo Submission',
      description: 'Submit SVG/PNG logo for stage backdrops and digital pass banners.',
      status: 'COMPLETED',
      dueDate: new Date(day1 - 5 * 24 * 60 * 60 * 1000)
    });
    await Deliverable.create({
      eventId: event1._id,
      sponsorId: sponsor1._id,
      title: 'Exhibition Booth Equipment & Power Requirements',
      description: 'Submit layout specifications and electrical needs for 20x20 booth.',
      status: 'IN_PROGRESS',
      dueDate: new Date(day1 - 2 * 24 * 60 * 60 * 1000)
    });
    await Deliverable.create({
      eventId: event1._id,
      sponsorId: sponsor1._id,
      title: 'Keynote Speaker Presentation Slides',
      description: '16:9 format presentation deck review with stage AV crew.',
      status: 'PENDING',
      dueDate: new Date(day1 - 1 * 24 * 60 * 60 * 1000)
    });

    console.log('8. Creating Ticket Categories & Coupons...');
    const tEarly = await Ticket.create({
      eventId: event1._id,
      name: 'Early Bird Pass',
      price: 99,
      capacity: 300,
      description: 'All-access pass with standard access to keynotes, tracks, and exhibition halls.',
      status: 'ACTIVE'
    });

    const tVIP = await Ticket.create({
      eventId: event1._id,
      name: 'VIP Executive Pass',
      price: 299,
      capacity: 150,
      description: 'Includes reserved front-row seating, private VIP networking lounge, catered lunch, and speaker reception.',
      status: 'ACTIVE'
    });

    const tRegular = await Ticket.create({
      eventId: event1._id,
      name: 'Standard Conference Pass',
      price: 199,
      capacity: 500,
      description: 'Standard 3-day access pass for all conference tracks and workshops.',
      status: 'ACTIVE'
    });

    const tStudent = await Ticket.create({
      eventId: event1._id,
      name: 'Student & Academic Pass',
      price: 49,
      capacity: 100,
      description: 'Discounted student pass with valid university ID verification.',
      status: 'ACTIVE'
    });

    // Coupons
    const couponExpiry = new Date(day1 + 3 * 24 * 60 * 60 * 1000);
    await Coupon.create({
      eventId: event1._id,
      code: 'TECH2026',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      maxUses: 200,
      usedCount: 14,
      expiryDate: couponExpiry,
      active: true
    });

    await Coupon.create({
      eventId: event1._id,
      code: 'EARLY50',
      discountType: 'FIXED',
      discountValue: 50,
      maxUses: 100,
      usedCount: 8,
      expiryDate: couponExpiry,
      active: true
    });

    console.log('9. Creating Attendees & Real Registrations with QR codes...');
    const attendeeUsers = [attendeeUser];
    const demoNames = [
      'Samantha Blake', 'Michael Zhang', 'Carlos Diaz', 'Ananya Patel',
      'Emma Watson', 'James Thorne', 'Amina Yusuf', 'Lucas Becker',
      'Priya Sharma', 'Daniel Craig', 'Rachel Vance', 'Kenji Sato',
      'Chloe Martin', 'David Miller', 'Fatima Zahra', 'Oliver King'
    ];

    for (let i = 0; i < demoNames.length; i++) {
      const u = await User.create({
        name: demoNames[i],
        email: `attendee_${i + 1}@eventforge.com`,
        password,
        role: 'ATTENDEE',
        interests: i % 2 === 0 ? ['AI', 'Cloud Computing'] : ['Cybersecurity', 'Web Development']
      });
      attendeeUsers.push(u);
    }

    // Registrations for event1
    for (let i = 0; i < attendeeUsers.length; i++) {
      const u = attendeeUsers[i];
      const isCheckedIn = i < 6;
      const isWaitlisted = i === attendeeUsers.length - 1;
      const ticketType = i % 3 === 0 ? tVIP : (i % 2 === 0 ? tEarly : tRegular);

      const reg = await Registration.create({
        eventId: event1._id,
        attendeeId: u._id,
        ticketTypeId: ticketType._id,
        registrationNumber: `REG-2026-${10000 + i}`,
        originalPrice: ticketType.price,
        discount: i % 4 === 0 ? 20 : 0,
        finalPrice: i % 4 === 0 ? Math.max(0, ticketType.price - 20) : ticketType.price,
        couponCode: i % 4 === 0 ? 'TECH2026' : '',
        status: isWaitlisted ? 'WAITLISTED' : (isCheckedIn ? 'CHECKED_IN' : 'APPROVED'),
        paymentStatus: 'PAID',
        checkedInAt: isCheckedIn ? new Date(day1 + 8.5 * 60 * 60 * 1000 + i * 15 * 60 * 1000) : null,
        qrCode: `qr-${u._id}-${event1._id}`,
        qrData: JSON.stringify({ registrationId: `REG-2026-${10000 + i}`, eventId: event1._id, attendeeId: u._id })
      });

      // Session attendance for checked-in attendees
      if (isCheckedIn) {
        await SessionAttendance.create({
          registrationId: reg._id,
          sessionId: s1._id,
          attendeeId: u._id,
          eventId: event1._id,
          checkedInAt: new Date(day1 + 9 * 60 * 60 * 1000 + i * 5 * 60 * 1000),
          checkedInBy: staffUser._id
        });
      }
    }

    // Also register attendeeUser for event2
    await Registration.create({
      eventId: event2._id,
      attendeeId: attendeeUser._id,
      ticketTypeId: tRegular._id,
      registrationNumber: 'REG-2026-9999',
      originalPrice: 199,
      finalPrice: 199,
      status: 'APPROVED',
      paymentStatus: 'PAID',
      qrCode: `qr-${attendeeUser._id}-${event2._id}`,
      qrData: JSON.stringify({ registrationId: 'REG-2026-9999', eventId: event2._id, attendeeId: attendeeUser._id })
    });

    console.log('10. Creating Feedback Ratings...');
    await Feedback.create({
      eventId: event1._id,
      sessionId: s1._id,
      attendeeId: attendeeUsers[1]._id,
      rating: 5,
      comment: 'Incredible keynote! The insights on multi-agent software development blew me away.',
      category: 'Keynote'
    });
    await Feedback.create({
      eventId: event1._id,
      sessionId: s1._id,
      attendeeId: attendeeUsers[2]._id,
      rating: 5,
      comment: 'Outstanding presentation clarity and visionary live demonstrations.',
      category: 'Keynote'
    });
    await Feedback.create({
      eventId: event1._id,
      sessionId: s2._id,
      attendeeId: attendeeUsers[3]._id,
      rating: 4,
      comment: 'Very practical Kubernetes scaling strategies. Would love more deep-dive code samples.',
      category: 'Cloud'
    });

    console.log('11. Creating Announcements...');
    await Announcement.create({
      eventId: event1._id,
      title: 'Welcome to TechNova Global Innovation Summit 2026!',
      message: 'Doors open at 8:00 AM at Metropolitan Tech Center. Please have your digital QR ticket ready on your phone for rapid express badge printing.',
      priority: 'HIGH',
      targetAudience: 'ALL',
      createdBy: organizerUser._id,
      publishedAt: new Date()
    });
    await Announcement.create({
      eventId: event1._id,
      title: 'Keynote Room Update: Grand Ballroom A',
      message: 'Dr. Evelyn Reed\'s opening keynote on Autonomous Agents starts promptly at 9:00 AM in Grand Ballroom A. Seating is first-come, first-served.',
      priority: 'NORMAL',
      targetAudience: 'ATTENDEES',
      createdBy: organizerUser._id,
      publishedAt: new Date()
    });
    await Announcement.create({
      eventId: event1._id,
      title: 'Sponsor VIP Reception & Executive Mixer',
      message: 'All Platinum & Gold sponsors and speakers are invited to the Executive Sky Lounge at 6:30 PM for the leadership dinner.',
      priority: 'NORMAL',
      targetAudience: 'SPONSORS',
      createdBy: organizerUser._id,
      publishedAt: new Date()
    });

    console.log('12. Creating User Notifications...');
    await Notification.create({
      userId: attendeeUser._id,
      title: 'Registration Confirmed: TechNova Global Summit 2026',
      message: 'Your VIP Executive Pass has been confirmed. View your QR code pass anytime in My Tickets.',
      type: 'REGISTRATION',
      eventId: event1._id,
      read: false
    });
    await Notification.create({
      userId: attendeeUser._id,
      title: 'New Session Added: Autonomous Agents Keynote',
      message: 'Dr. Evelyn Reed has published her session agenda in Grand Ballroom A.',
      type: 'SESSION_CHANGE',
      eventId: event1._id,
      read: false
    });
    await Notification.create({
      userId: speakerUser._id,
      title: 'Speaker Session Scheduled',
      message: 'Your keynote has been assigned to Grand Ballroom A from 9:00 AM to 10:30 AM.',
      type: 'SESSION_CHANGE',
      eventId: event1._id,
      read: false
    });
    await Notification.create({
      userId: staffUser._id,
      title: 'Staff Check-in Assigned: TechNova Summit',
      message: 'You have been assigned as lead check-in staff for Metropolitan Tech Center.',
      type: 'SYSTEM',
      eventId: event1._id,
      read: false
    });

    console.log('====================================================');
    console.log('✅ EVENTFORGE DATABASE SEEDED SUCCESSFULLY!');
    console.log('====================================================');
    console.log('Demo Accounts for all 6 Roles (Password: password123):');
    console.log('1. Platform Admin:     admin@example.com / admin@eventforge.com');
    console.log('2. Event Organizer:    organizer@example.com / organizer1@techevents.com');
    console.log('3. Event Staff:        staff@example.com / staff1@techevents.com');
    console.log('4. Speaker:            speaker@example.com');
    console.log('5. Sponsor:            sponsor@example.com / sponsor@eventforge.com');
    console.log('6. Attendee:           attendee@example.com / attendee@eventforge.com');
    console.log('Flagship Event: "TechNova Global Innovation Summit 2026"');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedData();
