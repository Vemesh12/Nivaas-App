const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../src/utils/password");

const prisma = new PrismaClient();

async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.updateMany({ data: { communityId: null } });
  await prisma.community.deleteMany();
  await prisma.user.deleteMany();

  const password = await hashPassword("password123");

  const admin = await prisma.user.create({
    data: {
      fullName: "Aarav Sharma",
      phone: "9000000001",
      email: "admin@nivaas.app",
      password,
      flatNumber: "A-101",
      role: "ADMIN",
      status: "APPROVED",
      showPhoneNumber: true
    }
  });

  const community = await prisma.community.create({
    data: {
      name: "Green Park Nivaas",
      city: "Hyderabad",
      area: "Kondapur",
      inviteCode: "GREEN123",
      createdById: admin.id
    }
  });

  await prisma.user.update({ where: { id: admin.id }, data: { communityId: community.id } });

  const residents = await Promise.all(
    [
      ["Meera Iyer", "9000000002", "A-204", true],
      ["Kabir Khan", "9000000003", "B-302", false],
      ["Priya Reddy", "9000000004", "C-110", true]
    ].map(([fullName, phone, flatNumber, showPhoneNumber]) =>
      prisma.user.create({
        data: {
          fullName,
          phone,
          password,
          flatNumber,
          showPhoneNumber,
          communityId: community.id,
          status: "APPROVED"
        }
      })
    )
  );

  const pending = await prisma.user.create({
    data: {
      fullName: "Rohan Das",
      phone: "9000000005",
      password,
      flatNumber: "D-404",
      communityId: community.id,
      status: "PENDING"
    }
  });

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "Water supply interruption tomorrow",
        description: "Tank cleaning is scheduled from 9 AM to 11 AM tomorrow. Please store drinking water tonight.",
        category: "ALERT",
        isPinned: true,
        communityId: community.id,
        authorId: admin.id
      }
    }),
    prisma.post.create({
      data: {
        title: "Lost keys near Block B lift",
        description: "Small blue keychain with two house keys. Please comment here if you found it.",
        category: "LOST_FOUND",
        communityId: community.id,
        authorId: residents[0].id
      }
    }),
    prisma.post.create({
      data: {
        title: "Need plumber recommendation",
        description: "Kitchen sink in A-204 is leaking. Any trusted plumber available nearby today?",
        category: "HELP",
        communityId: community.id,
        authorId: residents[1].id
      }
    }),
    prisma.post.create({
      data: {
        title: "Sunday badminton group",
        description: "A few of us are playing at 7 AM this Sunday near the community court. Join if interested.",
        category: "EVENT",
        communityId: community.id,
        authorId: residents[2].id
      }
    })
  ]);

  await prisma.comment.createMany({
    data: [
      { text: "I know someone reliable. Sharing the contact with you.", postId: posts[2].id, authorId: residents[2].id },
      { text: "I can join. Please add my name.", postId: posts[3].id, authorId: residents[0].id }
    ]
  });

  await prisma.like.createMany({
    data: [
      { postId: posts[0].id, userId: residents[0].id },
      { postId: posts[0].id, userId: residents[1].id },
      { postId: posts[2].id, userId: residents[2].id }
    ]
  });

  await prisma.notice.createMany({
    data: [
      {
        title: "Monthly residents meeting",
        description: "Residents meeting at the clubhouse on Sunday at 6 PM. Agenda: water schedule, parking, and festival planning.",
        isImportant: true,
        communityId: community.id,
        createdById: admin.id
      },
      {
        title: "Garden maintenance",
        description: "The central garden will be closed on Friday morning from 8 AM to 12 PM for maintenance.",
        communityId: community.id,
        createdById: admin.id
      },
      {
        title: "Waste collection reminder",
        description: "Please keep dry and wet waste separated before the 8:30 AM collection.",
        communityId: community.id,
        createdById: admin.id
      }
    ]
  });

  console.log("Seed complete");
  console.log("Admin login: admin@nivaas.app / password123");
  console.log("Resident login: 9000000002 / password123");
  console.log("Pending resident:", pending.phone);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
