import "./AdminAppShell.css";

import type {
  ReactNode,
} from "react";

import {
  FileText,
  LayoutGrid,
  ReceiptText,
} from "lucide-react";

export type AdminSection =
  | "catalog"
  | "catalogs";

interface AdminAppShellProps {
  children: ReactNode;

  activeSection:
    AdminSection;

  onSectionChange: (
    section: AdminSection,
  ) => void;
}

export function AdminAppShell({
  children,
  activeSection,
  onSectionChange,
}: AdminAppShellProps) {
  return (
    <div className="hwa-shell">
      <aside className="hwa-sidebar">
        <div className="hwa-brand">
          <div className="hwa-brand-mark">
            HW
          </div>

          <div>
            <strong>
              Hot Wheels
            </strong>

            <span>
              Admin 1.0
            </span>
          </div>
        </div>

        <nav
          className="hwa-nav"
          aria-label="Administración"
        >
          <button
            type="button"
            className={[
              "hwa-nav-item",
              activeSection ===
                "catalog"
                ? "hwa-nav-item-active"
                : "",
            ].join(" ")}
            onClick={() =>
              onSectionChange(
                "catalog",
              )
            }
          >
            <LayoutGrid
              size={18}
              aria-hidden="true"
            />

            <span>
              Catálogo
            </span>
          </button>

          <button
            type="button"
            className={[
              "hwa-nav-item",
              activeSection ===
                "catalogs"
                ? "hwa-nav-item-active"
                : "",
            ].join(" ")}
            onClick={() =>
              onSectionChange(
                "catalogs",
              )
            }
          >
            <FileText
              size={18}
              aria-hidden="true"
            />

            <span>
              Catálogos
            </span>
          </button>

          <button
            type="button"
            className="hwa-nav-item"
            disabled
            title="Hot Wheels Admin 1.1"
          >
            <ReceiptText
              size={18}
              aria-hidden="true"
            />

            <span>
              Cotizaciones
            </span>

            <small>
              1.1
            </small>
          </button>
        </nav>

        <div className="hwa-sidebar-footer">
          <span>
            Workspace comercial
          </span>

          <strong>
            JUNG
          </strong>
        </div>
      </aside>

      <div className="hwa-workspace">
        <header className="hwa-topbar">
          <div>
            <strong>
              Hot Wheels Admin
            </strong>

            <span>
              Operación comercial
            </span>
          </div>

          <div className="hwa-version">
            1.0 · R4
          </div>
        </header>

        <main className="hwa-main">
          {children}
        </main>
      </div>
    </div>
  );
}
