import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const labels: Record<string, string> = {
  "": "Command Center",
  members: "Matrice des Membres",
  moderation: "Hub de Modération",
  expansion: "Radar d'Expansion",
  finops: "FinOps & Abonnements",
  events: "Gestion des Événements",
  cms: "CMS & Blog",
};

export function AdminBreadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-base">
        <BreadcrumbItem>
          {segments.length === 0 ? (
            <BreadcrumbPage className="font-semibold text-navy">Command Center</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link to="/">Command Center</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          const href = "/" + segments.slice(0, i + 1).join("/");
          return (
            <Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-navy">{labels[seg] ?? seg}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={href}>{labels[seg] ?? seg}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
