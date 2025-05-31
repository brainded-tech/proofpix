const fs = require('fs').promises;
const path = require('path');
const { query, testConnection, logger } = require('../config/database');

/**
 * Run database migrations
 */
const runMigrations = async () => {
  try {
    logger.info('Starting database migrations...');

    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Create migrations table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    logger.info(`Found ${migrationFiles.length} migration files`);

    // Get already executed migrations
    const executedResult = await query('SELECT filename FROM migrations');
    const executedMigrations = new Set(executedResult.rows.map(row => row.filename));

    // Run pending migrations
    for (const filename of migrationFiles) {
      if (executedMigrations.has(filename)) {
        logger.info(`Skipping already executed migration: ${filename}`);
        continue;
      }

      logger.info(`Running migration: ${filename}`);
      
      try {
        // Read migration file
        const filePath = path.join(migrationsDir, filename);
        const migrationSQL = await fs.readFile(filePath, 'utf8');

        // Execute migration
        await query(migrationSQL);

        // Record migration as executed
        await query(
          'INSERT INTO migrations (filename) VALUES ($1)',
          [filename]
        );

        logger.info(`Successfully executed migration: ${filename}`);

      } catch (error) {
        logger.error(`Failed to execute migration ${filename}:`, error);
        throw error;
      }
    }

    logger.info('All migrations completed successfully');

  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
};

/**
 * Rollback last migration (for development)
 */
const rollbackLastMigration = async () => {
  try {
    logger.info('Rolling back last migration...');

    // Get last executed migration
    const result = await query(`
      SELECT filename FROM migrations 
      ORDER BY executed_at DESC 
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      logger.info('No migrations to rollback');
      return;
    }

    const lastMigration = result.rows[0].filename;
    logger.warn(`Rolling back migration: ${lastMigration}`);

    // Remove from migrations table
    await query('DELETE FROM migrations WHERE filename = $1', [lastMigration]);

    logger.info(`Rollback completed for: ${lastMigration}`);
    logger.warn('Note: This only removes the migration record. Manual cleanup may be required.');

  } catch (error) {
    logger.error('Rollback failed:', error);
    process.exit(1);
  }
};

/**
 * Show migration status
 */
const showMigrationStatus = async () => {
  try {
    // Get list of migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Get executed migrations
    const executedResult = await query(`
      SELECT filename, executed_at 
      FROM migrations 
      ORDER BY executed_at
    `);
    const executedMigrations = new Map(
      executedResult.rows.map(row => [row.filename, row.executed_at])
    );

    console.log('\n📊 Migration Status:');
    console.log('==================');

    migrationFiles.forEach(filename => {
      const isExecuted = executedMigrations.has(filename);
      const status = isExecuted ? '✅ Executed' : '⏳ Pending';
      const executedAt = isExecuted ? 
        ` (${executedMigrations.get(filename).toISOString()})` : '';
      
      console.log(`${status} ${filename}${executedAt}`);
    });

    console.log(`\nTotal: ${migrationFiles.length} migrations`);
    console.log(`Executed: ${executedResult.rows.length}`);
    console.log(`Pending: ${migrationFiles.length - executedResult.rows.length}\n`);

  } catch (error) {
    logger.error('Failed to show migration status:', error);
    process.exit(1);
  }
};

// CLI interface
if (require.main === module) {
  const command = process.argv[2];

  switch (command) {
    case 'up':
      runMigrations();
      break;
    case 'rollback':
      rollbackLastMigration();
      break;
    case 'status':
      showMigrationStatus();
      break;
    default:
      console.log('Usage: node migrate.js [up|rollback|status]');
      console.log('  up       - Run pending migrations');
      console.log('  rollback - Rollback last migration');
      console.log('  status   - Show migration status');
      process.exit(1);
  }
}

module.exports = {
  runMigrations,
  rollbackLastMigration,
  showMigrationStatus
}; 