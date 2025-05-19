import React, { useRef, useEffect } from "react";
import Tagify from "@yaireo/tagify/dist/tagify.min";
import "@yaireo/tagify/dist/tagify.css";

const TagifyWrapper = ({ value = [], onChange, settings = {}, disabled = false }) => {
  const inputRef = useRef();
  const tagifyRef = useRef();

  useEffect(() => {
    tagifyRef.current = new Tagify(inputRef.current, {
      ...settings,
      originalInputValueFormat: valuesArr => valuesArr.map(item => item.value)
    });

    tagifyRef.current.on("change", () => {
      try {
        const tagData = tagifyRef.current.value; // ✅ accede directamente a [{ value: "x" }]
        const cleaned = Array.isArray(tagData)
          ? tagData.map(t => typeof t.value === "string" ? t.value.trim() : null).filter(Boolean)
          : [];

        onChange({ detail: { value: cleaned } });
      } catch (err) {
        console.warn("⚠️ Error parsing Tagify change:", err);
        onChange({ detail: { value: [] } });
      }
    });

    return () => tagifyRef.current.destroy();
  }, []);

  useEffect(() => {
    if (tagifyRef.current) {
      tagifyRef.current.removeAllTags();
      tagifyRef.current.addTags(value.map(v => ({ value: v })));
    }
  }, [value]);

  return <input type="text" ref={inputRef} disabled={disabled} />;
};

export default TagifyWrapper;
