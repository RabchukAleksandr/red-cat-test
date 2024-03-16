import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: [".development.env", ".production.env"] }), DatabaseModule],
  controllers: [],
  providers: []
})
export class AppModule {
}