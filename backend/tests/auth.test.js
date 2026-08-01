import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { generateTokens } from '../src/utils/generateTokens.js';

test('Authentication - generateTokens generates valid JWT access and refresh cookies', () => {
  const mockRes = {
    cookieName: '',
    cookieVal: '',
    cookieOpts: {},
    cookie(name, val, opts) {
      this.cookieName = name;
      this.cookieVal = val;
      this.cookieOpts = opts;
    }
  };

  const userId = '66a5e1002010992019280199';
  const accessToken = generateTokens(mockRes, userId);

  assert.ok(accessToken, 'Access token should be defined');
  assert.equal(typeof accessToken, 'string');

  const accessSecret = process.env.JWT_ACCESS_SECRET || 'super_secret_pharmacy_erp_access_key_2026';
  const decodedAccess = jwt.verify(accessToken, accessSecret);
  assert.equal(decodedAccess.id, userId);

  assert.equal(mockRes.cookieName, 'refreshToken');
  assert.ok(mockRes.cookieVal, 'Refresh token cookie should be set');
  assert.equal(mockRes.cookieOpts.httpOnly, true);

  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'super_secret_pharmacy_erp_refresh_key_2026';
  const decodedRefresh = jwt.verify(mockRes.cookieVal, refreshSecret);
  assert.equal(decodedRefresh.id, userId);
});
