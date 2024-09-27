import { Controller, Module } from "@nestjs/common";
import { ImageController } from "./controllers/image.controller";
import { ImageService } from "./service/image.service";

@Module(
    {
        controllers: [ImageController],
        providers: [ImageService],
    }
)
export class ImageModule {}
