import { pgTable, varchar, uuid, boolean, timestamp, integer, text, jsonb, pgEnum, index, unique, foreignKey, primaryKey, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const contestStatusEnum = pgEnum('ContestStatus', ['UPCOMING', 'ACTIVE', 'COMPLETED']);
export const difficultyEnum = pgEnum('Difficulty', ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'VERYHARD']);
export const questionPlatformEnum = pgEnum('QuestionPlatform', ['LEETCODE', 'CODEFORCES']);
export const submissionStatusEnum = pgEnum('SubmissionStatus', [
  'PENDING',
  'ACCEPTED',
  'WRONG_ANSWER',
  'TIME_LIMIT_EXCEEDED',
  'MEMORY_LIMIT_EXCEEDED',
  'RUNTIME_ERROR',
  'COMPILATION_ERROR'
]);
export const applicationStatusEnum = pgEnum('ApplicationStatus', ['PENDING', 'ACCEPTED', 'REJECTED']);
export const rankEnum = pgEnum('Rank', [
  'novice_1',
  'novice_2',
  'learner_1',
  'learner_2',
  'competent_1',
  'advanced',
  'expert'
]);

// Tables
export const UserApiKey = pgTable('UserApiKey', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  key: varchar('key').notNull().unique(),
  userId: varchar('userId').notNull().unique(),
});

export const User = pgTable('User', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: varchar('username').notNull().unique(),
  email: varchar('email').notNull().unique(),
  password: varchar('password').notNull(),
  leetcodeUsername: varchar('leetcodeUsername').unique(),
  isComplete: boolean('isComplete'),
  codeforcesUsername: varchar('codeforcesUsername').unique(),
  section: varchar('section'),
  enrollmentNum: varchar('enrollmentNum').unique(),
  profileUrl: varchar('profileUrl'),
  groupId: varchar('groupId'),
  individualPoints: integer('individualPoints').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  groupIdIdx: index('User_groupId_idx').on(table.groupId),
}));

export const TempContestQuestion = pgTable('TempContestQuestion', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  contestId: integer('contestId').notNull(),
});

export const Group = pgTable('Group', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name').notNull().unique(),
  coordinatorId: varchar('coordinatorId').notNull().unique(),
  groupPoints: integer('groupPoints').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  coordinatorIdIdx: index('Group_coordinatorId_idx').on(table.coordinatorId),
}));

export const GroupPermission = pgTable('GroupPermission', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  groupId: varchar('groupId').notNull(),
  contestId: integer('contestId').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  groupIdContestIdUnique: unique('GroupPermission_groupId_contestId_key').on(table.groupId, table.contestId),
}));

export const Contest = pgTable('Contest', {
  id: serial('id').primaryKey(),
  startTime: timestamp('startTime').notNull(),
  name: varchar('name').default('Contest'),
  endTime: timestamp('endTime').notNull(),
  status: contestStatusEnum('status').default('UPCOMING'),
  duration: integer('duration').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  statusStartTimeIdx: index('Contest_status_startTime_idx').on(table.status, table.startTime),
}));

export const TempContestTime = pgTable('TempContestTime', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  contestId: integer('contestId').notNull(),
  endTime: timestamp('endTime').notNull(),
  userId: varchar('userId').notNull(),
});

export const GroupOnContest = pgTable('GroupOnContest', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  groupId: varchar('groupId').notNull(),
  contestId: integer('contestId').notNull(),
  score: integer('score').default(0),
  rank: integer('rank'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  groupIdContestIdUnique: unique('GroupOnContest_groupId_contestId_key').on(table.groupId, table.contestId),
  contestIdScoreIdx: index('GroupOnContest_contestId_score_idx').on(table.contestId, table.score),
}));

export const questions = pgTable('questions', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  leetcodeUrl: varchar('leetcodeUrl').unique(),
  codeforcesUrl: varchar('codeforcesUrl').unique(),
  difficulty: difficultyEnum('difficulty').notNull(),
  points: integer('points').notNull(),
  inContest: boolean('inContest').default(false),
  inArena: boolean('inArena').default(false),
  arenaAddedAt: timestamp('arenaAddedAt'),
  slug: varchar('slug').notNull().unique(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
  teachingMeta: jsonb('teachingMeta'),
}, (table) => ({
  inArenaArenaAddedAtIdx: index('questions_inArena_arenaAddedAt_idx').on(table.inArena, table.arenaAddedAt),
}));

export const QuestionTag = pgTable('QuestionTag', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name').notNull().unique(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const Bookmark = pgTable('Bookmark', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('userId').notNull(),
  questionId: varchar('questionId').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  userIdQuestionIdUnique: unique('Bookmark_userId_questionId_key').on(table.userId, table.questionId),
  userIdIdx: index('Bookmark_userId_idx').on(table.userId),
  questionIdIdx: index('Bookmark_questionId_idx').on(table.questionId),
}));

export const Hintnew = pgTable('Hintnew', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  tagHintId: varchar('tagHintId').default('default'),
  content: varchar('content').default('Default content'),
  sequence: integer('sequence').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  tagHintIdSequenceUnique: unique('Hintnew_tagHintId_sequence_key').on(table.tagHintId, table.sequence),
  tagHintIdSequenceIdx: index('Hintnew_tagHintId_sequence_idx').on(table.tagHintId, table.sequence),
}));

export const QuestionOnContest = pgTable('QuestionOnContest', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  contestId: integer('contestId'),
  questionId: varchar('questionId').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  contestIdQuestionIdUnique: unique('QuestionOnContest_contestId_questionId_key').on(table.contestId, table.questionId),
}));

export const TagHint = pgTable('TagHint', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  questionId: varchar('questionId').notNull(),
  tagId: varchar('tagId').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  questionIdTagIdUnique: unique('TagHint_questionId_tagId_key').on(table.questionId, table.tagId),
  questionIdIdx: index('TagHint_questionId_idx').on(table.questionId),
  tagIdIdx: index('TagHint_tagId_idx').on(table.tagId),
}));

export const TagHintRating = pgTable('TagHintRating', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('userId').notNull(),
  tagHintId: varchar('tagHintId').notNull(),
  isHelpful: boolean('isHelpful').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  userIdTagHintIdUnique: unique('TagHintRating_userId_tagHintId_key').on(table.userId, table.tagHintId),
  tagHintIdIdx: index('TagHintRating_tagHintId_idx').on(table.tagHintId),
  userIdIdx: index('TagHintRating_userId_idx').on(table.userId),
  tagHintIdIsHelpfulIdx: index('TagHintRating_tagHintId_isHelpful_idx').on(table.tagHintId, table.isHelpful),
}));

export const Hint = pgTable('Hint', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  questionId: varchar('questionId').notNull().unique(),
  hint1: varchar('hint1').notNull(),
  hint2: varchar('hint2').notNull(),
  hint3: varchar('hint3').notNull(),
});

export const Submission = pgTable('Submission', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('userId').notNull(),
  questionId: varchar('questionId').notNull(),
  status: submissionStatusEnum('status').notNull(),
  language: varchar('language').notNull(),
  code: text('code').notNull(),
  runtime: integer('runtime'),
  memory: integer('memory'),
  submittedAt: timestamp('submittedAt').defaultNow(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  userIdQuestionIdIdx: index('Submission_userId_questionId_idx').on(table.userId, table.questionId),
  questionIdIdx: index('Submission_questionId_idx').on(table.questionId),
  userIdIdx: index('Submission_userId_idx').on(table.userId),
}));

export const questionToQuestionTag = pgTable('QuestionToQuestionTag', {
  questionId: varchar('questionId').notNull(),
  tagId: varchar('tagId').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.questionId, table.tagId] }),
}));

export const questionsRelations = relations(questions, ({ many }) => ({
  tags: many(questionToQuestionTag),
}));

export const questionTagRelations = relations(QuestionTag, ({ many }) => ({
  questions: many(questionToQuestionTag),
}));

export const questionToQuestionTagRelations = relations(questionToQuestionTag, ({ one }) => ({
  question: one(questions, {
    fields: [questionToQuestionTag.questionId],
    references: [questions.id],
  }),
  tag: one(QuestionTag, {
    fields: [questionToQuestionTag.tagId],
    references: [QuestionTag.id],
  }),
}));

export const UserConfig = pgTable('UserConfig', {
  id: varchar('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar('userId').notNull().unique(),
  theme: varchar('theme').default('light'),
  notifications: boolean('notifications').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}); 