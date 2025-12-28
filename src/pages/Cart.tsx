import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartItems, selectCartTotal } from '../store/cart.selectors';
import { FiUser, FiPhone, FiMapPin, FiHome } from 'react-icons/fi';
import {
  addToCart,
  clearCart,
  decrement,
  removeFromCart,
  setQty,
} from '../store/cart.slice';
import { formatMoney } from '../lib/format';
import { WHATSAPP_PHONE, RESTAURANT_NAME } from '../data/products';
import { buildWhatsAppLink } from '../lib/whatsapp';
import { MUNICIPIOS } from '../data/delivery';

const phoneRegex = /^[0-9+\s()-]{7,}$/;

const checkoutSchema = z
  .object({
    firstName: z.string().trim().min(1, "Nombre requerido"),
    lastName: z.string().trim().min(1, "Apellido requerido"),
    phone: z
      .string()
      .trim()
      .min(1, "Teléfono requerido")
      .regex(phoneRegex, "Teléfono inválido"),
    method: z.enum(["recoger", "domicilio"]),
    address: z.string().trim().optional().default(""),
    municipioId: z.string().trim().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.method === "domicilio") {
      if (!data.municipioId) {
        ctx.addIssue({
          code: "custom",
          path: ["municipioId"],
          message: "Selecciona un municipio",
        });
      }

      if (!data.address || data.address.trim().length < 5) {
        ctx.addIssue({
          code: "custom",
          path: ["address"],
          message: "Escribe una dirección válida",
        });
      }
    }
  });

type CheckoutForm = z.infer<typeof checkoutSchema>;
type FieldErrors = Partial<Record<keyof CheckoutForm, string>>;

export default function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);

  const currency = items[0]?.product.currency ?? 'USD';

  const CHECKOUT_KEY = 'peppino_checkout_v1';

  function loadCheckout(): CheckoutForm | null {
    try {
      const raw = localStorage.getItem(CHECKOUT_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as CheckoutForm;
    } catch {
      return null;
    }
  }

  function saveCheckout(data: CheckoutForm) {
    try {
      localStorage.setItem(CHECKOUT_KEY, JSON.stringify(data));
    } catch {}
  }

  const [form, setForm] = useState<CheckoutForm>(() => {
    return (
      loadCheckout() ?? {
        firstName: '',
        lastName: '',
        phone: '',
        method: 'recoger',
        address: '',
        municipioId: '',
      }
    );
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const municipio = useMemo(
    () => MUNICIPIOS.find((m) => m.id === form.municipioId),
    [form.municipioId]
  );

  const isDelivery = form.method === 'domicilio';
  const shipping = isDelivery ? municipio?.fee ?? 0 : 0;
  const total = subtotal + shipping;

  const subtotalLabel = formatMoney(subtotal, currency);
  const shippingLabel = formatMoney(shipping, currency);
  const totalLabel = formatMoney(total, currency);

  const isFormFilled =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.phone.trim() &&
    (form.method === 'recoger' ||
      (form.municipioId.trim() && form.address.trim()));

  const validateForm = (data: CheckoutForm) => {
    const result = checkoutSchema.safeParse(data);

    if (result.success) {
      setFieldErrors({});
      return { ok: true as const, data: result.data };
    }

    const errs: FieldErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof CheckoutForm | undefined;
      if (key && !errs[key]) errs[key] = issue.message;
    }
    setFieldErrors(errs);
    return { ok: false as const };
  };

  const setFormField = <K extends keyof CheckoutForm>(
    key: K,
    value: CheckoutForm[K]
  ) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      saveCheckout(next);
      validateForm(next);
      return next;
    });
  };

  const buildOrderMessage = () => {
    const lines: string[] = [];

    lines.push(`Hola! 👋 Soy cliente de ${RESTAURANT_NAME}.`);
    lines.push('');
    lines.push('🧾 *Pedido*');
    items.forEach(({ product, qty }) => {
      const lineTotal = formatMoney(product.price * qty, product.currency);
      lines.push(`• ${qty} x ${product.name} (${product.unit}) — ${lineTotal}`);
    });

    lines.push('');
    lines.push(`Subtotal: ${subtotalLabel}`);
    if (isDelivery) {
      lines.push(`Envío: ${shippingLabel} (${municipio?.name ?? 'Municipio'})`);
    }
    lines.push(`Total: *${totalLabel}*`);

    lines.push('');
    lines.push('👤 *Datos del cliente*');
    lines.push(`Nombre: ${form.firstName} ${form.lastName}`);
    lines.push(`Teléfono: ${form.phone}`);

    lines.push('');
    lines.push('📦 *Entrega*');
    lines.push(
      isDelivery ? 'Método: Domicilio' : 'Método: Recoger en el local'
    );

    if (isDelivery) {
      lines.push(`Municipio: ${municipio?.name ?? '-'}`);
      lines.push(`Dirección: ${form.address}`);
    }

    lines.push('');
    lines.push('¿Me confirmas disponibilidad y tiempo estimado? 🙌');

    return lines.join('\n');
  };

  const onCompleteOrder = () => {
    if (items.length === 0) return;

    const result = validateForm(form);
    if (!result.ok) return;

    const msg = buildOrderMessage();
    const link = buildWhatsAppLink(WHATSAPP_PHONE, msg);
    window.open(link, '_blank', 'noreferrer');
  };

  const canSubmit =
    items.length > 0 && isFormFilled && Object.keys(fieldErrors).length === 0;

  if (items.length === 0) {
    return (
      <div className='rounded-3xl border border-peppino-dark/10 bg-white p-10 text-center'>
        <div className='text-2xl font-black text-peppino-dark'>
          Tu carrito está vacío
        </div>
        <p className='mt-2 text-sm text-peppino-dark/70'>
          Agrega productos desde el catálogo.
        </p>
        <Link
          to='/catalogo'
          className='mt-6 inline-flex rounded-2xl bg-peppino-dark px-6 py-3 text-sm font-black text-peppino-cream hover:opacity-90'
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='rounded-3xl border border-peppino-dark/10 bg-white p-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h1 className='text-2xl font-black text-peppino-dark'>Carrito</h1>
          <button
            onClick={() => dispatch(clearCart())}
            className='rounded-2xl bg-peppino-light px-4 py-2 text-sm font-bold text-peppino-dark border border-peppino-dark/20 hover:opacity-90'
          >
            Vaciar
          </button>
        </div>
      </div>

      {/* Items */}
      <div className='rounded-3xl border border-peppino-dark/10 bg-white p-6 space-y-4'>
        {items.map(({ product, qty }) => {
          const lineTotal = product.price * qty;

          return (
            <div
              key={product.id}
              className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-peppino-dark/10 pb-4 last:border-b-0 last:pb-0'
            >
              <div className='flex items-center gap-4'>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className='h-16 w-16 rounded-2xl object-cover border border-peppino-dark/10'
                />
                <div>
                  <div className='font-extrabold text-peppino-dark'>
                    {product.name}
                  </div>
                  <div className='text-sm text-peppino-dark/70'>
                    {product.unit} ·{' '}
                    {formatMoney(product.price, product.currency)}
                  </div>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-3 justify-between sm:justify-end'>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() =>
                      dispatch(decrement({ productId: product.id }))
                    }
                    className='
                      h-10 w-10 rounded-2xl
                      border border-red-500/50
                      bg-red-50/70
                      font-black text-red-700
                      hover:bg-red-100/80
                      transition
                    '
                  >
                    −
                  </button>

                  <input
                    value={qty}
                    onChange={(e) =>
                      dispatch(
                        setQty({
                          productId: product.id,
                          qty: Number(e.target.value || 0),
                        })
                      )
                    }
                    className='h-10 w-16 rounded-2xl border border-peppino-dark/20 text-center font-bold text-peppino-dark outline-none'
                    inputMode='numeric'
                  />

                  <button
                    onClick={() => dispatch(addToCart({ product, qty: 1 }))}
                    className='h-10 w-10 rounded-2xl bg-peppino-light border border-peppino-dark/20 font-black text-peppino-dark hover:opacity-90'
                  >
                    +
                  </button>
                </div>

                <div className='text-sm font-black text-peppino-dark'>
                  {formatMoney(lineTotal, product.currency)}
                </div>

                <button
                  onClick={() =>
                    dispatch(removeFromCart({ productId: product.id }))
                  }
                  className='
                    rounded-2xl px-3 py-2 text-sm font-bold
                    border border-red-400
                    text-red-600
                    hover:bg-red-50
                    transition
                  '
                >
                  Quitar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Form */}
        <div className='rounded-3xl border border-peppino-dark/10 bg-white p-6'>
          <h2 className='text-xl font-black text-peppino-dark'>
            Completar pedido
          </h2>
          <p className='mt-1 text-sm text-peppino-dark/70'>
            Completa tus datos para finalizar por WhatsApp.
          </p>

          <div className='mt-5 grid gap-4 sm:grid-cols-2'>
            <Field
              label='Nombre'
              value={form.firstName}
              onChange={(v) => setFormField('firstName', v)}
              placeholder='Ej: Juan'
              error={fieldErrors.firstName}
              icon={<FiUser />}
            />
            <Field
              label='Apellido'
              value={form.lastName}
              onChange={(v) => setFormField('lastName', v)}
              placeholder='Ej: Pérez'
              error={fieldErrors.lastName}
              icon={<FiUser />}
            />

            <div className='sm:col-span-2'>
              <Field
                label='Teléfono'
                value={form.phone}
                onChange={(v) => setFormField('phone', v)}
                placeholder='Ej: 53xxxxxxx'
                error={fieldErrors.phone}
                icon={<FiPhone />}
              />
            </div>

            <div className='sm:col-span-2'>
              <label className='text-sm font-bold text-peppino-dark'>
                Entrega
              </label>
              <div className='mt-2 flex gap-3'>
                <button
                  type='button'
                  onClick={() => {
                    const next: CheckoutForm = {
                      ...form,
                      method: 'recoger',
                      address: '',
                      municipioId: '',
                    };
                    setForm(next);
                    saveCheckout(next);
                    validateForm(next);
                  }}
                  className={[
                    'rounded-2xl px-5 py-2.5 text-sm font-black border transition',
                    form.method === 'recoger'
                      ? 'bg-peppino-dark text-peppino-cream border-peppino-dark'
                      : 'bg-white text-peppino-dark border-peppino-dark/20 hover:bg-peppino-light/60',
                  ].join(' ')}
                >
                  Recoger
                </button>

                <button
                  type='button'
                  onClick={() => {
                    const next: CheckoutForm = { ...form, method: 'domicilio' };
                    setForm(next);
                    validateForm(next);
                  }}
                  className={[
                    'rounded-2xl px-5 py-2.5 text-sm font-black border transition',
                    form.method === 'domicilio'
                      ? 'bg-peppino-dark text-peppino-cream border-peppino-dark'
                      : 'bg-white text-peppino-dark border-peppino-dark/20 hover:bg-peppino-light/60',
                  ].join(' ')}
                >
                  Domicilio
                </button>
              </div>
            </div>

            {isDelivery && (
              <>
                <div className='mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3'>
                  <FiMapPin className='text-peppino-dark/50 text-lg' />

                  <select
                    value={form.municipioId}
                    onChange={(e) =>
                      setFormField('municipioId', e.target.value)
                    }
                    className='w-full bg-transparent text-base text-peppino-dark outline-none'
                  >
                    <option value=''>Elige Municipio</option>
                    {MUNICIPIOS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (+{formatMoney(m.fee, currency)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className='sm:col-span-2'>
                  <Field
                    label='Dirección'
                    value={form.address}
                    onChange={(v) => setFormField('address', v)}
                    placeholder='Ej: Calle 23 #100 e/ 10 y 12'
                    error={fieldErrors.address}
                    icon={<FiHome />}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className='rounded-3xl border border-peppino-dark/10 bg-white p-6'>
          <h2 className='text-xl font-black text-peppino-dark'>Resumen</h2>

          <div className='mt-5 space-y-3 text-sm'>
            <Row label='Subtotal' value={subtotalLabel} />
            <Row
              label='Envío'
              value={isDelivery ? shippingLabel : formatMoney(0, currency)}
              hint={
                isDelivery
                  ? municipio?.name ?? 'Selecciona municipio'
                  : 'Recoger'
              }
            />
            <div className='h-px bg-peppino-dark/10 my-3' />
            <div className='flex items-center justify-between'>
              <span className='text-peppino-dark/70'>Total</span>
              <span className='text-2xl font-black text-peppino-dark'>
                {totalLabel}
              </span>
            </div>
          </div>

          <button
            disabled={!canSubmit}
            onClick={onCompleteOrder}
            className={[
              'mt-6 w-full rounded-2xl px-6 py-4 text-sm font-black transition',
              canSubmit
                ? 'bg-peppino-dark text-peppino-cream hover:opacity-90'
                : 'bg-peppino-dark/40 text-peppino-cream/70 cursor-not-allowed',
            ].join(' ')}
          >
            Completar pedido por WhatsApp
          </button>

          {!canSubmit && (
            <p className='mt-3 text-xs text-peppino-dark/70'>
              Completa los campos requeridos para finalizar.
            </p>
          )}

          <Link
            to='/catalogo'
            className='mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-peppino-light px-6 py-3 text-sm font-black text-peppino-dark border border-peppino-dark/20 hover:opacity-90'
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  icon: React.ReactNode;
}) {
  const { label, value, onChange, placeholder, error, icon } = props;

  return (
    <div>
      <label className='text-sm font-bold text-peppino-dark'>{label}</label>

      <div
        className={[
          'mt-2 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition',
          error ? 'border-red-400' : 'border-peppino-dark/20',
        ].join(' ')}
      >
        <span
          className={[
            'text-lg',
            error ? 'text-red-500' : 'text-peppino-dark/50',
          ].join(' ')}
        >
          {icon}
        </span>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className='w-full bg-transparent text-base text-peppino-dark outline-none placeholder:text-peppino-dark/40'
        />
      </div>

      {error ? (
        <p className='mt-1 text-xs font-semibold text-red-600'>{error}</p>
      ) : null}
    </div>
  );
}

function Row(props: { label: string; value: string; hint?: string }) {
  const { label, value, hint } = props;
  return (
    <div className='flex items-start justify-between gap-4'>
      <div>
        <div className='font-semibold text-peppino-dark/80'>{label}</div>
        {hint ? (
          <div className='text-xs text-peppino-dark/60'>{hint}</div>
        ) : null}
      </div>
      <div className='font-black text-peppino-dark'>{value}</div>
    </div>
  );
}
