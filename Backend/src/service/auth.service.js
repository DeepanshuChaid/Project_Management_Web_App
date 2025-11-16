// src/service/auth.service.js
import prisma from '../prisma.js';
import { generateInviteCode } from '../utils/uuid.js';
import bcrypt from 'bcrypt';

// login or create account service
export const loginOrCreateAccountService = async (data) => {
  const { provider, providerId, displayName, email, picture } = data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      let user = await tx.user.findUnique({
        where: { email },
        include: {
          accounts: true,
          workspaces: true,
        },
      });

      console.log('Checking for existing user...');

      if (!user) {
        console.log('User not found. Creating new user...');

        user = await tx.user.create({
          data: {
            email,
            name: displayName,
            profilePicture: picture || null,
            accounts: {
              create: {
                provider,
                providerId,
              },
            },
          },
          include: {
            accounts: true,
          },
        });

        console.log('User created:', user.id);

        const workspace = await tx.workspace.create({
          data: {
            name: `${user.name}'s Workspace`,
            description: `Workspace created for ${user.name}`,
            inviteCode: generateInviteCode(),
            ownerId: user.id, // Fixed: was 'owner'
          },
        });

        console.log('Workspace created:', workspace.id);

        const ownerRole = await tx.role.findFirst({
          where: { name: 'OWNER' },
        });

        if (!ownerRole) {
          throw new Error('Owner role not found in database');
        }

        await tx.member.create({
          data: {
            userId: user.id,
            workspaceId: workspace.id,
            roleId: ownerRole.id,
          },
        });

        console.log('Member created for workspace');

        user = await tx.user.update({
          where: { id: user.id },
          data: {
            currentWorkspace: workspace.id,
          },
          include: {
            accounts: true,
            workspaces: true,
          },
        });

        console.log('User updated with current workspace');
      } else {
        console.log('Existing user found:', user.id);

        const existingAccount = user.accounts.find(
          (acc) => acc.provider === provider && acc.providerId === providerId
        );

        if (!existingAccount) {
          await tx.account.create({
            data: {
              provider,
              providerId,
              userId: user.id, // Fixed: was 'user'
            },
          });
          console.log('New OAuth account linked to existing user');
        }

        // Update last login
        await tx.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });
      }

      return { user };
    });

    console.log('Transaction completed successfully');
    return result;
  } catch (error) {
    console.error('Error in loginOrCreateAccountService:', error);
    throw error;
  } finally {
    // Use finally block for cleanup
    await prisma.$disconnect();
    console.log('Session stopped');
  }
};


// register user service
export const registerUserService = async (data) => {
  const { name, email, password } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const results = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          accounts: {
            create: {
              provider: 'EMAIL',
              providerId: email,
            },
          },
        },
      });

      const workspace = await tx.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          description: `Workspace created for ${name}`,
          inviteCode: generateInviteCode(),
          ownerId: newUser.id, // Fixed: was 'owner'
        },
      });

      const ownerRole = await tx.role.findFirst({
        where: { name: 'OWNER' },
      });

      if (!ownerRole) {
        throw new Error('Owner role not found in database');
      }

      await tx.member.create({
        data: {
          userId: newUser.id,
          workspaceId: workspace.id,
          roleId: ownerRole.id,
        },
      });

      // Update user's current workspace
      await tx.user.update({
        where: { id: newUser.id },
        data: {
          currentWorkspace: workspace.id,
        },
      });

      return { 
        userId: newUser.id, 
        workspaceId: workspace.id,
        email: newUser.email 
      };
    });

    return results;
  } catch (error) {
    console.error('Error in registerUserService:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('Session stopped');
  }
};


// verfiy user service
export const verfiyUserService = async (email, password, provider = "EMAIL") => {
  const account = await prisma.account.findUnique({
    where: {
        provider,
        providerId: email
    },
    include: {
      user: true
    }
  })

  if (!account) throw new Error("invalid email or password")

  const user = await prisma.user.findUnique({
    where: {
      id: account.userId
    }
  })

  if (!user) throw new Error("User not found Based on the provided email")

  
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) throw new Error("Invalid email or password")

  
  return user
  
}