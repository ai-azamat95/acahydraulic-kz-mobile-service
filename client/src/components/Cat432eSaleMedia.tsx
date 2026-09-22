import sale from "../../../shared/cat-432e-sale.json";

export default function Cat432eSaleMedia() {
  return <figure>
    <video controls playsInline preload="none" poster={sale.poster} width={960} height={540}
      aria-label="Видео насоса из заказа для CAT 432E" className="aspect-video w-full rounded-lg bg-black object-contain">
      <source src={sale.video} type="video/mp4" />
      <a href={sale.video}>Открыть видео насоса</a>
    </video>
    <figcaption className="mt-3 text-sm leading-6 text-gray-400">Короткий обзор насоса из материалов заказа: корпус, вал и подключения. Это видео самого узла; проверку под нагрузкой оно не показывает.</figcaption>
  </figure>;
}
