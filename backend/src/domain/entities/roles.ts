export const roles = ['patient', 'doctor', 'assistant', 'admin', 'super_admin'] as const;
export type Role = (typeof roles)[number];

export const permissions = [
  'profile:manage',
  'doctors:read',
  'doctors:manage',
  'appointments:create',
  'appointments:manage_own',
  'appointments:verify',
  'appointments:manage_all',
  'payments:create',
  'payments:verify',
  'reports:upload',
  'reports:manage',
  'medical_history:append',
  'medical_history:read_own',
  'medical_history:read_assigned',
  'prescriptions:create',
  'prescriptions:read_own',
  'chat:use',
  'ai:use',
  'analytics:doctor',
  'analytics:platform',
  'users:manage',
  'security:manage',
  'settings:manage',
  'audit_logs:read'
] as const;

export type Permission = (typeof permissions)[number];

export const rolePermissions: Record<Role, Permission[]> = {
  patient: [
    'profile:manage',
    'doctors:read',
    'appointments:create',
    'appointments:manage_own',
    'payments:create',
    'reports:upload',
    'medical_history:read_own',
    'prescriptions:read_own',
    'chat:use',
    'ai:use'
  ],
  doctor: [
    'profile:manage',
    'doctors:read',
    'appointments:manage_own',
    'medical_history:append',
    'medical_history:read_assigned',
    'prescriptions:create',
    'chat:use',
    'ai:use',
    'analytics:doctor'
  ],
  assistant: ['appointments:verify', 'payments:verify', 'reports:manage', 'chat:use'],
  admin: ['users:manage', 'doctors:manage', 'reports:manage', 'analytics:platform', 'appointments:manage_all'],
  super_admin: [...permissions]
};
