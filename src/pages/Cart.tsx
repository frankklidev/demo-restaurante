import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartItems, selectCartTotal } from '../store/cart.selectors';
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

type MetodoEntrega = 'recoger' | 'domicilio';

type CheckoutForm = {
  firstName: string;
  lastName: string;
  phone: string;
  method: MetodoEntrega;
  address: string;
  municipioId: string; // required si domicilio
};

export default function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);

  const currency = items[0]?.product.currency ?? 'USD';

  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    phone: '',
    method: 'recoger',
    address: '',
    municipioId: '',
  });

  const municipio = useMemo(
    () => MUNICIPIOS.find((m) => m.id === form.municipioId),
    [form.municipioId]
  );

  const shipping = form.method === 'domicilio' ? municipio?.fee ?? 0 : 0;
  const total = subtotal + shipping;

  const subtotalLabel = formatMoney(subtotal, currency);
  const shippingLabel = formatMoney(shipping, currency);
  const totalLabel = formatMoney(total, currency);

  const isDelivery = form.method === 'domicilio';

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!form.firstName.trim()) e.firstName = 'Requerido';
    if (!form.lastName.trim()) e.lastName = 'Requerido';
    if (!form.phone.trim()) e.phone = 'Requerido';

    if (isDelivery) {
      if (!form.municipioId) e.municipioId = 'Selecciona un municipio';
      if (!form.address.trim()) e.address = 'Escribe la dirección';
    }

    if (items.length === 0) e.items = 'Carrito vacío';
    return e;
  }, [form, isDelivery, items.length]);

  const canSubmit = Object.keys(errors).length === 0;

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
    if (isDelivery)
      lines.push(`Envío: ${shippingLabel} (${municipio?.name ?? 'Municipio'})`);
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
    if (!canSubmit) return;
    const msg = buildOrderMessage();
    const link = buildWhatsAppLink(WHATSAPP_PHONE, msg);
    window.open(link, '_blank', 'noreferrer');
  };

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
  onClick={() => dispatch(decrement({ productId: product.id }))}
  className="
    h-10 w-10 rounded-2xl
    border border-red-500/50
    bg-red-50/70
    font-black text-red-700
    hover:bg-red-100/80
    transition
  "
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
              onChange={(v) => setForm((s) => ({ ...s, firstName: v }))}
              placeholder='Ej: Juan'
              error={errors.firstName}
            />
            <Field
              label='Apellido'
              value={form.lastName}
              onChange={(v) => setForm((s) => ({ ...s, lastName: v }))}
              placeholder='Ej: Pérez'
              error={errors.lastName}
            />

            <div className='sm:col-span-2'>
              <Field
                label='Teléfono'
                value={form.phone}
                onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
                placeholder='Ej: 53xxxxxxx'
                error={errors.phone}
              />
            </div>

            <div className='sm:col-span-2'>
              <label className='text-sm font-bold text-peppino-dark'>
                Entrega
              </label>
              <div className='mt-2 flex gap-3'>
                <button
                  type='button'
                  onClick={() =>
                    setForm((s) => ({
                      ...s,
                      method: 'recoger',
                      address: '',
                      municipioId: '',
                    }))
                  }
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
                  onClick={() =>
                    setForm((s) => ({ ...s, method: 'domicilio' }))
                  }
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
                <div className='sm:col-span-2'>
                  <label className='text-sm font-bold text-peppino-dark'>
                    Municipio
                  </label>
                  <select
                    value={form.municipioId}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, municipioId: e.target.value }))
                    }
                    className={[
                      'mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-base outline-none',
                      errors.municipioId
                        ? 'border-red-400'
                        : 'border-peppino-dark/20',
                    ].join(' ')}
                  >
                    <option value=''>Selecciona un municipio…</option>
                    {MUNICIPIOS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (+{formatMoney(m.fee, currency)})
                      </option>
                    ))}
                  </select>
                  {errors.municipioId ? (
                    <p className='mt-1 text-xs font-semibold text-red-600'>
                      {errors.municipioId}
                    </p>
                  ) : null}
                </div>

                <div className='sm:col-span-2'>
                  <Field
                    label='Dirección'
                    value={form.address}
                    onChange={(v) => setForm((s) => ({ ...s, address: v }))}
                    placeholder='Ej: Calle 23 #100 e/ 10 y 12, Vedado'
                    error={errors.address}
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
}) {
  const { label, value, onChange, placeholder, error } = props;
  return (
    <div>
      <label className='text-sm font-bold text-peppino-dark'>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          'mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-base text-peppino-dark outline-none placeholder:text-peppino-dark/40',
          error ? 'border-red-400' : 'border-peppino-dark/20',
        ].join(' ')}
      />
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
