import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor() {}

    async signup() {
        return { message: "signup" };
    }

    async signin() {
        return "s";
    }

    async signout() {
        return "s";
    }


}
