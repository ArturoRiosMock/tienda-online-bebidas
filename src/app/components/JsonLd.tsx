import React from 'react';

interface JsonLdProps {
  /** Schema u objeto schema.org (o un array de varios). */
  schema: object | object[];
}

/**
 * Inyecta uno o varios bloques `<script type="application/ld+json">` en el
 * árbol de la página. Google reconoce JSON-LD en cualquier parte del HTML.
 */
export const JsonLd: React.FC<JsonLdProps> = ({ schema }) => {
  const blocks = Array.isArray(schema) ? schema : [schema];
  return (
    <>
      {blocks.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  );
};
