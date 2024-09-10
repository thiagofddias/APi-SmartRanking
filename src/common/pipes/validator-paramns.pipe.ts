import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ValidatorParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log(`value ${value} and metadata ${metadata}`);

    if (!value) {
      throw new BadRequestException(`The value of ${metadata.data} is empty`);
    }

    return value;
  }
}
