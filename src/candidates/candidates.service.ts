import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { Candidate } from './entities/candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name)
    private candidateModel: mongoose.Model<Candidate>,
  ) {}

  findAll() {
    return `This action returns all candidates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} candidate`;
  }

  update(id: number, updateCandidateDto: UpdateCandidateDto) {
    return `This action updates a #${id} candidate`;
  }

  remove(id: number) {
    return `This action removes a #${id} candidate`;
  }
}
