"use server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Nama wajib diisi"),
    email: z.string().trim().toLowerCase().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    passwordConfirmation: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["passwordConfirmation"],
  });

export async function registerUser(formData: FormData) {
  // 1. Validasi input dengan safeParse 
  const validated = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!validated.success) {
    // Ambil pesan error pertama dari Zod 4 (menggunakan issues)
    return { error: validated.error.issues[0]?.message ?? "Data input tidak valid" };
  }

  const { name, email, password } = validated.data;

  try {
    // 2. Cek apakah email sudah terdaftar
    const existUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existUser) {
      return { error: "Email sudah terdaftar" };
    }

    // 3. Hash password dan simpan user baru
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Register error:", error);
    return { error: "Terjadi kesalahan pada server saat registrasi" };
  }
}
