import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRoles } from 'src/users/entities/user.entity';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Roles(UserRoles.COMPANY)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('me')
  me(@Request() req) {
    return this.companyService.findOne(req.user._id);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
