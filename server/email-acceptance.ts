/** Keep rejected provider responses out of every sender's success path. No retries. */
export function checkedEmailSend<Args extends unknown[], Result extends { data?: { id?: string } | null; error?: unknown }>(
  send: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  return async (...args) => {
    let result: Result;
    try { result = await send(...args); }
    catch { throw new Error("email_provider_exception"); }
    if (result?.error) throw new Error("email_provider_rejected");
    if (typeof result?.data?.id !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(result.data.id)) {
      throw new Error("email_provider_invalid_response");
    }
    return result;
  };
}
