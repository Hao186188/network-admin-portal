// scripts/check-bucket.ts
// SCRIPT KIỂM TRA BUCKET DOCUMENTS

import { supabase } from "../src/lib/db/supabase-client";

async function checkBucket() {
  console.log("🔍 Đang kiểm tra bucket documents...");

  try {
    // 1. List all buckets
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error("❌ Lỗi khi liệt kê buckets:", listError);
      return;
    }

    console.log("📁 Các buckets hiện có:");
    buckets?.forEach((b) => {
      console.log(`  - ${b.name} (${b.public ? "public" : "private"})`);
    });

    // 2. Check if documents bucket exists
    const bucketExists = buckets?.some((b) => b.name === "documents");

    if (!bucketExists) {
      console.log("⚠️ Bucket 'documents' chưa tồn tại. Đang tạo...");

      const { error: createError } = await supabase.storage.createBucket(
        "documents",
        {
          public: true,
          fileSizeLimit: 52428800, // 50MB
        },
      );

      if (createError) {
        console.error("❌ Lỗi khi tạo bucket:", createError);
        return;
      }

      console.log("✅ Đã tạo bucket 'documents' thành công!");
    } else {
      console.log("✅ Bucket 'documents' đã tồn tại");
    }

    // 3. Test upload a small file
    console.log("🧪 Đang test upload...");
    const testBlob = new Blob(["test content"], { type: "text/plain" });
    const testFile = new File([testBlob], "test.txt", { type: "text/plain" });

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload("test/test.txt", testFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ Lỗi test upload:", uploadError);
    } else {
      console.log("✅ Test upload thành công!");

      // Clean up test file
      await supabase.storage.from("documents").remove(["test/test.txt"]);
      console.log("🧹 Đã xóa file test");
    }
  } catch (error) {
    console.error("❌ Lỗi:", error);
  }
}

checkBucket();
