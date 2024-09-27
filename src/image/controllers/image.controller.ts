import { Controller, Get, Next, Param, Res } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { ImageService } from "../service/image.service";

@Controller({
    path: "email",
})
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getHello(): string {
    return "123";
  }
}