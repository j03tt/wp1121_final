import { table } from "console";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
  numeric,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 100 }),
    provider: varchar("provider", { length: 100, enum: ["github", "credentials"] })
      .notNull()
      .default("credentials"),
    bio: varchar("bio", { length: 300 }),
  },
  (table) => ({
    userNameIndex: index("user_index").on(table.name),
    passwordIndex: index("password_index").on(table.password),
    emailIndex: index("email_index").on(table.email),
  }),
);

export const songsTable = pgTable(
  "songs",
  {
    id: serial("id").primaryKey(),
    uploadUser: varchar("upload_user", { length: 50 })
      .notNull()
      .references(() => usersTable.name, { onDelete: "cascade"}),
    avgScore: numeric("average_score", { precision: 10, scale: 2 }).notNull(),
    reviewers: integer("reviewers").notNull(),
    songName: varchar("song_name", { length: 50 }).notNull(),
    singerName: varchar("singer_name", { length: 50 }).notNull(),
    songLink: varchar("song_link", { length: 150 }).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
    thumbnail: varchar("thumbnail", { length: 150 }).notNull(),
  },
  (table) => ({
    userNameIndex: index("user_name_index").on(table.uploadUser),
    songNameIndex: index("song_name_index").on(table.songName),
    singerNameIndex: index("singer_name_index").on(table.singerName),
    songLinkIndex: index("song_link_index").on(table.songLink),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    thumbnailIndex: index("thumbnail_index").on(table.thumbnail),
    avgScoreIndex: index("average_score_index").on(table.avgScore),
    reviewersIndex: index("reviewers_index").on(table.reviewers),
  }),
);

export const scoresTable = pgTable(
  "scores",
  {
    id: serial("id").primaryKey(),
    songId: integer("song_id")
      .notNull()
      .references(() => songsTable.id, { onDelete: "cascade"}),
    userId: varchar("user_id", { length: 50 })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade"}),
    score: integer("score").notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    songIdIndex: index("song_id_index").on(table.songId),
    reviewersIndex: index("reviewers_index").on(table.userId),
    scoreIndex: index("score_index").on(table.score),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    constraint: unique("song_score").on(table.songId, table.userId)
  }),
)

export const commentsTable = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    songId: integer("song_id")
      .notNull()
      .references(() => songsTable.id, { onDelete: "cascade" }),
    userName: varchar("user_name", { length: 50 })
      .notNull()
      .references(() => usersTable.name, { onDelete: "cascade"}),
    content: varchar("content", { length: 200 }),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    userNameIndex: index("user_name_index").on(table.userName),
    songIdIndex: index("song_id_index").on(table.songId),
    contentIndex: index("content_index").on(table.content),
    createdAtIndex: index("created_at_index").on(table.createdAt),
  }),
)

export const likesTable = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade"}),
    commentId: integer("comment_id")
      .notNull()
      .references(() => commentsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
    commentIdIndex: index("comment_id_index").on(table.commentId),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    constraint: unique("likes").on(table.commentId, table.userId),
  }),
);

export const dislikesTable = pgTable(
  "dislikes",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade"}),
    commentId: integer("comment_id")
      .notNull()
      .references(() => commentsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
    commentIdIndex: index("comment_id_index").on(table.commentId),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    constraint: unique("dislikes").on(table.commentId, table.userId),
  }),
);

