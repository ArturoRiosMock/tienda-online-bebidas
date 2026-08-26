import React, { useState } from 'react';
import { isEdicionAuthenticated, setEdicionSession } from '@/app/utils/edicionAuth';
import { useEdicionDraft } from '@/app/components/edicion/useEdicionDraft';
import { EdicionLogin } from '@/app/components/edicion/EdicionLogin';
import { EdicionTopBar } from '@/app/components/edicion/EdicionTopBar';
import { EdicionSections } from '@/app/components/edicion/EdicionSections';
import { EdicionLoadState } from '@/app/components/edicion/EdicionLoadState';
import { PublishBar } from '@/app/components/edicion/PublishBar';

export const EdicionHomePage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(isEdicionAuthenticated);
  const draft = useEdicionDraft(authenticated);

  const logout = () => {
    setEdicionSession(null);
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <EdicionLogin onSuccess={() => setAuthenticated(true)} />;
  }

  const content = draft.draft;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <EdicionTopBar onLogout={logout} />

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-5">
        {content ? (
          <EdicionSections
            content={content}
            slideIds={draft.slideIds}
            onContent={draft.setDraft}
            onSlideIds={draft.setSlideIds}
            onUploadingChange={draft.trackUpload}
          />
        ) : (
          <EdicionLoadState loading={draft.loading} error={draft.loadError} />
        )}
      </div>

      {content && (
        <PublishBar
          dirty={draft.dirty}
          publishing={draft.publishing}
          uploads={draft.uploads}
          status={draft.status}
          onPublish={draft.publish}
        />
      )}
    </div>
  );
};
