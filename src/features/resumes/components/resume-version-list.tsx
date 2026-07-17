"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { DeleteResumeVersionControl } from "@/features/resumes/components/delete-resume-version-control";
import type { ResumeVersionListItem } from "@/server/resumes/resume-versions";

export function ResumeVersionList({
  items: initialItems,
}: {
  items: ResumeVersionListItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const announcementRef = useRef<HTMLParagraphElement>(null);

  const handleDeleted = useCallback((id: string, name: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    requestAnimationFrame(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = `${name} was deleted.`;
        announcementRef.current.focus();
      }
    });
  }, []);

  return (
    <>
      <p
        aria-live="polite"
        className="sr-only"
        ref={announcementRef}
        tabIndex={-1}
      />
      {items.length === 0 ? (
        <div className="border-border bg-surface rounded-xl border p-8 text-center">
          <p className="text-primary text-lg font-semibold">
            No resume versions yet
          </p>
          <p className="text-secondary mx-auto mt-2 max-w-lg">
            Save your first resume version, then associate it with the
            applications where you use it.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-cyan-600 px-5 text-sm font-semibold text-white"
            href="/resumes/new"
          >
            Add resume version
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 md:hidden">
            {items.map((item) => (
              <ResumeCard item={item} key={item.id} onDeleted={handleDeleted} />
            ))}
          </div>
          <div className="border-border bg-surface hidden overflow-hidden rounded-xl border md:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Saved resume versions</caption>
              <thead className="border-border bg-canvas border-b">
                <tr>
                  <th className="px-5 py-4 font-semibold" scope="col">
                    Resume
                  </th>
                  <th className="px-5 py-4 font-semibold" scope="col">
                    Source
                  </th>
                  <th className="px-5 py-4 font-semibold" scope="col">
                    Applications
                  </th>
                  <th className="px-5 py-4 font-semibold" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4 align-top">
                      <p className="text-primary font-semibold">{item.name}</p>
                      <p className="text-secondary mt-1">
                        {item.versionLabel} · Version {item.version}
                      </p>
                      {item.description ? (
                        <p className="text-secondary mt-2 max-w-md">
                          {item.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="text-secondary px-5 py-4 align-top">
                      {item.sourceFileName ?? "Not recorded"}
                    </td>
                    <td className="text-secondary px-5 py-4 align-top">
                      {item.applicationCount}
                    </td>
                    <td className="px-5 py-2 align-top">
                      <div className="flex gap-4">
                        <Link
                          aria-label={`Edit ${item.name}, ${item.versionLabel}`}
                          className="inline-flex min-h-11 items-center font-semibold text-cyan-700 hover:underline dark:text-cyan-300"
                          href={`/resumes/${item.id}/edit`}
                        >
                          Edit
                        </Link>
                        <DeleteResumeVersionControl
                          versionLabel={item.versionLabel}
                          name={item.name}
                          onDeleted={handleDeleted}
                          resumeVersionId={item.id}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

function ResumeCard({
  item,
  onDeleted,
}: {
  item: ResumeVersionListItem;
  onDeleted: (id: string, name: string) => void;
}) {
  return (
    <article className="border-border bg-surface rounded-xl border p-5">
      <h2 className="text-primary font-semibold">{item.name}</h2>
      <p className="text-secondary mt-1 text-sm">
        {item.versionLabel} · Version {item.version}
      </p>
      {item.description ? (
        <p className="text-secondary mt-3 text-sm">{item.description}</p>
      ) : null}
      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="font-semibold">Source filename</dt>
          <dd className="text-secondary mt-1 break-all">
            {item.sourceFileName ?? "Not recorded"}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Associated applications</dt>
          <dd className="text-secondary mt-1">{item.applicationCount}</dd>
        </div>
      </dl>
      <div className="border-border mt-4 flex gap-5 border-t pt-2">
        <Link
          aria-label={`Edit ${item.name}, ${item.versionLabel}`}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-cyan-700 dark:text-cyan-300"
          href={`/resumes/${item.id}/edit`}
        >
          Edit
        </Link>
        <DeleteResumeVersionControl
          versionLabel={item.versionLabel}
          name={item.name}
          onDeleted={onDeleted}
          resumeVersionId={item.id}
        />
      </div>
    </article>
  );
}
