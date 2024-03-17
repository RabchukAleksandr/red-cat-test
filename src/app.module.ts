import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: [".development.env", ".production.env"] }), DatabaseModule, ArticlesModule, UsersModule],
  controllers: [],
  providers: []
})
export class AppModule {
}
