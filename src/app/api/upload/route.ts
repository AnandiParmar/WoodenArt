import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get parameters from URL
    const url = new URL(request.url);
    const scope = url.searchParams.get('scope') || 'file';
    const id = url.searchParams.get('id') || Date.now().toString();
    const index = url.searchParams.get('index'); // For gallery images

    const original = file.name || 'upload';
    const dot = original.lastIndexOf('.');
    const ext = dot > -1 ? original.substring(dot).toLowerCase() : '';

    // Generate filename based on scope
    let filename: string;
    let folderPath: string;

    if (scope === 'product') {
      // Feature image: product-[productid].ext
      filename = `product-${id}${ext}`;
      folderPath = join(process.cwd(), 'public/uploads/product', id);
    } else if (scope === 'product_gallery') {
      // Gallery image: product-sub-[idx]-[productid].ext
      filename = `product-sub-${index || '0'}-${id}${ext}`;
      folderPath = join(process.cwd(), 'public/uploads/product', id);
    } else {
      // Default naming
      filename = `${scope}_${id}${ext}`;
      folderPath = join(process.cwd(), 'public/uploads');
    }

    // Create directory if it doesn't exist
    await mkdir(folderPath, { recursive: true });

    // Full file path
    const filePath = join(folderPath, filename);
    await writeFile(filePath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/product/${id}/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      filename: filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload file' 
    });
  }
}
