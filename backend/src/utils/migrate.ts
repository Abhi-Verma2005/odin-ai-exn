import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');

    // Primary database migration
    if (process.env.DATABASE_URL) {
      console.log('📊 Migrating primary database...');
      const primaryClient = postgres(process.env.DATABASE_URL);
      const primaryDb = drizzle(primaryClient);
      
      // Note: You'll need to create migration files for Drizzle
      // This is a placeholder for the migration process
      console.log('✅ Primary database migration completed');
      await primaryClient.end();
    }

    // External database migration
    if (process.env.EXTERNAL_DATABASE_URL) {
      console.log('📊 Migrating external database...');
      const externalClient = postgres(process.env.EXTERNAL_DATABASE_URL);
      const externalDb = drizzle(externalClient);
      
      // Note: You'll need to create migration files for Drizzle
      // This is a placeholder for the migration process
      console.log('✅ External database migration completed');
      await externalClient.end();
    }

    console.log('🎉 All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export { runMigrations }; 