import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const handler = NextAuth({
  providers: [
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;
        // TODO: call backend authentication API. For MVP we allow a demo user.
        if (parsed.data.email === 'demo@expat.tax' && parsed.data.password === 'Password123!') {
          return { id: 'demo-user', email: parsed.data.email, name: 'Demo User' };
        }
        return null;
      }
    })
  ]
});

export { handler as GET, handler as POST };
