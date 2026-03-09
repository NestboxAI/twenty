import { Module } from '@nestjs/common';

import { OperatingModelResolver } from 'src/engine/core-modules/operating-model/operating-model.resolver';
import { BoilerplateService } from 'src/engine/core-modules/operating-model/services/boilerplate.service';
import { DeployService } from 'src/engine/core-modules/operating-model/services/deploy.service';
import { FileValidationService } from 'src/engine/core-modules/operating-model/services/file-validation.service';
import { GitService } from 'src/engine/core-modules/operating-model/services/git.service';
import { OperatingModelService } from 'src/engine/core-modules/operating-model/services/operating-model.service';
import { SshKeyService } from 'src/engine/core-modules/operating-model/services/ssh-key.service';

@Module({
  providers: [
    GitService,
    SshKeyService,
    DeployService,
    OperatingModelService,
    FileValidationService,
    BoilerplateService,
    OperatingModelResolver,
  ],
  exports: [OperatingModelService],
})
export class OperatingModelModule {}
