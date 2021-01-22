import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {AuthService} from "./auth.service";
import {UseGuards} from "@nestjs/common";
import {AuthGuard} from "../../guards/auth.guard";
import { CurrentUser } from "src/functions/decorators";
import { User } from "@prisma/client";
import { UseRoles } from "nest-access-control";
import { AcGuard } from "../../guards/ac.guard";

@Resolver()
export class AuthResolver{

    constructor(private readonly authService: AuthService ) {}

    @Mutation(of => String)
    login(@Args('email') email: string, @Args('pass') password: string){
        return this.authService.login(email, password);
    }

    @Mutation(of => String)
    registration(@Args('email') email: string, @Args('pass') password: string){
        return this.authService.registration(email, password);
    }

    @UseGuards(AuthGuard)
    @Query(returns => String)
    me(@CurrentUser() user: User){
        return user;
    }


    @UseGuards(AuthGuard, AcGuard)
    @UseRoles({
        resource: 'video',
        action: "create",
        possession: "own",
      })
    @Query(returns => String)
    test() {
        return 'hello';
    }
}