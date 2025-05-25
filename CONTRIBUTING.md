# Contributing to ProofPix

Thank you for your interest in contributing to ProofPix! We welcome contributions that help improve this privacy-focused EXIF metadata extraction tool.

## 🎯 Project Goals

ProofPix is designed with these core principles:
- **Privacy First**: All processing must happen client-side
- **No Data Collection**: Zero tracking or analytics
- **User Control**: Users maintain complete control over their data
- **Transparency**: Open source and auditable code

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/proofpix.git
cd proofpix

# Install dependencies
npm install

# Start development server
npm start
```

## 🛠️ Development Guidelines

### Code Standards
- **TypeScript**: Use TypeScript for all new code
- **Privacy**: Ensure no data leaves the user's device
- **Error Handling**: Add comprehensive error handling
- **Documentation**: Update documentation for new features

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Code Style
- Use Prettier for formatting
- Follow existing naming conventions
- Add JSDoc comments for public functions
- Use meaningful variable and function names

## 📝 Types of Contributions

### 🐛 Bug Reports
- Use the GitHub issue template
- Include browser version and OS
- Provide steps to reproduce
- Include error messages and console logs

### ✨ Feature Requests
- Check existing issues first
- Explain the use case
- Consider privacy implications
- Propose implementation approach

### 🔧 Code Contributions
- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Update documentation
- Submit a pull request

## 🔒 Privacy Requirements

All contributions must maintain ProofPix's privacy-first approach:

### ✅ Allowed
- Client-side image processing
- Local storage for user preferences
- Browser-based file operations
- Offline functionality

### ❌ Not Allowed
- Server uploads of user images
- Analytics or tracking
- External API calls with user data
- Cookies for tracking purposes

## 📋 Pull Request Process

1. **Fork & Branch**: Create a feature branch from `main`
2. **Develop**: Make your changes following our guidelines
3. **Test**: Ensure all tests pass and add new tests
4. **Document**: Update README and relevant documentation
5. **Submit**: Create a pull request with clear description

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Tests pass and new tests added if needed
- [ ] Documentation updated
- [ ] Privacy requirements maintained
- [ ] No sensitive data in commits
- [ ] Descriptive commit messages

## 🏗️ Project Structure

```
src/
├── components/          # React components
├── utils/              # Utility functions
├── types.ts           # TypeScript interfaces
└── ProofPix.tsx       # Main app component
```

### Key Files
- `src/utils/metadata.ts` - EXIF extraction logic
- `src/components/ProcessingInterface.tsx` - Main UI
- `src/utils/errorLogger.ts` - Error tracking system

## 🎨 UI/UX Guidelines

- **Dark Theme**: Maintain professional appearance
- **Responsive**: Ensure mobile compatibility
- **Accessibility**: Follow WCAG guidelines
- **Performance**: Optimize for large image files

## 🐛 Debugging

### Error Logging
ProofPix includes a comprehensive error logging system:

```javascript
// View error statistics
errorLogger.getErrorStats()

// Export error logs
errorLogger.downloadErrorLog()
```

### Common Issues
- **Large Files**: Test with various file sizes
- **Browser Compatibility**: Test across browsers
- **Memory Usage**: Monitor for memory leaks

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [EXIF Specification](https://exiv2.org/tags.html)
- [Privacy by Design](https://www.ipc.on.ca/wp-content/uploads/resources/7foundationalprinciples.pdf)

## 🤝 Community

- **Issues**: Use GitHub issues for bugs and features
- **Discussions**: Use GitHub discussions for questions
- **Code of Conduct**: Be respectful and constructive

## 📄 License

By contributing to ProofPix, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make ProofPix better while maintaining user privacy! 🔒 