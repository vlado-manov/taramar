export type ApiRouteContext = {
    params: Promise<{ id: string }> | { id: string };
  };
  