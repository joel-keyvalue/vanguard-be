import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  handleEmailOpened(id: string) {
    console.log('Email was opened by ', id);
  }
}
