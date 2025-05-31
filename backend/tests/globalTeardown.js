module.exports = async () => {
  console.log('🧹 Cleaning up test environment...');
  
  try {
    // Close any remaining connections
    if (global.dbPool) {
      await global.dbPool.end();
    }
    
    // Clean up test files
    // Note: In a real environment, you would:
    // 1. Clean up test database
    // 2. Remove test files
    // 3. Close Redis connections
    
    console.log('✅ Test environment cleanup complete');
  } catch (error) {
    console.error('❌ Test environment cleanup failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  }
}; 