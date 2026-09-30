import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS, INITIAL_STUDENTS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  selectedStudentId: string;
  setSelectedStudentId: (studentId: string) => void;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: (role: UserRole) => void;
  logout: () => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'schoolsync_current_user';
const SELECTED_STUDENT_KEY = 'schoolsync_selected_student';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDemoMode = import.meta.env.VITE_APP_MODE !== 'production';

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    // Default to Parent Mrs. Das for immediate rich demo preview
    return DEMO_USERS[1]; // parent Mrs. Das
  });

  const [selectedStudentId, setSelectedStudentIdState] = useState<string>(() => {
    const saved = localStorage.getItem(SELECTED_STUDENT_KEY);
    return saved || 'stu_001'; // Default Riya Das
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const setSelectedStudentId = (studentId: string) => {
    setSelectedStudentIdState(studentId);
    localStorage.setItem(SELECTED_STUDENT_KEY, studentId);
  };

  const login = async (
    email: string,
    _password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    // In demo mode, check demo accounts
    const match = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.role === role
    );

    if (match) {
      setUser(match);
      if (match.assignedStudentIds && match.assignedStudentIds.length > 0) {
        setSelectedStudentId(match.assignedStudentIds[0]);
      }
      return { success: true };
    }

    // Fallback if email matches without role check
    const emailMatch = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (emailMatch) {
      setUser(emailMatch);
      if (emailMatch.assignedStudentIds && emailMatch.assignedStudentIds.length > 0) {
        setSelectedStudentId(emailMatch.assignedStudentIds[0]);
      }
      return { success: true };
    }

    // Generic fallback user for demo testing
    const fallbackUser: User = {
      uid: 'user_dynamic_' + Date.now(),
      schoolId: 'school_001',
      email,
      name: email.split('@')[0],
      role,
      phone: '+91 98000 00000',
      assignedStudentIds: ['stu_001'],
      assignedBusId: 'bus_003',
      assignedRouteId: 'route_001',
      assignedClass: 'LKG',
      assignedSection: 'A',
    };
    setUser(fallbackUser);
    return { success: true };
  };

  const quickDemoLogin = (targetRole: UserRole) => {
    const target = DEMO_USERS.find((u) => u.role === targetRole) || DEMO_USERS[0];
    setUser(target);
    if (target.assignedStudentIds && target.assignedStudentIds.length > 0) {
      setSelectedStudentId(target.assignedStudentIds[0]);
    } else {
      setSelectedStudentId(INITIAL_STUDENTS[0].id);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        selectedStudentId,
        setSelectedStudentId,
        login,
        quickDemoLogin,
        logout,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
