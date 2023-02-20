import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { SignUpUserTypes, User } from 'src/users/entities/user.entity';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { SignUpDto } from './dto/sign-up-dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    @InjectModel(Candidate.name)
    private candidateModel: mongoose.Model<Candidate>,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async signUp(signUp: SignUpDto): Promise<{ email: string; name: string }> {
    const session = await this.connection.startSession();

    await session.startTransaction();

    try {
      const { name, email, password, type } = signUp;
      const hashedPassword = await bcrypt.hash(password, 10);
      const verifyHash = this.generateConfirmationToken(email);

      const user = await this.userModel.create(
        [
          {
            name,
            email,
            type,
            password: hashedPassword,
            verifyHash,
          },
        ],
        { session },
      );

      if (type === SignUpUserTypes.CANDIDATE) {
        await this.candidateModel.create([{ user: user[0]._id }], { session });
      } else {
        throw new BadRequestException();
      }

      await session.commitTransaction();

      this.sendVerificationLinkEmail(email);

      return {
        name,
        email,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async sendVerificationLinkEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return new BadRequestException('user not found');
    }

    if (user.active) {
      return new BadRequestException('already active account');
    }

    try {
      const url = `${process.env.CONFIRMATION_EMAIL_URL}?token=${user.verifyHash}`;
      const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

      return this.emailService.sendMail({
        to: email,
        subject: 'Email confirmation',
        text,
      });
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token) {
    try {
      const { email } = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!email) {
        throw new BadRequestException();
      }

      const user = await this.userModel.findOne({ email });

      if (user.active) {
        throw new BadRequestException('Email already confirmed');
      }

      await user.updateOne({ active: true, verifyHash: null });
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  generateConfirmationToken(email) {
    const token = this.jwtService.sign(
      { email },
      {
        secret: process.env.JWT_SECRET,
      },
    );

    return token;
  }
}
