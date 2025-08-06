UPDATE "User" SET "userGroupID" = (SELECT "id" FROM "sprUserGroup" WHERE "sprUserGroup"."cUserGroupName"='Users')
    WHERE "userGroupID" IS NULL;
