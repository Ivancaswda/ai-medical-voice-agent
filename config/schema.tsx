import {integer, pgTable, varchar,text, json} from "drizzle-orm/pg-core";

export const usersTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    credits: integer()
})

export const SessionChatTable = pgTable('sessionChatTable', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    sessionId: varchar().notNull(),
    createdBy: varchar().references(() => usersTable.email),
    createdOn: varchar(),
    notes: text(),
    conversation: json(),
    callDuration: varchar(),
    report: json(),
    selectedDoctor: json()
})