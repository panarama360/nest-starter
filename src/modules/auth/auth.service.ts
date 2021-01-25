import {Injectable} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {PrismaService} from "../prisma/prisma.service";
import { AppRoles } from "../role/roles";
import { RedisService } from 'nestjs-redis';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';
import {User} from '@prisma/client'
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
        this.emailService.sendConfirmEmail(email, await this.createToken(user));
        return true;
    }

    async emailConfirmation(token: string) {
        const user = await this.getUserByToken(token);
        if(!user) throw new Error('not_found');
        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                confirmation: true
            }
        });

        return jwt.sign({ id: user.id, registrationAt: user.createdAt, email: user.email }, process.env.JWT_SECRET);
    }

    async getUserByToken(token: string){
        const keys= await this.redis.getClient().keys(`${token}:*`);
        if(!keys.length) return;
        const userId = +keys[0];
        await Promise.all(keys.map(item => this.redis.getClient().del(item)))
        return this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
    }

    async createToken(user: User){
        const token = crypto.randomBytes(64).toString('hex');
        await this.redis.getClient().keys(`${token}:*`).then(value => Promise.all(value.map(item => this.redis.getClient().del(item))));
        await this.redis.getClient().set(`${token}:${user.email}`, user.id);
        return token;
    }

    async repeatEmailConfirmation(email: string) {

        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if(!user) throw new Error('not_found');
        const keys= await this.redis.getClient().keys(`*:${email}`);
        await Promise.all(keys.map(item => this.redis.getClient().del(item)))
        this.emailService.sendConfirmEmail(email, await this.createToken(user));
    }
}