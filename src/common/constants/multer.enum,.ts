import { Express } from "express"

export interface MulterFileType {
    license_front: Express.Multer.File,
    license_back: Express.Multer.File,
    insurance: Express.Multer.File[],
    mc_dot: Express.Multer.File[],
    w9_form?: Express.Multer.File[]
  }
  