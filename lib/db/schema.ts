import { pgTable, varchar, text, timestamp, pgEnum, uniqueIndex, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// Enums
export const websiteStatusEnum = pgEnum('website_status', ['active', 'inactive', 'archived']);

// Users Table
export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 256 }).primaryKey().$defaultFn(() => createId()),
    email: varchar('email', { length: 256 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 256 }),
    name: varchar('name', { length: 256 }).notNull(),
    image: varchar('image', { length: 256 }),
    role: varchar('role', { length: 50 }).notNull().default('editor'),
    status: varchar('status', { length: 50 }).notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex('email_idx').on(table.email),
  })
);

// Websites Table
export const websites = pgTable(
  'websites',
  {
    id: varchar('id', { length: 256 }).primaryKey().$defaultFn(() => createId()),
    slug: varchar('slug', { length: 256 }).notNull().unique(),
    name: varchar('name', { length: 256 }).notNull(),
    url: varchar('url', { length: 500 }).notNull(),
    description: text('description'),
    apiKey: varchar('api_key', { length: 256 }).notNull().unique(),
    status: websiteStatusEnum('status').notNull().default('active'),
    ownerId: varchar('owner_id', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    ownerIdx: uniqueIndex('owner_id_idx').on(table.ownerId),
    urlIdx: uniqueIndex('url_idx').on(table.url),
    apiKeyIdx: uniqueIndex('api_key_idx').on(table.apiKey),
    slugIdx: uniqueIndex('slug_idx').on(table.slug),
  })
);

// Sections Table
export const sections = pgTable(
  'sections',
  {
    id: varchar('id', { length: 256 }).primaryKey().$defaultFn(() => createId()),
    websiteId: varchar('website_id', { length: 256 }).notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    subtitle: varchar('subtitle', { length: 500 }),
    content: text('content'),
    order: integer('order').notNull().default(0),
    type: varchar('type', { length: 50 }).notNull().default('text'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  }
);

// Services Table
export const services = pgTable(
  'services',
  {
    id: varchar('id', { length: 256 }).primaryKey().$defaultFn(() => createId()),
    websiteId: varchar('website_id', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    icon: varchar('icon', { length: 100 }),
    price: varchar('price', { length: 100 }),
    order: integer('order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  }
);

// Team Members Table
export const teamMembers = pgTable(
  'team_members',
  {
    id: varchar('id', { length: 256 }).primaryKey().$defaultFn(() => createId()),
    websiteId: varchar('website_id', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    role: varchar('role', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }),
    phone: varchar('phone', { length: 50 }),
    department: varchar('department', { length: 256 }),
    location: varchar('location', { length: 256 }),
    bio: text('bio'),
    image: varchar('image', { length: 500 }),
    linkedIn: varchar('linkedin', { length: 500 }),
    twitter: varchar('twitter', { length: 500 }),
    github: varchar('github', { length: 500 }),
    socialLinks: text('social_links'),
    order: integer('order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  }
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  websites: many(websites),
}));

export const websitesRelations = relations(websites, ({ one, many }) => ({
  owner: one(users, {
    fields: [websites.ownerId],
    references: [users.id],
  }),
  sections: many(sections),
  services: many(services),
  teamMembers: many(teamMembers),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
  website: one(websites, {
    fields: [sections.websiteId],
    references: [websites.id],
  }),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  website: one(websites, {
    fields: [services.websiteId],
    references: [websites.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  website: one(websites, {
    fields: [teamMembers.websiteId],
    references: [websites.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type Website = typeof websites.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type Service = typeof services.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
