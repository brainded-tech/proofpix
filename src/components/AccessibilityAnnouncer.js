// components/AccessibilityAnnouncer.js
import React, { useEffect, useRef } from 'react';

const AccessibilityAnnouncer = ({ message, priority = 'polite' }) => {
  const announcerRef = useRef(null);

  useEffect(() => {
    if (message && announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  }, [message]);

  return (
    <div
      ref={announcerRef}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
    />
  );
};

export default AccessibilityAnnouncer;
