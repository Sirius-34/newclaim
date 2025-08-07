// AUTO-GENERATED from schema.prisma — DO NOT EDIT MANUALLY
export const tableRelations = {
  "Claim": {
    "authorId": {
      "refTable": "User",
      "refField": "id",
      "displayField": "name"
    },
    "yearAddedID": {
      "refTable": "sprYears",
      "refField": "id",
      "displayField": "id"
    }
  },
  "Document": {
    "claimId": {
      "refTable": "Claim",
      "refField": "id",
      "displayField": "id"
    }
  },
  "User": {
    "userGroupID": {
      "refTable": "sprUserGroup",
      "refField": "id",
      "displayField": "cUserGroupName"
    }
  }
} as const;
