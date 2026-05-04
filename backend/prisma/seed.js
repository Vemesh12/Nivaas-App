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
      email: "admin@mohalla.app",
      password,
      flatNumber: "A-101",
      role: "ADMIN",
      status: "APPROVED",
      showPhoneNumber: true
    }
  });

  const community = await prisma.community.create({
    data: {
      name: "Green Park Mohalla",
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
        title: "Water supply timing update",
        description: "Water supply may be delayed by 30 minutes tomorrow morning due to tank cleaning.",
        category: "ALERT",
        isPinned: true,
        communityId: community.id,
        authorId: admin.id
      }
    }),
    prisma.post.create({
      data: {
        title: "Lost set of keys near Block B",
        description: "Small keychain with two house keys. Please comment if found.",
        category: "LOST_FOUND",
        communityId: community.id,
        authorId: residents[0].id
      }
    }),
    prisma.post.create({
      data: {
        title: "Need plumber recommendation",
        description: "Kitchen sink is leaking. Any trusted plumber nearby?",
        category: "HELP",
        communityId: community.id,
        authorId: residents[1].id
      }
    })
  ]);

  await prisma.comment.create({
    data: { text: "I know someone reliable. Sharing contact in person.", postId: posts[2].id, authorId: residents[2].id }
  });

  await prisma.notice.createMany({
    data: [
      {
        title: "Monthly community meeting",
        description: "Meeting at the clubhouse on Sunday at 6 PM.",
        isImportant: true,
        communityId: community.id,
        createdById: admin.id
      },
      {
        title: "Garden maintenance",
        description: "The central garden will be closed on Friday morning.",
        communityId: community.id,
        createdById: admin.id
      }
    ]
  });

  console.log("Seed complete");
  console.log("Admin login: admin@mohalla.app / password123");
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
