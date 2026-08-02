/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _shared_auth from "../_shared/auth.js";
import type * as adminPanel_aiConfig from "../adminPanel_aiConfig.js";
import type * as adminPanel_analytics from "../adminPanel_analytics.js";
import type * as adminPanel_auditLog from "../adminPanel_auditLog.js";
import type * as adminPanel_settings from "../adminPanel_settings.js";
import type * as adminPanel_users from "../adminPanel_users.js";
import type * as adminPanel_webhooks from "../adminPanel_webhooks.js";
import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as backup from "../backup.js";
import type * as changelog from "../changelog.js";
import type * as customers from "../customers.js";
import type * as featureMatrix from "../featureMatrix.js";
import type * as features from "../features.js";
import type * as features_aiChat_action from "../features/aiChat/action.js";
import type * as features_comments__schema from "../features/comments/_schema.js";
import type * as features_comments_mutation from "../features/comments/mutation.js";
import type * as features_comments_public from "../features/comments/public.js";
import type * as features_comments_query from "../features/comments/query.js";
import type * as features_notion__schema from "../features/notion/_schema.js";
import type * as features_notion_mutation from "../features/notion/mutation.js";
import type * as features_notion_query from "../features/notion/query.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as integrations from "../integrations.js";
import type * as landing from "../landing.js";
import type * as leads from "../leads.js";
import type * as pages from "../pages.js";
import type * as posts from "../posts.js";
import type * as pricing from "../pricing.js";
import type * as pricingFaq from "../pricingFaq.js";
import type * as pricingMatrix from "../pricingMatrix.js";
import type * as seed from "../seed.js";
import type * as settings from "../settings.js";
import type * as setup from "../setup.js";
import type * as subscribers from "../subscribers.js";
import type * as subscriptions from "../subscriptions.js";
import type * as update from "../update.js";
import type * as useCases from "../useCases.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "_shared/auth": typeof _shared_auth;
  adminPanel_aiConfig: typeof adminPanel_aiConfig;
  adminPanel_analytics: typeof adminPanel_analytics;
  adminPanel_auditLog: typeof adminPanel_auditLog;
  adminPanel_settings: typeof adminPanel_settings;
  adminPanel_users: typeof adminPanel_users;
  adminPanel_webhooks: typeof adminPanel_webhooks;
  analytics: typeof analytics;
  auth: typeof auth;
  backup: typeof backup;
  changelog: typeof changelog;
  customers: typeof customers;
  featureMatrix: typeof featureMatrix;
  features: typeof features;
  "features/aiChat/action": typeof features_aiChat_action;
  "features/comments/_schema": typeof features_comments__schema;
  "features/comments/mutation": typeof features_comments_mutation;
  "features/comments/public": typeof features_comments_public;
  "features/comments/query": typeof features_comments_query;
  "features/notion/_schema": typeof features_notion__schema;
  "features/notion/mutation": typeof features_notion_mutation;
  "features/notion/query": typeof features_notion_query;
  files: typeof files;
  http: typeof http;
  integrations: typeof integrations;
  landing: typeof landing;
  leads: typeof leads;
  pages: typeof pages;
  posts: typeof posts;
  pricing: typeof pricing;
  pricingFaq: typeof pricingFaq;
  pricingMatrix: typeof pricingMatrix;
  seed: typeof seed;
  settings: typeof settings;
  setup: typeof setup;
  subscribers: typeof subscribers;
  subscriptions: typeof subscriptions;
  update: typeof update;
  useCases: typeof useCases;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
