import { Link } from "wouter";
import merchant from "../../../shared/merchant.json";

export function CommerceLinks() {
  return <nav aria-label="Условия заказа" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
    {[["/payment/", "Оплата"], ["/offer/", "Публичная оферта"], ["/delivery-and-returns/", "Доставка и возврат"], ["/privacy/", "Конфиденциальность"], ["/terms/", "Условия сайта"]].map(([href, label]) =>
      <Link key={href} href={href} className="inline-flex min-h-11 items-center text-[#FFC000] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]">{label}</Link>)}
  </nav>;
}

export function MerchantDetails() {
  const rows = [["Продавец", merchant.name], ["Предприниматель", merchant.owner], ["ИИН", merchant.iin], ["Адрес регистрации", merchant.legalAddress], ["Место работы и самовывоза", merchant.businessAddress], ["Режим работы", merchant.hours], ["ИИК", merchant.iban], ["Банк", merchant.bank], ["БИК", merchant.bic], ["КБЕ", merchant.kbe], ["Валюта", merchant.currency]];
  return <dl className="space-y-3 text-sm leading-relaxed">{rows.map(([label, value]) =>
    <div key={label} className="grid gap-1 border-b border-white/10 pb-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
      <dt className="font-semibold text-white">{label}</dt><dd className="min-w-0 break-words text-gray-300">{value}</dd>
    </div>)}</dl>;
}
