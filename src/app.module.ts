import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AaaModule } from './aaa/aaa.module';
import { BbbModule } from './bbb/bbb.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      async useFactory(configService: ConfigService) {
        return {
          host: configService.get('application.db.host'),
          port: configService.get('application.db.port'),
          type: 'mysql',
          username: configService.get('application.db.root'),
          password: configService.get('application.db.password'),
          database: configService.get('application.db.database'),
          entities: [User],
          synchronize: true,
          logging: true,
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: { authPlugin: 'sha256_password' },
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      async useFactory(configService: ConfigService) {
        return {
          global: true,
          secret: configService.get('application.jwt.secret'),
          signOptions: {
            expiresIn: configService.get('application.jwt.expiresIn'),
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AaaModule,
    BbbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
}
