export interface GraphQLRequestOptions<V extends Record<string, unknown>> {
  query: string;
  variables?: V;
  headers?: HeadersInit;
  method?: 'GET' | 'POST';
}

export interface GraphQLErrorItem {
  message: string;
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<D> {
  data?: D;
  errors?: GraphQLErrorItem[];
}

export async function graphqlFetch<D, V extends Record<string, unknown> = Record<string, unknown>>(
  options: GraphQLRequestOptions<V>,
  endpoint = '/api/graphql'
): Promise<D> {
  const tryPost = async () => {
    return await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(options.headers || {}),
      },
      body: JSON.stringify({ query: options.query, variables: options.variables ?? {} }),
      cache: 'no-store',
    });
  };

  const tryGet = async () => {
    const params = new URLSearchParams({
      query: options.query,
      variables: JSON.stringify(options.variables ?? {}),
    });
    return await fetch(`${endpoint}?${params.toString()}`, {
      method: 'GET',
      headers: { ...(options.headers || {}) },
      cache: 'no-store',
    });
  };

  let res: Response;
  if (options.method === 'GET') {
    res = await tryGet();
  } else if (options.method === 'POST') {
    res = await tryPost();
  } else {
    // Default to POST, fallback to GET on 405
    res = await tryPost();
    if (res.status === 405) {
      res = await tryGet();
    }
  }

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GraphQL network error ${res.status}: ${text}`);
  }

  if (!contentType.includes('application/json')) {
    const snippet = await res.text();
    throw new Error(`GraphQL response is not JSON (content-type: ${contentType}). Snippet: ${snippet.slice(0, 200)}`);
  }

  const json = (await res.json()) as GraphQLResponse<D>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json.data as D;
}


