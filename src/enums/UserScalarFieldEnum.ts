import * as TypeGraphQL from "@nestjs/graphql";

export enum UserScalarFieldEnum {
  id = "id",
  email = "email",
  name = "name",
  password = "password",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  roles = "roles"
}
TypeGraphQL.registerEnumType(UserScalarFieldEnum, {
  name: "UserScalarFieldEnum",
  description: undefined,
});
