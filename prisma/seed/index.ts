import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { statesAndCities } from './cities';
import { businessCategories } from './categories';

const prisma = new PrismaClient();

async function main() {
  console.log('🌊 Starting Gulf Coast Directory database seeding...');

  // Seed states and cities
  console.log('📍 Seeding states and cities...');
  for (const stateData of statesAndCities) {
    const state = await prisma.state.upsert({
      where: { slug: stateData.slug },
      update: {},
      create: {
        name: stateData.name,
        slug: stateData.slug,
        description: stateData.description,
      },
    });

    console.log(`✅ Created state: ${state.name}`);

    for (const cityData of stateData.cities) {
      const city = await prisma.city.upsert({
        where: { 
          stateId_slug: {
            stateId: state.id,
            slug: cityData.slug
          }
        },
        update: {},
        create: {
          name: cityData.name,
          slug: cityData.slug,
          description: cityData.description,
          stateId: state.id,
        },
      });

      console.log(`  ✅ Created city: ${city.name} in ${state.name}`);
    }
  }

  // Seed categories
  console.log('🏷️ Seeding categories...');
  for (const categoryData of businessCategories) {
    const category = await prisma.category.upsert({
      where: { slug: categoryData.slug },
      update: {},
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        parentId: null,
      },
    });

    console.log(`✅ Created category: ${category.name}`);

    // Create subcategories if they exist
    if (categoryData.children) {
      for (const subcategoryData of categoryData.children) {
        const subcategory = await prisma.category.upsert({
          where: { slug: subcategoryData.slug },
          update: {},
          create: {
            name: subcategoryData.name,
            slug: subcategoryData.slug,
            description: subcategoryData.description,
            parentId: category.id,
          },
        });

        console.log(`  ✅ Created subcategory: ${subcategory.name} under ${category.name}`);
      }
    }
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
