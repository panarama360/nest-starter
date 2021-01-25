import {Injectable} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {PrismaService} from "../prisma/prisma.service";
import { AppRoles } from "../role/roles";
import { RedisService } from 'nestjs-redis';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';
@Injectable()
export class AuthService{
    constructor(private readonly prisma: PrismaService, private readonly redis: RedisService, private readonly emailService: EmailService) {
    }

    async login(email: string, password: string){
        const user = await this.prisma.user.findFirst({
            where: {
                email,
                confirmation: true
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
        const token = crypto.randomBytes(64).toString('hex');
        await this.redis.getClient().set(token, user.id);
        this.emailService.sendConfirmEmail(email, token);
        return true;
    }

    async emailConfirmation(token: string) {
        const userId = await this.redis.getClient().get(token);
        if(!userId) throw new Error('not_found');
        await this.prisma.user.update({
            where: {
                id: +userId
            },
            data: {
                confirmation: true
            }
        });
        const user = await this.prisma.user.findUnique({
            where: {
                id: +userId
            }
        })
        return jwt.sign({ id: user.id, registrationAt: user.createdAt, email: user.email }, process.env.JWT_SECRET);
    }
}