// Mock user data
const mockUser = {
  id: '1',
  email: 'admin@example.com',
  role: 'president',
  profile: {
    id: '1',
    full_name: 'Admin',
    role: 'president',
    is_active: true
  }
};

export const getCurrentUser = () => {
  return mockUser;
};

export const signIn = async () => {
  return { user: mockUser, error: null };
};

export const signUp = async () => {
  return { user: mockUser, error: null };
};

export const signOut = async () => {
  return { error: null };
};