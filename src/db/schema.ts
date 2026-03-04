import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

export const timestamp = {
  createdAt: t
    .timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: t
    .timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const userRole = t.pgEnum('userRole', ['customer', 'admin']);
export const productStatus = t.pgEnum('productStatus', [
  'published',
  'draft',
  'out of stock',
]);
export const orderStatus = t.pgEnum('orderStatus', [
  'pending',
  'paid',
  'cancelled',
]);
export const userGender = t.pgEnum('userGender', ['male', 'female', 'other']);

// schemas
export const UserTable = t.pgTable(
  'users',
  {
    id: t.uuid('id').primaryKey().defaultRandom(),
    firstName: t.varchar('first_name', { length: 50 }).notNull(),
    lastName: t.varchar('last_name', { length: 50 }).notNull(),
    email: t.varchar('email', { length: 255 }).notNull(),
    phone: t.varchar('phone', { length: 20 }),
    clerkUserId: t.varchar('clerk_user_id', { length: 255 }).notNull().unique(),
    gender: userGender('gender'),
    imageUrl: t.text('image_url'),
    role: userRole('user_role').notNull().default('customer'),
    ...timestamp,
  },
  (table) => [t.uniqueIndex('user_clerk_id_idx').on(table.clerkUserId)],
);

export const AddressTable = t.pgTable(
  'addresses',
  {
    id: t.uuid('id').primaryKey().defaultRandom(),
    userId: t
      .uuid('user_id')
      .references(() => UserTable.id, { onDelete: 'cascade' })
      .notNull(),
    address1: t.varchar('address_1', { length: 255 }).notNull(),
    address2: t.varchar('address_2', { length: 255 }),
    city: t.varchar('city', { length: 20 }).notNull(),
    zip: t.varchar('zip', { length: 10 }).notNull(),
    state: t.varchar('state', { length: 10 }).notNull(),
    country: t.varchar('country', { length: 50 }).notNull(),
    isDefault: t.boolean('is_default').default(false).notNull(),
    ...timestamp,
  },
  (table) => [
    t.index('address_user_id_idx').on(table.userId),
    t.index('address_default_idx').on(table.userId, table.isDefault),
  ],
);

export const ProductTable = t.pgTable(
  'products',
  {
    id: t.uuid('id').primaryKey().defaultRandom(),
    name: t.varchar('name', { length: 255 }).notNull(),
    sanityId: t.varchar('sanity_id', { length: 255 }).notNull().unique(),
    basePriceInCents: t.integer('base_price_in_cents').notNull(),
    imageUrl: t.text('image_url').notNull(),
    status: productStatus('status').notNull().default('draft'),
    numberInStock: t.integer('number_in_stock').notNull(),
    sku: t.varchar('sku', { length: 255 }).notNull(),
    isDeleted: t.boolean('is_deleted').notNull().default(false),
    ...timestamp,
  },
  (table) => [
    t.check('base_price_check', sql`${table.basePriceInCents} > 0`),
    t
      .index('active_products_idx')
      .on(table.id, table.name)
      .where(sql`${table.isDeleted} = false`),
  ],
);

export const OrderTable = t.pgTable(
  'orders',
  {
    id: t.uuid('id').primaryKey().defaultRandom(),
    stripeCheckoutSessionId: t
      .varchar('stripe_checkout_session_id', { length: 255 })
      .unique(),
    stripePaymentIntentId: t
      .varchar('stripe_payment_intent_id', { length: 255 })
      .unique(),
    totalInCentsSnapshot: t.integer('total_in_cents_snapshot').notNull(),
    userId: t
      .uuid('user_id')
      .references(() => UserTable.id, { onDelete: 'set null' })
      .notNull(),
    status: orderStatus('status').notNull().default('pending'),
    orderNumber: t.serial('order_number'),
    shippingAddressId: t
      .uuid('shipping_address_id')
      .references(() => AddressTable.id, { onDelete: 'no action' })
      .notNull(),
    ...timestamp,
  },
  (table) => [
    t.index('orders_user_id_idx').on(table.userId),
    t.index('orders_created_at_idx').on(table.createdAt),
  ],
);

export const OrderItemTable = t.pgTable(
  'order_items',
  {
    id: t.uuid('id').primaryKey().defaultRandom(),
    orderId: t
      .uuid('order_id')
      .references(() => OrderTable.id, { onDelete: 'cascade' })
      .notNull(),
    productId: t
      .uuid('product_id')
      .references(() => ProductTable.id, { onDelete: 'cascade' })
      .notNull(),
    quantity: t.integer().notNull().default(1),
    basePriceSnapshot: t.integer('base_price_snapshot').notNull(),
    ...timestamp,
  },
  (table) => [
    t.check('quanity_check', sql`${table.quantity} > 0`),
    t.index('order_items_order_id_idx').on(table.orderId),
  ],
);

export const NewsletterTable = t.pgTable('newsletter_subscriptions', {
  id: t.uuid('id').primaryKey().defaultRandom(),
  email: t.varchar('email', { length: 255 }).notNull().unique(),
  ...timestamp,
});

export const ContactTable = t.pgTable('contacts', {
  id: t.uuid('id').primaryKey().defaultRandom(),
  firstName: t.varchar('first_name', { length: 50 }).notNull(),
  lastName: t.varchar('last_name', { length: 50 }).notNull(),
  email: t.varchar('email', { length: 255 }).notNull(),
  phone: t.varchar('phone', { length: 20 }),
  subject: t.text('subject').notNull(),
  message: t.text('message').notNull(),
  ...timestamp,
});

// relations
export const UserTableRelations = relations(UserTable, ({ many }) => ({
  addresses: many(AddressTable),
  orders: many(OrderTable),
}));

export const AddressTableRelations = relations(
  AddressTable,
  ({ one, many }) => ({
    user: one(UserTable, {
      fields: [AddressTable.userId],
      references: [UserTable.id],
    }),
    orders: many(OrderTable),
  }),
);

export const ProductTableRelations = relations(ProductTable, ({ many }) => ({
  orderItems: many(OrderItemTable),
}));

export const OrderItemTableRelations = relations(OrderItemTable, ({ one }) => ({
  product: one(ProductTable, {
    fields: [OrderItemTable.productId],
    references: [ProductTable.id],
  }),
  order: one(OrderTable, {
    fields: [OrderItemTable.orderId],
    references: [OrderTable.id],
  }),
}));

export const OrderTableRelations = relations(OrderTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [OrderTable.userId],
    references: [UserTable.id],
  }),
  orderItems: many(OrderItemTable),
  address: one(AddressTable, {
    fields: [OrderTable.shippingAddressId],
    references: [AddressTable.id],
  }),
}));
