#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Test configuration
const testConfig = {
  unit: {
    name: 'Unit Tests',
    pattern: 'src/**/*.test.{ts,tsx}',
    coverage: true,
    timeout: 30000
  },
  integration: {
    name: 'Integration Tests',
    pattern: 'src/tests/integration/**/*.test.{ts,tsx}',
    coverage: true,
    timeout: 60000
  },
  components: {
    name: 'Component Tests',
    pattern: 'src/tests/components/**/*.test.{ts,tsx}',
    coverage: true,
    timeout: 45000
  },
  services: {
    name: 'Service Tests',
    pattern: 'src/tests/services/**/*.test.{ts,tsx}',
    coverage: true,
    timeout: 30000
  },
  hooks: {
    name: 'Hook Tests',
    pattern: 'src/tests/hooks/**/*.test.{ts,tsx}',
    coverage: true,
    timeout: 30000
  }
};

// Utility functions
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logHeader = (message) => {
  const border = '='.repeat(message.length + 4);
  log(border, 'cyan');
  log(`  ${message}  `, 'cyan');
  log(border, 'cyan');
};

const logSection = (message) => {
  log(`\n${'-'.repeat(50)}`, 'blue');
  log(message, 'bright');
  log('-'.repeat(50), 'blue');
};

const runCommand = (command, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
};

const checkTestFiles = (pattern) => {
  const glob = require('glob');
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
};

const generateCoverageReport = async () => {
  logSection('Generating Coverage Report');
  
  try {
    await runCommand('npx', ['jest', '--coverage', '--coverageReporters=html', '--coverageReporters=text-summary']);
    log('✅ Coverage report generated successfully', 'green');
    log('📊 Open coverage/lcov-report/index.html to view detailed coverage', 'cyan');
  } catch (error) {
    log('❌ Failed to generate coverage report', 'red');
    console.error(error.message);
  }
};

const runTestSuite = async (suiteKey, config) => {
  logSection(`Running ${config.name}`);
  
  try {
    // Check if test files exist
    const testFiles = await checkTestFiles(config.pattern);
    
    if (testFiles.length === 0) {
      log(`⚠️  No test files found for pattern: ${config.pattern}`, 'yellow');
      return { success: true, skipped: true };
    }
    
    log(`📁 Found ${testFiles.length} test file(s)`, 'blue');
    testFiles.forEach(file => log(`   - ${file}`, 'blue'));
    
    // Build Jest command
    const jestArgs = [
      '--testPathPattern=' + config.pattern,
      '--testTimeout=' + config.timeout,
      '--verbose'
    ];
    
    if (config.coverage) {
      jestArgs.push('--coverage');
    }
    
    // Run tests
    await runCommand('npx', ['jest', ...jestArgs]);
    
    log(`✅ ${config.name} completed successfully`, 'green');
    return { success: true, skipped: false };
    
  } catch (error) {
    log(`❌ ${config.name} failed`, 'red');
    console.error(error.message);
    return { success: false, skipped: false, error: error.message };
  }
};

const runLinting = async () => {
  logSection('Running ESLint');
  
  try {
    await runCommand('npm', ['run', 'lint']);
    log('✅ Linting passed', 'green');
    return { success: true };
  } catch (error) {
    log('❌ Linting failed', 'red');
    return { success: false, error: error.message };
  }
};

const runTypeChecking = async () => {
  logSection('Running TypeScript Type Checking');
  
  try {
    await runCommand('npm', ['run', 'type-check']);
    log('✅ Type checking passed', 'green');
    return { success: true };
  } catch (error) {
    log('❌ Type checking failed', 'red');
    return { success: false, error: error.message };
  }
};

const generateTestReport = (results) => {
  logSection('Test Summary Report');
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  
  Object.entries(results.testSuites).forEach(([suite, result]) => {
    totalTests++;
    if (result.skipped) {
      skippedTests++;
      log(`⚠️  ${testConfig[suite].name}: SKIPPED`, 'yellow');
    } else if (result.success) {
      passedTests++;
      log(`✅ ${testConfig[suite].name}: PASSED`, 'green');
    } else {
      failedTests++;
      log(`❌ ${testConfig[suite].name}: FAILED`, 'red');
    }
  });
  
  log('\n📊 Overall Results:', 'bright');
  log(`   Total Test Suites: ${totalTests}`, 'blue');
  log(`   Passed: ${passedTests}`, 'green');
  log(`   Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'blue');
  log(`   Skipped: ${skippedTests}`, skippedTests > 0 ? 'yellow' : 'blue');
  
  // Quality checks
  log('\n🔍 Quality Checks:', 'bright');
  log(`   Linting: ${results.linting.success ? 'PASSED' : 'FAILED'}`, results.linting.success ? 'green' : 'red');
  log(`   Type Checking: ${results.typeChecking.success ? 'PASSED' : 'FAILED'}`, results.typeChecking.success ? 'green' : 'red');
  
  // Overall status
  const allPassed = failedTests === 0 && results.linting.success && results.typeChecking.success;
  log(`\n🎯 Overall Status: ${allPassed ? 'PASSED' : 'FAILED'}`, allPassed ? 'green' : 'red');
  
  return allPassed;
};

const main = async () => {
  const startTime = Date.now();
  
  logHeader('ProofPix Enterprise - Comprehensive Test Suite');
  log('🚀 Starting comprehensive testing process...', 'cyan');
  
  const results = {
    testSuites: {},
    linting: { success: false },
    typeChecking: { success: false }
  };
  
  try {
    // Run quality checks first
    results.linting = await runLinting();
    results.typeChecking = await runTypeChecking();
    
    // Run test suites
    for (const [suiteKey, config] of Object.entries(testConfig)) {
      results.testSuites[suiteKey] = await runTestSuite(suiteKey, config);
    }
    
    // Generate coverage report
    await generateCoverageReport();
    
    // Generate final report
    const allPassed = generateTestReport(results);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    log(`\n⏱️  Total execution time: ${duration} seconds`, 'cyan');
    
    if (allPassed) {
      log('\n🎉 All tests and quality checks passed!', 'green');
      process.exit(0);
    } else {
      log('\n💥 Some tests or quality checks failed!', 'red');
      process.exit(1);
    }
    
  } catch (error) {
    log('\n💥 Test runner encountered an error:', 'red');
    console.error(error);
    process.exit(1);
  }
};

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  log('ProofPix Enterprise Test Runner', 'bright');
  log('\nUsage: node scripts/test-runner.js [options]', 'blue');
  log('\nOptions:', 'blue');
  log('  --help, -h     Show this help message', 'blue');
  log('  --watch, -w    Run tests in watch mode', 'blue');
  log('  --coverage     Generate coverage report only', 'blue');
  log('  --suite <name> Run specific test suite only', 'blue');
  log('\nAvailable test suites:', 'blue');
  Object.entries(testConfig).forEach(([key, config]) => {
    log(`  ${key.padEnd(12)} ${config.name}`, 'blue');
  });
  process.exit(0);
}

if (args.includes('--coverage')) {
  generateCoverageReport().then(() => process.exit(0)).catch(() => process.exit(1));
} else if (args.includes('--watch') || args.includes('-w')) {
  log('🔄 Running tests in watch mode...', 'cyan');
  runCommand('npx', ['jest', '--watch']).catch(() => process.exit(1));
} else {
  main();
} 