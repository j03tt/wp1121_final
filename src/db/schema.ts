import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    userName: varchar("user_name", { length: 50 }).notNull().unique(),
    password: varchar("password", { length: 100 }).notNull(),
  },
  (table) => ({
    userNameIndex: index("user_index").on(table.userName),
    passeordIndex: index("password_index").on(table.password),
  }),
);

export const songsTable = pgTable(
  "songs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade"}),
    songName: varchar("song_name", { length: 50 }).notNull(),
    singerName: varchar("singer_name", { length: 50 }).notNull(),
    songLink: varchar("song_link", { length: 150 }).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
    reviewers: integer("reviewers").notNull(),
    score: integer("score").notNull(),
    thumbnail: varchar("thumbnail", { length: 150 }).notNull(),
  },
  (table) => ({
    userNameIndex: index("user_name_index").on(table.userId),
    songNameIndex: index("song_name_index").on(table.songName),
    singerNameIndex: index("singer_name_index").on(table.singerName),
    songLinkIndex: index("song_link_index").on(table.songLink),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    reviewersIndex: index("reviewers_index").on(table.reviewers),
    scoreIndex: index("score_index").on(table.score),
    thumbnailIndex: index("thumbnail_index").on(table.thumbnail),
  }),
);

export const scoresTable = pgTable(
  "scores",
  {
    id: serial("id").primaryKey(),
    songId: integer("song_id")
      .notNull()
      .references(() => songsTable.id, { onDelete: "cascade"}),
    reviewerId: varchar("reviewer", { length: 50 })
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade"}),
    score: integer("score").notNull(),
  },
)

export const commentsTable = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    songId: integer("song_id")
      .notNull()
      .references(() => songsTable.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade"}),
    content: varchar("content", { length: 200}),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
    songIdIndex: index("song_id_index").on(table.songId),
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
  }),
);

