import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { SignUpUserRoles, User } from 'src/users/entities/user.entity';
import { Candidate } from 'src/candidates/entities/candidate.entity';
import { SignUpDto } from './dto/sign-up-dto';
import { EmailService } from 'src/email/email.service';
import { SignInDto } from './dto/sign-in-dto';
import { MessageHelper } from 'src/helpers/message.helper';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    @InjectModel(Candidate.name)
    private candidateModel: mongoose.Model<Candidate>,
    @InjectModel(Company.name) private companyModel: mongoose.Model<Company>,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async signIn(signIn: SignInDto): Promise<{ token: string }> {
    const { email, password } = signIn;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException(MessageHelper.INVALID_CREDENTIALS);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException(MessageHelper.INVALID_CREDENTIALS);
    }

    if (!user.verifyed) {
      throw new UnauthorizedException(MessageHelper.UNVERIFIED_ACCOUNT);
    }

    const token = this.jwtService.sign({ id: user._id });

    return {
      token,
    };
  }

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
            active: true,
          },
        ],
        { session },
      );

      if (type === SignUpUserRoles.CANDIDATE) {
        await this.candidateModel.create([{ user: user[0]._id }], { session });
      } else if (type === SignUpUserRoles.COMNPANY) {
        await this.companyModel.create([{ user: user[0]._id }], { session });
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
      throw new BadRequestException(error);
    } finally {
      session.endSession();
    }
  }

  async sendVerificationLinkEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return new BadRequestException(MessageHelper.NOT_FOUND_ACCOUNT);
    }

    if (user.verifyed) {
      return new BadRequestException(MessageHelper.ALREADY_VERIFYED_ACCOUNT);
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

      if (user.verifyed) {
        throw new BadRequestException(MessageHelper.ALREADY_VERIFYED_ACCOUNT);
      }

      await user.updateOne({ verifyed: true, verifyHash: null });
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException(MessageHelper.EXPIRED_TOKEN);
      }
      throw new BadRequestException(MessageHelper.INVALID_TOKEN);
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
