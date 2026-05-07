import { NextResponse } from "next/server";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function validate(data: ContactPayload) {
  const errors: string[] = [];

  if (!data.name?.trim()) errors.push("El nombre es obligatorio.");
  if (!data.email?.trim()) {
    errors.push("El correo electrónico es obligatorio.");
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    errors.push("El correo electrónico no tiene un formato válido.");
  }
  if (!data.subject?.trim()) errors.push("El asunto es obligatorio.");
  if (!data.message?.trim()) errors.push("El mensaje es obligatorio.");
  if (data.message?.trim().length < 20) errors.push("El mensaje debe tener al menos 20 caracteres.");

  return errors;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as ContactPayload;
    const errors = validate(data);

    if (errors.length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    // Aquí puedes conectar con un servicio de correo o enviar a una base de datos.
    console.log("Nuevo mensaje de contacto:", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Gracias por tu mensaje. Pronto nos pondremos en contacto contigo.",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, errors: ["Error en el envío. Intenta nuevamente más tarde."] },
      { status: 500 },
    );
  }
}
