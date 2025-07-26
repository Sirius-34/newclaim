INSERT INTO "Claim" ("id", "serialNumber", description, "text", "createdAt", "authorId", "updatedAt") VALUES
(gen_random_uuid(), default, 'description 1', 'text 1', CURRENT_TIMESTAMP, (SELECT "id" FROM "User" WHERE "User"."nick"='admin1'), CURRENT_TIMESTAMP),
(gen_random_uuid(), default, 'description 2', 'text 2', CURRENT_TIMESTAMP, (SELECT "id" FROM "User" WHERE "User"."nick"='admin2'), CURRENT_TIMESTAMP),
(gen_random_uuid(), default, 'description 3', 'text 3', CURRENT_TIMESTAMP, (SELECT "id" FROM "User" WHERE "User"."nick"='user01'), CURRENT_TIMESTAMP),
(gen_random_uuid(), default, 'description 4', 'text 4', CURRENT_TIMESTAMP, (SELECT "id" FROM "User" WHERE "User"."nick"='user02'), CURRENT_TIMESTAMP)