const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'proofpix',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database migration...');
    
    // Read the simplified migration file
    const migrationPath = path.join(__dirname, 'database', 'migrations', '003_create_basic_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Running migration: 003_create_basic_tables.sql');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify tables were created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('webhooks', 'export_jobs', 'saved_filters', 'webhook_deliveries')
      ORDER BY table_name;
    `);
    
    console.log('\n📊 New tables created:');
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    // Check if files table columns were added
    const filesColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'files' 
      AND column_name IN ('exif_data', 'image_width', 'image_height', 'md5_hash', 'processing_progress')
      ORDER BY column_name;
    `);
    
    console.log('\n📋 Files table columns added:');
    filesColumns.rows.forEach(row => {
      console.log(`  ✓ ${row.column_name}`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
runMigration().catch(console.error); 