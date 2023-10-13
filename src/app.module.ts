import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AaaModule } from './aaa/aaa.module';
import { BbbModule } from './bbb/bbb.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      host: 'localhost',
      port: 3309,
      type: 'mysql',
      username: 'root',
      password: 'Jy06020228!',
      database: 'token_test',
      entities: [User],
      synchronize: true,
      logging: true,
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: { authPlugin: 'sha256_password' },
    }),
    JwtModule.register({
      global: true,
      secret: 'gray',
      signOptions: { expiresIn: '30m' },
    }),
    AaaModule,
    BbbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
