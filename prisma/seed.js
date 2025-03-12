const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding...`);

  // Seed Specializations
  const specializations = [
    'Family Law',
    'Criminal Law',
    'Real Estate Law',
    'Personal Injury',
    'Corporate Law',
    'Immigration Law',
    'Intellectual Property',
    'Tax Law',
    'Employment Law',
    'Estate Planning',
    'Bankruptcy',
    'Environmental Law',
    'Civil Litigation',
  ];

  for (const name of specializations) {
    await prisma.specialization.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Seeded ${specializations.length} specializations`);

  // Seed Languages
  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Korean',
    'Russian',
    'Arabic',
    'Portuguese',
    'Italian',
  ];

  for (const name of languages) {
    await prisma.language.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Seeded ${languages.length} languages`);

  // Seed Jurisdictions
  const jurisdictions = [
    'California',
    'New York',
    'Texas',
    'Florida',
    'Illinois',
    'Pennsylvania',
    'Ohio',
    'Georgia',
    'Michigan',
    'North Carolina',
    'New Jersey',
    'Virginia',
    'Washington',
    'Massachusetts',
    'Federal',
    'International',
  ];

  for (const name of jurisdictions) {
    await prisma.jurisdiction.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`Seeded ${jurisdictions.length} jurisdictions`);

  console.log(`Seeding completed.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });