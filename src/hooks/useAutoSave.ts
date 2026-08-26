"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { updateSectionAction } from "@/app/actions/cmsActions";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveOptions<T> {
  debounceMs?: number;
  onSaveSuccess?: (savedData: T) => void;
  enabled?: boolean;
}

export function useAutoSave<T>(
  sectionKey: string,
  data: T,
  options?: UseAutoSaveOptions<T>
) {
  const debounceMs = options?.debounceMs ?? 700;
  const enabled = options?.enabled ?? true;

  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isInitialMount = useRef(true);
  const prevDataStringRef = useRef<string>(JSON.stringify(data));
  const dataRef = useRef(data);
  dataRef.current = data;

  const onSaveSuccessRef = useRef(options?.onSaveSuccess);
  onSaveSuccessRef.current = options?.onSaveSuccess;

  const saveNow = useCallback(
    async (customData?: T) => {
      const payload = customData !== undefined ? customData : dataRef.current;
      setSaveStatus("saving");
      setErrorMessage(null);

      try {
        const res = await updateSectionAction(sectionKey, payload);
        if (res.success) {
          prevDataStringRef.current = JSON.stringify(payload);
          setSaveStatus("saved");
          const now = new Date();
          const timeStr = now.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          setLastSavedTime(timeStr);
          onSaveSuccessRef.current?.(payload);

          setTimeout(() => {
            setSaveStatus((current) => (current === "saved" ? "idle" : current));
          }, 3500);
          return true;
        } else {
          setSaveStatus("error");
          setErrorMessage(res.error || "Lỗi lưu dữ liệu");
          return false;
        }
      } catch (e: any) {
        setSaveStatus("error");
        setErrorMessage(e?.message || "Lỗi kết nối");
        return false;
      }
    },
    [sectionKey]
  );

  useEffect(() => {
    if (!enabled) return;

    // Check if data actually changed to avoid triggering on first render or external props sync
    const currentDataString = JSON.stringify(data);

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevDataStringRef.current = currentDataString;
      return;
    }

    if (currentDataString === prevDataStringRef.current) {
      return;
    }

    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      await saveNow(data);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [data, debounceMs, enabled, saveNow]);

  return {
    saveStatus,
    lastSavedTime,
    errorMessage,
    saveNow,
  };
}
