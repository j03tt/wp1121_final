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
  uuid,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    name: varchar("user_name", { length: 50 }).notNull().unique(), // user name
    email: varchar("email", { length: 100 }).notNull().unique(), // user email 
    password: varchar("password", { length: 100 }), // user password
    provider: varchar("provider", { length: 100, enum: ["github", "credentials"] }) //provider
      .notNull()
      .default("credentials"),
    bio: varchar("bio", { length: 500 }), // user biography
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
    userName: varchar("user_name", { length: 50 }) // name of people who upload the song
      .notNull()
      .references(() => usersTable.name, { onDelete: "cascade", onUpdate: "cascade"}),
    songName: varchar("song_name", { length: 50 }).notNull(), // name of song
    singerName: varchar("singer_name", { length: 50 }).notNull(), // name of singer
    songLink: varchar("song_link", { length: 300 }).notNull(), // link of song
    createdAt: timestamp("created_at").default(sql`now()`), // time that song be uploaded
    avgScore: numeric("average_score", { precision: 10, scale: 2 }).notNull(), // the average score of song
    reviewers: integer("reviewers").notNull(), // the number of people who score the song
    thumbnail: varchar("thumbnail", { length: 300 }).notNull(), // link of song's thumbnail
  },
  (table) => ({
    userNameIndex: index("user_name_index").on(table.userName),
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
    songId: integer("song_id") // id of the song in songsTable
      .notNull()
      .references(() => songsTable.id, { onDelete: "cascade", onUpdate: "cascade"}),
    userName: varchar("user_name", { length: 50 }) // id of the song in songsTable
      .notNull()
      .references(() => usersTable.name, { onDelete: "cascade", onUpdate: "cascade"}),
    score: numeric("score", { precision: 10, scale: 2 }).notNull(), // user score for this song
    createdAt: timestamp("created_at").default(sql`now()`), // when the score be graded
  },
  (table) => ({
    songIdIndex: index("song_id_index").on(table.songId),
    scoreIndex: index("score_index").on(table.score),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    userNameIndex: index("user_name_index").on(table.userName),
    constraint: unique("song_score").on(table.songId, table.userName)
  }),
)

export const commentsTable = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    songId: integer("song_id")  // which song be comment
      .notNull()
      .references(() => songsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    userName: varchar("user_name")  // who comment
      .notNull()
      .references(() => usersTable.name, { onDelete: "cascade", onUpdate: "cascade" }),
    content: varchar("content", { length: 300 }), // content of comments
    createdAt: timestamp("created_at").default(sql`now()`), // when comments be maked
  },
  (table) => ({
    userNameIndex: index("user_name_index").on(table.userName),
    songIdIndex: index("song_id_index").on(table.songId),
    contentIndex: index("content_index").on(table.content),
    createdAtIndex: index("created_at_index").on(table.createdAt),
  }),
)

export const likesTable = pgTable(
  "like",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade",onUpdate: "cascade" }),
    commentId: integer("comment_id")
      .notNull()
      .references(() => commentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
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
  "dislike",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade", onUpdate: "cascade"}),
    commentId: integer("comment_id")
      .notNull()
      .references(() => commentsTable.id, { onDelete: "cascade", onUpdate: "cascade" }),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
    commentIdIndex: index("comment_id_index").on(table.commentId),
    createdAtIndex: index("created_at_index").on(table.createdAt),
    constraint: unique("dislikes").on(table.commentId, table.userId),
  }),
);

