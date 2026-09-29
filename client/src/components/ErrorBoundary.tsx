import { cn } from "@/lib/utils";
import { isViteChunkLoadError } from "@/lib/vitePreloadRecovery";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Unhandled application error", error);
  }

  render() {
    if (this.state.hasError) {
      const staleVersion = isViteChunkLoadError(this.state.error);
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#101010] p-6 text-white">
          <div className="flex w-full max-w-xl flex-col items-center border border-white/10 bg-[#151515] p-8 text-center shadow-2xl">
            <AlertTriangle
              size={48}
              className="mb-6 flex-shrink-0 text-[#FFC000]"
            />

            <h1 className="text-2xl font-bold">Страница не загрузилась</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-gray-300">
              {staleVersion
                ? "Сайт обновился, а во вкладке осталась старая версия. Обновите страницу — ссылка и выбранная карточка сохранятся."
                : "Произошла временная техническая ошибка. Обновите страницу или вернитесь в каталог запчастей."}
            </p>

            <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center gap-2 px-5 font-bold",
                  "bg-[#FFC000] text-black hover:bg-[#e6ad00] cursor-pointer"
                )}
              >
                <RotateCcw size={16} />
                Обновить страницу
              </button>
              <a
                href="/catalog"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/20 px-5 font-bold text-white hover:border-[#FFC000] hover:text-[#FFC000]"
              >
                <ArrowLeft size={16} />
                Вернуться в каталог
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
