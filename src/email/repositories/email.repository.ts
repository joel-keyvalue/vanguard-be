import { Injectable } from '@nestjs/common';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Email } from 'email/entities/email.entity';

@Injectable()
export class EmailRepository {
  protected emailRepository: Repository<Email>;

  constructor(dataSource: DataSource) {
    this.emailRepository = dataSource.getRepository(Email);
  }

  createEmailEntity(email: DeepPartial<Email>) {
    return this.emailRepository.create(email);
  }

  async createEmail(email: Partial<Email>): Promise<Email> {
    return this.emailRepository.save(email);
  }

  async findOneEmail(id: string): Promise<Email> {
    return this.emailRepository.findOne({ where: { id } });
  }

  async update(id: string, updates: Partial<Email>): Promise<Email> {
    return this.emailRepository.save({ id, ...updates });
  }
}
