import { describe, expect, it } from 'vitest';
import { rolePermissions } from '../src/domain/entities/roles.js';

describe('RBAC policy', () => {
  it('allows assistants to verify payments', () => {
    expect(rolePermissions.assistant).toContain('payments:verify');
  });

  it('keeps patients away from append-only record creation', () => {
    expect(rolePermissions.patient).not.toContain('medical_history:append');
    expect(rolePermissions.patient).not.toContain('prescriptions:create');
  });
});
