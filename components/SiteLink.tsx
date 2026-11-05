"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLoading } from "./LoadingProvider";

export default function SiteLink({
  children,
  href,
  onNavigate,
  replace,
  scroll,
  transitionTypes,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const { navigate } = useLoading();

  return (
    <Link
      {...props}
      href={href}
      replace={replace}
      scroll={scroll}
      transitionTypes={transitionTypes}
      onNavigate={(event) => {
        let canceled = false;
        onNavigate?.({
          preventDefault: () => {
            canceled = true;
            event.preventDefault();
          },
        });
        if (canceled) return;

        const destination = new URL(href, window.location.href);
        if (
          destination.origin === window.location.origin &&
          destination.pathname === window.location.pathname &&
          destination.search === window.location.search
        )
          return;

        event.preventDefault();
        navigate(destination.href, { replace, scroll, transitionTypes });
      }}
    >
      {children}
    </Link>
  );
}
