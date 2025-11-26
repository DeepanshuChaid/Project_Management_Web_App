// src/config/passport.config.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './app.config.js';
import { loginOrCreateAccountService, verfiyUserService } from '../service/auth.service.js';
import prisma from "../prisma.js"
import { Strategy as LocalStrategy } from 'passport-local';

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Extract user info from Google profile
        const { email, sub: googleId, picture } = profile._json;

        console.log('Google ID:', googleId);
        console.log('Profile:', profile);

        // Validate Google ID
        if (!googleId) {
          return done(new Error('Google ID not found'), null);
        }

        // Validate email
        if (!email) {
          return done(new Error('Email not found in Google profile'), null);
        }

        // Call our service to login or create account
        const { user } = await loginOrCreateAccountService({
          provider: 'GOOGLE',
          displayName: profile.displayName,
          providerId: googleId,
          email,
          picture,
        });

        // Success! Pass user to Passport
        done(null, user);

      } catch (error) {
        console.error('Google Strategy Error:', error);
        done(error, null);
      }
    }
  )
);
d
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: true
  }, 
  async (email, password, done) => {
    try {
      const user = await verfiyUserService(email, password)
      return done(null, user)
    } catch (error) {
      return done(error, false, {message: error.message})
    }
  }
))

// Serialize user: Store user ID in session
// This detrmines what data gets stored in the session cookie
passport.serializeUser((user, done) => {
  done(null, user.id); // Only store user ID
});

// Deserialize user: Retrieve full user object from database using ID
// This runs on every request to populate req.user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        currentWorkspace: true,
        isActive: true,
        accounts: {
          select: {
            id: true,
            provider: true,
          }
        },
        members: {
          select: {
            workspaceId: true,
            workspace: {
              select: {
                id: true,
                name: true,
                inviteCode: true,
              }
            },
            role: {
              select: {
                name: true,
                permissions: true,
              }
            }
          },
        },
      },
    });

    if (!user) {
      return done(new Error('User not found'), null);
    }

    done(null, user);
  } catch (error) {
    console.error('Deserialize user error:', error);
    done(error, null);
  }
});

export default passport;




