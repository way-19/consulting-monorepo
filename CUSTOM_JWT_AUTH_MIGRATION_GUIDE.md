# Custom JWT Authentication Migration Guide

## Overview

This guide provides a comprehensive walkthrough for migrating from Supabase's built-in authentication to a custom JWT authentication system. This migration enables greater control over user management, authentication flows, and integration with external systems.

## Architecture Overview

### Before Migration (Supabase Auth)
```
Client App → Supabase Auth → Database (RLS with auth.uid())
```

### After Migration (Custom JWT)
```
Client App → Custom Auth Context → Backend API → Database (RLS with custom JWT claims)
```

## Migration Components

### 1. Database Schema Changes

**File:** `supabase/migrations/20250101000000_custom_auth_migration.sql`

Key changes:
- New `users` table replacing Supabase's auth.users
- New `user_profiles` table for extended user information
- Updated RLS policies to use custom JWT claims
- Custom JWT helper functions

```sql
-- Example of custom JWT functions
CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb AS $$
  SELECT current_setting('request.jwt.claims', true)::jsonb;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.user_id() RETURNS text AS $$
  SELECT COALESCE(auth.jwt() ->> 'userId', '');
$$ LANGUAGE sql STABLE;
```

### 2. Backend Authentication Routes

**File:** `backend/src/routes/auth.ts`

Implements comprehensive authentication endpoints:

```typescript
// Sign-up endpoint
router.post('/signup', signupLimiter, async (req, res) => {
  const { email, password, firstName, lastName, role = 'client' } = req.body;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Create user in database
  const { data: user } = await supabase
    .from('users')
    .insert({
      email,
      password_hash: hashedPassword,
      role,
      email_verified: false
    })
    .select()
    .single();
    
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ user, token });
});
```

### 3. Authentication Middleware

**File:** `backend/src/middleware/auth.ts`

Provides JWT verification and role-based authorization:

```typescript
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    req.user = decoded;
    next();
  });
};
```

### 4. Frontend Authentication Context

**File:** `packages/shared/contexts/CustomAuthContext.tsx`

Manages authentication state and provides auth methods:

```typescript
export const CustomAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const { user, profile, token } = await response.json();
      localStorage.setItem('auth_token', token);
      setUser(user);
      setProfile(profile);
      return { user, profile };
    }
    
    throw new Error('Authentication failed');
  };

  // Auto-refresh token mechanism
  useEffect(() => {
    const refreshToken = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await fetch('/api/auth/refresh', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const { token: newToken } = await response.json();
            localStorage.setItem('auth_token', newToken);
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          signOut();
        }
      }
    };

    const interval = setInterval(refreshToken, 23 * 60 * 60 * 1000); // 23 hours
    return () => clearInterval(interval);
  }, []);
};
```

## Migration Steps

### Step 1: Database Migration

1. **Run the migration:**
   ```bash
   supabase db push
   ```

2. **Verify tables created:**
   - `users`
   - `user_profiles`
   - `password_reset_tokens`

3. **Check RLS policies updated:**
   - All existing tables should reference new `users.id`
   - Custom JWT functions should be available

### Step 2: Backend Setup

1. **Install dependencies:**
   ```bash
   npm install bcryptjs jsonwebtoken express-rate-limit zod
   npm install -D @types/bcryptjs @types/jsonwebtoken
   ```

2. **Environment variables:**
   ```env
   JWT_SECRET=your-super-secure-jwt-secret-key
   JWT_REFRESH_SECRET=your-refresh-token-secret
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Add auth routes to Express app:**
   ```typescript
   import authRoutes from './routes/auth';
   app.use('/api/auth', authRoutes);
   ```

### Step 3: Frontend Integration

1. **Update main app files:**
   ```typescript
   // In App.tsx
   import { CustomAuthProvider } from '@consulting19/shared/contexts/CustomAuthContext';
   
   function App() {
     return (
       <CustomAuthProvider>
         <Router>
           {/* Your app routes */}
         </Router>
       </CustomAuthProvider>
     );
   }
   ```

2. **Replace Supabase auth usage:**
   ```typescript
   // Before
   import { useAuth } from './contexts/AuthContext';
   const { user } = useAuth(); // Supabase user
   
   // After
   import { useAuth } from '@consulting19/shared/contexts/CustomAuthContext';
   const { user, profile } = useAuth(); // Custom user
   ```

### Step 4: Update Existing Components

1. **Authentication-dependent components:**
   - Login/Register forms
   - Protected routes
   - User profile displays
   - Role-based access controls

2. **API calls:**
   ```typescript
   // Use the authenticated fetch helper
   import { createAuthenticatedFetch } from '@consulting19/shared/contexts/CustomAuthContext';
   
   const authenticatedFetch = createAuthenticatedFetch();
   const response = await authenticatedFetch('/api/protected-endpoint');
   ```

### Step 5: Edge Functions Update

1. **Update Stripe webhook:**
   - Modified to call `auto-user-registration` function
   - Uses custom user creation logic

2. **Auto-user registration:**
   - Creates users in custom `users` table
   - Generates temporary passwords
   - Sends welcome emails

## Testing the Migration

### 1. Authentication Flow Testing

```typescript
// Test user registration
const testSignup = async () => {
  try {
    const result = await signUp('test@example.com', 'password123', 'John', 'Doe');
    console.log('Signup successful:', result);
  } catch (error) {
    console.error('Signup failed:', error);
  }
};

// Test user login
const testSignin = async () => {
  try {
    const result = await signIn('test@example.com', 'password123');
    console.log('Signin successful:', result);
  } catch (error) {
    console.error('Signin failed:', error);
  }
};
```

### 2. RLS Policy Testing

```sql
-- Test as different user roles
SET request.jwt.claims = '{"userId": "user-id", "role": "client"}';
SELECT * FROM service_orders; -- Should only see own orders

SET request.jwt.claims = '{"userId": "consultant-id", "role": "consultant"}';
SELECT * FROM service_orders; -- Should see assigned orders

SET request.jwt.claims = '{"userId": "admin-id", "role": "admin"}';
SELECT * FROM service_orders; -- Should see all orders
```

### 3. API Endpoint Testing

```bash
# Test authentication endpoints
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Security Considerations

### 1. JWT Security
- Use strong, unique JWT secrets
- Implement token rotation
- Set appropriate expiration times
- Validate tokens on every request

### 2. Password Security
- Use bcrypt with high salt rounds (12+)
- Implement password complexity requirements
- Add rate limiting to auth endpoints
- Implement account lockout mechanisms

### 3. Database Security
- Maintain RLS policies
- Use service role key only on backend
- Validate all user inputs
- Implement audit logging

## Troubleshooting

### Common Issues

1. **RLS Policy Errors:**
   ```sql
   -- Check if JWT functions are working
   SELECT auth.user_id(), auth.user_role();
   ```

2. **Token Verification Failures:**
   ```typescript
   // Verify JWT secret matches
   console.log('JWT_SECRET:', process.env.JWT_SECRET?.substring(0, 10) + '...');
   ```

3. **Database Connection Issues:**
   ```typescript
   // Test Supabase connection
   const { data, error } = await supabase.from('users').select('count');
   console.log('DB Connection:', error ? 'Failed' : 'Success');
   ```

### Migration Rollback

If issues arise, you can rollback by:

1. **Restore Supabase auth:**
   ```typescript
   // Re-enable Supabase auth in components
   import { createClient } from '@supabase/supabase-js';
   ```

2. **Revert RLS policies:**
   ```sql
   -- Update policies to use auth.uid() again
   ALTER POLICY "policy_name" ON table_name USING (auth.uid() = user_id);
   ```

## Performance Considerations

### 1. Token Management
- Implement token caching
- Use refresh tokens for long sessions
- Minimize token payload size

### 2. Database Optimization
- Index frequently queried columns
- Optimize RLS policy queries
- Use connection pooling

### 3. API Performance
- Implement request caching
- Use compression middleware
- Add API rate limiting

## Monitoring and Logging

### 1. Authentication Events
```typescript
// Log authentication attempts
console.log('Auth attempt:', { email, timestamp: new Date(), success: true });
```

### 2. Database Audit
```sql
-- Create audit log table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text,
  action text,
  table_name text,
  timestamp timestamptz DEFAULT now()
);
```

### 3. Error Tracking
```typescript
// Implement error tracking
const logError = (error: Error, context: string) => {
  console.error(`[${context}] ${error.message}`, error.stack);
  // Send to error tracking service
};
```

## Conclusion

This migration provides a robust, scalable authentication system with full control over user management and security policies. The custom JWT approach enables better integration with external systems while maintaining security best practices.

For additional support or questions about the migration, refer to the implementation files or contact the development team.