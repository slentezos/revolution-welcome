import { useSearchParams } from "react-router-dom";
import { DEFAULT_SECTION, isAdminSectionId, type AdminSectionId } from "./navigation";

/** Read & write the current admin section via the `?section=` search param. */
export function useAdminSection(): {
  section: AdminSectionId;
  setSection: (id: AdminSectionId) => void;
} {
  const [params, setParams] = useSearchParams();
  const raw = params.get("section");
  const section = isAdminSectionId(raw) ? raw : DEFAULT_SECTION;

  const setSection = (id: AdminSectionId) => {
    const next = new URLSearchParams(params);
    next.set("section", id);
    setParams(next, { replace: false });
  };

  return { section, setSection };
}
