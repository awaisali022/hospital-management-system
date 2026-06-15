import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { env } from '../../config/env.js';

export class StorageService {
  private supabaseClient;
  private readonly useLocal: boolean;
  private readonly localUploadDir = path.resolve(process.cwd(), 'uploads');

  constructor() {
    const hasSupabase = !!(env.SUPABASE_URL && (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY));
    this.useLocal = !hasSupabase;

    if (hasSupabase) {
      this.supabaseClient = createClient(
        env.SUPABASE_URL!,
        env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY!
      );
      console.log('StorageService: Supabase Storage initialized.');
    } else {
      console.log('StorageService: Falling back to local disk storage.');
      if (!fs.existsSync(this.localUploadDir)) {
        fs.mkdirSync(this.localUploadDir, { recursive: true });
      }
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const ext = path.extname(file.originalname);
    const uniqueName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;

    if (this.useLocal) {
      const destinationFolder = path.join(this.localUploadDir, folder);
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true });
      }

      const filePath = path.join(destinationFolder, path.basename(uniqueName));
      await fs.promises.writeFile(filePath, file.buffer);
      
      const port = env.PORT || 5000;
      return `http://localhost:${port}/uploads/${uniqueName}`;
    } else {
      const bucket = 'doctorhub';
      
      // Upload to Supabase Storage
      const { data, error } = await this.supabaseClient!.storage
        .from(bucket)
        .upload(uniqueName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = this.supabaseClient!.storage
        .from(bucket)
        .getPublicUrl(uniqueName);

      return urlData.publicUrl;
    }
  }

  async uploadBuffer(buffer: Buffer, originalName: string, mimetype: string, folder: string): Promise<string> {
    const ext = path.extname(originalName);
    const uniqueName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;

    if (this.useLocal) {
      const destinationFolder = path.join(this.localUploadDir, folder);
      if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true });
      }

      const filePath = path.join(destinationFolder, path.basename(uniqueName));
      await fs.promises.writeFile(filePath, buffer);
      
      const port = env.PORT || 5000;
      return `http://localhost:${port}/uploads/${uniqueName}`;
    } else {
      const bucket = 'doctorhub';
      
      const { data, error } = await this.supabaseClient!.storage
        .from(bucket)
        .upload(uniqueName, buffer, {
          contentType: mimetype,
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      const { data: urlData } = this.supabaseClient!.storage
        .from(bucket)
        .getPublicUrl(uniqueName);

      return urlData.publicUrl;
    }
  }
}
