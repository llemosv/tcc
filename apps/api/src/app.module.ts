import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as schema from 'src/shared/database/schema';
import { NestDrizzleModule } from './shared/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PeopleModule } from './modules/people/people.module';
import { TccGuidancesModule } from './modules/tcc-guidances/tcc-guidances.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    AuthModule,
    PeopleModule,
    TccGuidancesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgres-js',
          url: process.env.DATABASE_URL,
          options: { schema },
          migrationOptions: { migrationsFolder: './migration' },
        };
      },
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
