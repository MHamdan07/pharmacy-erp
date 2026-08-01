import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizeRoles, authorizePermissions } from '../src/middlewares/rbacMiddleware.js';

test('Multi-Tenancy & RBAC - authorizeRoles allows permitted roles', () => {
  const middleware = authorizeRoles('Admin', 'Pharmacist');
  let nextCalled = false;

  const mockReq = {
    userFull: { role: 'Pharmacist' }
  };
  const mockRes = {};
  const mockNext = () => { nextCalled = true; };

  middleware(mockReq, mockRes, mockNext);
  assert.equal(nextCalled, true, 'Next middleware should be invoked for Pharmacist role');
});

test('Multi-Tenancy & RBAC - authorizeRoles grants Master override to Owner and SuperAdmin', () => {
  const middleware = authorizeRoles('Pharmacist');
  let nextCalled = false;

  const mockReq = {
    userFull: { role: 'Owner' }
  };
  const mockRes = {};
  const mockNext = () => { nextCalled = true; };

  middleware(mockReq, mockRes, mockNext);
  assert.equal(nextCalled, true, 'Next middleware should be invoked for Owner role override');
});

test('Multi-Tenancy & RBAC - authorizeRoles denies unauthorized role', () => {
  const middleware = authorizeRoles('Admin');
  let statusSet = 0;
  let jsonOutput = null;

  const mockReq = {
    userFull: { role: 'Cashier' }
  };
  const mockRes = {
    status(code) {
      statusSet = code;
      return this;
    },
    json(data) {
      jsonOutput = data;
    }
  };
  const mockNext = () => {};

  middleware(mockReq, mockRes, mockNext);
  assert.equal(statusSet, 403, 'Should respond with 403 Forbidden');
  assert.ok(jsonOutput.message.includes('Access denied'), 'Should include access denied message');
});

test('Multi-Tenancy & RBAC - authorizePermissions checks required permissions array', () => {
  const middleware = authorizePermissions('inventory:write');
  let nextCalled = false;

  const mockReq = {
    userFull: {
      role: 'InventoryManager',
      permissions: ['inventory:read', 'inventory:write']
    }
  };
  const mockRes = {};
  const mockNext = () => { nextCalled = true; };

  middleware(mockReq, mockRes, mockNext);
  assert.equal(nextCalled, true, 'Next middleware should be invoked when permissions are held');
});
