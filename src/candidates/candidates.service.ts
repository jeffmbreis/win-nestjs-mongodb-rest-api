import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { Candidate } from './entities/candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name)
    private candidateModel: mongoose.Model<Candidate>,
  ) {}

  findAll() {
    return this.candidateModel.find().populate('user', 'email name');
  }

  findOne(id: string) {
    return this.candidateModel
      .findById(id)
      .populate('user', '-password -verifyHash');
  }

  update(id: number, updateCandidateDto: UpdateCandidateDto) {
    return `This action updates a #${id} candidate`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidate`;
  }
}
