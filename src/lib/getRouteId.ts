import { ApiRouteContext } from "@/types/ApiParams";

export async function getRouteId(context: ApiRouteContext): Promise<string> {
  console.log("🔍 Raw params received:", context.params);

  const resolved = await context.params;
  console.log("🔍 After await params:", resolved);

  return resolved.id;
}
