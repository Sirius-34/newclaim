-- Filling guide "sprUserGroup"

INSERT INTO "sprUserGroup" ("id", "cUserGroupName") VALUES
(gen_random_uuid(), 'Administrators'),
(gen_random_uuid(), 'Advanced Users'),
(gen_random_uuid(), 'Users'),
(gen_random_uuid(), '-');

-- Partial filling guide "Users"

INSERT INTO "User" ("id", "nick", "email", "name", "password", "createdAt", "permissions", "userGroupID") VALUES
(gen_random_uuid(), 'admin1', 'admin1@example.com', 'admin1', 'ce1a358b0f2c9b031be947fc80f1c736268f0d2b9ca152b81763768370ea695a', DEFAULT, 
    '{ALL}', (SELECT "id" FROM "sprUserGroup" WHERE "sprUserGroup"."cUserGroupName"='Administrators')),
(gen_random_uuid(), 'admin2', 'admin2@example.com', 'admin2', 'ce1a358b0f2c9b031be947fc80f1c736268f0d2b9ca152b81763768370ea695a', DEFAULT, 
    '{ALL}', (SELECT "id" FROM "sprUserGroup" WHERE "sprUserGroup"."cUserGroupName"='Administrators')),
(gen_random_uuid(), 'user01', 'user01@example.com', 'user02', 'ce1a358b0f2c9b031be947fc80f1c736268f0d2b9ca152b81763768370ea695a', DEFAULT, 
    '{ALL}', (SELECT "id" FROM "sprUserGroup" WHERE "sprUserGroup"."cUserGroupName"='Advanced Users')),
(gen_random_uuid(), 'user02', 'user02@example.com', 'user02', 'ce1a358b0f2c9b031be947fc80f1c736268f0d2b9ca152b81763768370ea695a', DEFAULT, 
    '{ALL}', (SELECT "id" FROM "sprUserGroup" WHERE "sprUserGroup"."cUserGroupName"='Users'));