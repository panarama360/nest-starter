import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {AuthService} from "./auth.service";
import {UseGuards} from "@nestjs/common";
import {AuthGuard} from "../../guards/auth.guard";
import { CurrentUser } from "src/functions/decorators";
import { User as UserPrisma } from "@prisma/client";
import { UseRoles } from "nest-access-control";
import { AcGuard } from "../../guards/ac.guard";
import { User } from '../../models/User';

@Resolver()
export class AuthResolver{

    constructor(private readonly authService: AuthService ) {}

    @Mutation(of => String)
    login(@Args('email') email: string, @Args('pass') password: string){
        return this.authService.login(email, password);
    }

    @Mutation(of => Boolean)
    registration(@Args('email') email: string, @Args('pass') password: string){
        return this.authService.registration(email, password);
    }

    @Mutation(of => String)
    emailConfirmation(@Args('token') token: string){
        return this.authService.emailConfirmation(token);
    }

    @Mutation(of => String)
    repeatEmailConfirmation(@Args('email') email: string){
        return this.authService.repeatEmailConfirmation(email);
    }

    @UseGuards(AuthGuard)
    @Query(returns => User)
    me(@CurrentUser() user: UserPrisma){
        return user;
    }
}