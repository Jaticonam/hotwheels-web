import type {
  QuotationWhatsAppOutputRequest,
} from "@/application/quotation/QuotationOutput";

function formatMoney(
  value: number,
): string {
  return value.toFixed(2);
}

/**
 * Normaliza un número para wa.me.
 *
 * Hot Wheels opera inicialmente en Perú:
 * un celular local de 9 dígitos se convierte a 51 + número.
 * Los números que ya contienen prefijo internacional se preservan.
 */
export function normalizeQuotationWhatsAppPhone(
  value: string,
): string {
  const digits =
    value.replace(
      /\D/g,
      "",
    );

  if (/^9\d{8}$/.test(digits)) {
    return `51${digits}`;
  }

  return digits;
}

/**
 * Construye el mensaje comercial desde el snapshot Q5A.
 *
 * No consulta Product, pricing ni stock actual:
 * todos los valores económicos proceden de la cotización.
 */
export function buildQuotationWhatsAppMessage(
  request:
    QuotationWhatsAppOutputRequest,
): string {
  const {
    snapshot,
  } = request;

  const {
    composition,
    commercialContext,
    summary,
  } = snapshot;

  const lines: string[] = [
    "*Cotización Hot Wheels*",
    "",
    `Hola ${commercialContext.customer.name}, te compartimos tu cotización.`,
  ];

  if (snapshot.quotationId) {
    lines.push(
      `Referencia: ${snapshot.quotationId}`,
    );
  }

  lines.push(
    `Cotización: ${composition.title}`,
    "",
    "*Productos*",
  );

  composition.lines.forEach(
    (line, index) => {
      lines.push(
        `${index + 1}. ${line.title}`,
        `Código: ${line.productId}`,
        `Cantidad: ${line.quantity}`,
        `Precio unitario: S/ ${formatMoney(line.unitPrice)}`,
        `Subtotal: S/ ${formatMoney(line.subtotal)}`,
        "",
      );
    },
  );

  lines.push(
    `Productos: ${summary.products}`,
    `Unidades: ${summary.units}`,
  );

  if (summary.savings > 0) {
    lines.push(
      `Ahorro por ofertas: S/ ${formatMoney(summary.savings)}`,
    );
  }

  lines.push(
    `*TOTAL: S/ ${formatMoney(summary.total)}*`,
    "",
    `Emitida: ${commercialContext.terms.issuedOn}`,
    `Válida hasta: ${commercialContext.terms.validUntil}`,
  );

  if (
    commercialContext.terms.notes
      .trim()
      .length > 0
  ) {
    lines.push(
      `Observaciones: ${commercialContext.terms.notes}`,
    );
  }

  lines.push(
    "",
    "Si deseas confirmar el pedido, respóndenos por este medio.",
  );

  return lines.join("\n");
}

/**
 * Construye la URL de WhatsApp dirigida al cliente.
 *
 * A diferencia del WhatsApp público de producto,
 * el destinatario NO es BRAND_CONFIG.contact.whatsapp.
 */
export function buildQuotationWhatsAppUrl(
  request:
    QuotationWhatsAppOutputRequest,
): string {
  const phone =
    normalizeQuotationWhatsAppPhone(
      request.snapshot
        .commercialContext
        .customer
        .whatsapp,
    );

  if (phone.length === 0) {
    throw new Error(
      "La cotización no tiene un WhatsApp de cliente válido.",
    );
  }

  const message =
    buildQuotationWhatsAppMessage(
      request,
    );

  return `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;
}