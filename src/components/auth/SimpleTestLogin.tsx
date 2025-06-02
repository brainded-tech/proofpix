import React from 'react';
import { useTestAuth } from './TestAuthProvider';

export const SimpleTestLogin: React.FC = () => {
  const { login, user, isAuthenticated } = useTestAuth();

  const handleTestLogin = async () => {
    const result = await login('enterprise@proofpix.com', 'test123');
    if (result.success) {
      console.log('Login successful!');
    } else {
      console.error('Login failed:', result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Simple Test Login</h2>
        
        {isAuthenticated ? (
          <div>
            <p className="text-green-600 mb-4">✅ Logged in as: {user?.email}</p>
            <p className="text-sm text-gray-600">Role: {user?.role}</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">Not logged in</p>
            <button
              onClick={handleTestLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Test Login (Enterprise)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 