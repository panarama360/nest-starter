import {Injectable} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {PrismaService} from "../prisma/prisma.service";
import { AppRoles } from "../role/roles";

@Injectable()
export class AuthService{
    constructor(private readonly prisma: PrismaService) {
    }

    async login(email: string, password: string){
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            }
        });
        if(!user) throw new Error('user_error');
        const isPasswordMatching = await bcrypt.compare(
            password,
            user.password
        );
        if(!isPasswordMatching) throw new Error('user_error');
        return jwt.sign({ id: user.id, registrationAt: user.createdAt, email: user.email }, process.env.JWT_SECRET);
    }

    async registration(email: string, password: string){
        if(await this.prisma.user.findUnique({
            where: {
                email,
            }
        })) throw new Error('user_exist');
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                roles: [AppRoles.USER_CREATE_ANY_VIDEO]
            }
        });
        return jwt.sign({ id: user.id, registrationAt: user.createdAt, email: user.email }, process.env.JWT_SECRET);
    }
}