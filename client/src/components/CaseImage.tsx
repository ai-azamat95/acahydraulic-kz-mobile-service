import { useState, type ComponentProps } from "react";

type CaseImageProps = Pick<ComponentProps<"img">, "src" | "alt" | "className" | "fetchPriority">;

export default function CaseImage({ src, alt, className, fetchPriority }: CaseImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <a href={src} target="_blank" rel="noopener noreferrer"
        className={`flex items-center justify-center bg-[#202020] p-4 text-center text-sm font-semibold text-[#FFC000] underline ${className ?? ""}`}>
        Фото не загрузилось — открыть файл
      </a>
    );
  }

  return <img src={src} alt={alt} className={className} loading="eager" decoding="async"
    fetchPriority={fetchPriority} onError={() => setFailed(true)} />;
}
