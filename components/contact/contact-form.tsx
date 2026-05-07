"use client";

import { FormEvent, useState } from "react";

const initialState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type FormState = typeof initialState;

type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setFeedback(null);
    setErrors([]);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (!response.ok || result.ok === false) {
        setStatus("error");
        setErrors(result.errors ?? ["No se pudo enviar el mensaje. Intenta más tarde."]);
        return;
      }

      setStatus("success");
      setFeedback(result.message ?? "Mensaje enviado con éxito.");
      setValues(initialState);
    } catch (error) {
      setStatus("error");
      setErrors(["Error de red. Verifica tu conexión e intenta nuevamente."]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-border-subtle bg-surface p-6 shadow-sm shadow-slate-900/5 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-ink">
          Nombre
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange("name")}
            className="w-full rounded-2xl border border-border-subtle bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Tu nombre"
            required
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-ink">
          Correo electrónico
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange("email")}
            className="w-full rounded-2xl border border-border-subtle bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="nombre@ejemplo.com"
            required
          />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-ink">
        Asunto
        <input
          type="text"
          name="subject"
          value={values.subject}
          onChange={handleChange("subject")}
          className="w-full rounded-2xl border border-border-subtle bg-canvas px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="¿En qué podemos ayudarte?"
          required
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-ink">
        Mensaje
        <textarea
          name="message"
          value={values.message}
          onChange={handleChange("message")}
          rows={6}
          className="w-full rounded-3xl border border-border-subtle bg-canvas px-4 py-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="Escribe aquí tu solicitud, pregunta o comentario..."
          required
        />
      </label>

      {errors.length > 0 ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Por favor corrige lo siguiente:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {feedback ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {feedback}
        </div>
      ) : null}

      <button
        type="submit"
        className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-3xl bg-ink px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-900/10 transition hover:bg-void-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:w-auto"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
