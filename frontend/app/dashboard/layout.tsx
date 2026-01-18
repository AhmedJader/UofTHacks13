import { ProtectedLayout } from "@/app/_routes/protected-layout";
if (process.env.NODE_ENV === "development") {
  // Wait until MediaPipe's WASM Module exists
  const hookWasmErr = () => {
    const mod = (globalThis as any).Module;
    if (!mod || !mod.printErr) return false;

    const originalPrintErr = mod.printErr;

    mod.printErr = (...args: any[]) => {
      const msg = args.join(" ");

      // Suppress ONLY known MediaPipe spam
      if (
        msg.includes("Packet timestamp mismatch") ||
        msg.includes("gl_graph_runner_internal_image.cc")
      ) {
        return;
      }

      originalPrintErr(...args);
    };

    return true;
  };

  // Try immediately
  if (!hookWasmErr()) {
    // Retry a few times until WASM loads
    let tries = 0;
    const interval = setInterval(() => {
      tries++;
      if (hookWasmErr() || tries > 20) {
        clearInterval(interval);
      }
    }, 100);
  }
}


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
