// src/routes/_authenticated.tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    const { user } = context.auth;

    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
          error: 'unauthorized',
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}